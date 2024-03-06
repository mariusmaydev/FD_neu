<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/converter/converterCore.php';
    require_once $rootpath.'/fd/resources/php/converter/converterConfig.php';
    require_once $rootpath.'/fd/resources/php/converter/NC/NCCodeHelper.php';
    require_once $rootpath.'/fd/resources/php/project/project.php';


    //höhe 50    -  47
    //breite 34  -  31,1
    class NCLaserModel {
        public $CodeString = "";
        public $PathObject;

        public $digits      = 0;
        public $xNull       = 0;
        public $yNull       = 0;
        public $scale       = 1;
        public $XMultiply   = 1;
        public $YMultiply   = 1;
        public $length      = 0;
        public $cfg         = null; 
        use genNCCodeHelper;
  
        public function __construct(PathObject2D $pathObject, stdClass|null $cfg = null){
            $this -> PathObject = $pathObject;
            if($cfg != null){
                $this -> cfg = $cfg;
            } else {
                $this -> cfg = ConverterConfig::get();
            }
            $this -> digits = $this -> cfg -> digits;
        }    
        public static function getGCode(PathObject2D $pathObject) : string {
            return (new self($pathObject)) -> get();
        }
        public function save(string $path){
            writeToFile($path, $this -> get());
        }
        public function get(){
            $this -> getStart();
            $pathElements = $this -> PathObject -> getElements();
            foreach($pathElements as $pathElement){
                $this -> newElement($pathElement);
            }
            $this -> CodeString .= $this -> getEnd();
            return $this -> CodeString;
        }    
        private function newElement(PathElement2D &$pathElement){
            $cfg = ConverterConfig::get() -> laser;
            $steps = $pathElement -> getSteps();
            $lastStep = [];
            foreach($steps as $key => $step){
                $this -> scale($step);
                if(count($lastStep) == 0){
                    $lastStep = $step;
                }
                if($key == 0){
                    $this -> CodeString .= "\r\n";
                    $this -> add_G(0, Coords::get($step['x'], $step['y']), $cfg -> fastTravel -> F, $cfg -> fastTravel -> S);
                    $this -> add_G(1, Coords::get($step['x'], $step['y']), $cfg -> workTravel -> F, $cfg -> workTravel -> S);
                } else {
                    $this -> add_G(1, Coords::get($step['x'], $step['y']));
                }
                // $this -> length += sqrt(pow($step['x'] - $lastStep['x'], 2) + pow($step['y'] - $lastStep['y'], 2));
                $lastStep = $step;
            }
        }
        private function scale(array &$step){         
            $step['x'] = round($this -> xNull + ($step['x']) * $this -> scale, $this -> digits) * $this -> XMultiply;
            $step['y'] = -round(-$this -> yNull + (($step['y'])) * $this -> scale, $this -> digits) * $this -> YMultiply;
        }
        private function getStart(){
            $this -> CodeString .= "G00 G17 G40 G21 G54\r\nG90\r\n";
            if($this -> cfg -> laser -> M4orM3 == "M3"){
                $this -> CodeString .= "M3\r\nM8\r\n";
            } else {
                $this -> CodeString .= "M4\r\nM8\r\n";
            }
        }
        private function getEnd(){
            $this -> CodeString .= "\r\nM5\r\n";
            $str = "M2\r\n";
            // $this -> CodeString = ";full engraving length: " . round($this -> length, 2) . "mm\r\n" . $this -> CodeString;
            // $this -> CodeString = ";full engraving duration: " . $this -> calcTime() . "\r\n" . $this -> CodeString;
            return $str;
        }
        private function calcTime(){
            $length = $this -> length;
            $speed = round($this -> cfg -> laser -> workTravel -> F / 60, 0);
            $duration = round(($length / $speed) / 60, 2);
            Debugger::log($duration);
            return explode('.',$duration)[0] ."min " . explode('.', $duration)[1] . "s" ;
        }
    }