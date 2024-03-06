<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/converter/converterCore.php';
    require_once $rootpath.'/fd/resources/php/converter/converterConfig.php';
    require_once $rootpath.'/fd/resources/php/converter/NC/NCCodeHelper.php';
    require_once $rootpath.'/fd/resources/php/project/project.php';

    trait genNCCodeHelperLaser {
        public function add_G(int $GNumber, Coords|null $coords = null, int|string $F = "", int|string $S = "") : string {
            $c = $this -> parseCoords($coords);
            if($F != ""){
                $F = " F" . $F;
            }
            if($S != ""){
                $S = " S" . $S;
            }
            $result = "G" . $GNumber . $c -> x . $c -> y . $c -> z . $F . $S . "\r\n";
            if(isset($this -> CodeString)){
                $this -> CodeString .= $result;
            }
            return $result;
        }
        public function add_S(int $intensity = 0) : string {
            $result = "S" . $intensity . "\r\n";
            if(isset($this -> CodeString)){
                $this -> CodeString .= $result;
            }
            return $result;
        }
        public function parseCoords(Coords|null $coords = null) : stdClass {
            $strCoords = new stdClass();
            $strCoords -> x = "";
            $strCoords -> y = "";
            $strCoords -> z = "";

            if($coords === null){
                return $strCoords;
            }
            if($coords -> x !== null){
                $strCoords -> x = " X" . $coords -> x;
            }
            if($coords -> y !== null){
                $strCoords -> y = " Y" . $coords -> y;
            }
            if($coords -> z !== null){
                $strCoords -> z = " Z" . 10;
            }
            return $strCoords;
        }
    }
    class NCLaserModel_Flat {
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

        public function __construct(PathObject3D $pathObject, stdClass|null $cfg = null){
            $this -> PathObject = $pathObject;
            if($cfg != null){
                $this -> cfg = $cfg;
            } else {
                $this -> cfg = ConverterConfig::get();
            }
            $this -> digits = $this -> cfg -> digits;
        }        
        public static function getGCode(PathObject3D $pathObject) : string {
            return (new self($pathObject)) -> get();
        }
        public function save(string $path){
            // file_put_contents($path, $this -> get());
            writeToFile($path, $this -> get());
        }
        public function get(){
            $this -> getStart();
            $pathElements = $this -> PathObject -> getElements();

            // $this -> add_G(0, Coords::get(null, null, null));
            foreach($pathElements as $pathElement){
                $this -> newElement($pathElement);
            }
            $this -> CodeString .= $this -> getEnd();
            return $this -> CodeString;
        }    
        private function newElement(PathElement3D &$pathElement){
            $steps = $pathElement -> getSteps();
            $lastStep = [];
            foreach($steps as $key => $step){
                $this -> scale($step);
                if(count($lastStep) == 0){
                    $lastStep = $step;
                }
                if($key == 0){
                    // $this -> CodeString .= "\r\nM220 S200\r\n";
                    $this -> CodeString .= "M400\r\n";
                    $this -> add_S(0);
                    $this -> add_G(0, Coords::get($step['x'], $step['y'], 10), $this -> cfg -> laser -> fastTravel -> F);
                    $this -> CodeString .= "M400\r\n";
                    // $this -> add_S(1);
                    $this -> add_G(1, Coords::get($step['x'], $step['y'], 10), $this -> cfg -> laser -> workTravel -> F);
                    // $this -> CodeString .= "M220 S100\r\n";
                    // $this -> add_G(1, null, 1500);
                    // $this -> CodeString .= "M400\r\n";
                    // $this -> CodeString .= "M220 S100\r\n";
                }
                $this -> add_G(1, Coords::get($step['x'], $step['y']), "", intval($step['z']));
            }                
            // $this -> length += sqrt(pow($step['x'] - $lastStep['x'], 2) + pow($step['y'] - $lastStep['y'], 2));
            $lastStep = $step;
            // $this -> CodeString .= "\r\nM220 S100";
            // $this -> CodeString .= "\r\nM400\r\n\r\n";
        }
        private function scale(array &$step){            
            $step['x'] = round($this -> xNull + ($step['x']) * $this -> scale, $this -> digits) * $this -> XMultiply;
            $step['y'] = round($this -> yNull + (($step['y']*-1)) * $this -> scale, $this -> digits) * $this -> YMultiply;
        }
        private function getStart(){
            $this -> CodeString .= "G00 G17 G40 G21 G54\r\nG90\r\nM4\r\nM8\r\n";// $this -> CodeString .= "M220 S500\r\n";
            // $this -> CodeString .= "\r\nM400\r\n";
            // $this -> CodeString .= "M220 S100\r\n\r\n";
            // $this -> add_G(1, Coords::get(70, 120, 75), 3000);
        }
        private function getEnd(){

            // $this -> add_G(0, Coords::get(null, null, 0.1), $cfg -> fastTravel -> F ,$cfg -> fastTravel -> S);
            $this -> CodeString .= "\r\nM5\r\n";
            // $this -> add_G(0, Coords::get(0.1, 0.1, 0.1), $cfg -> fastTravel -> F, $cfg -> fastTravel -> S);
            $str = "M2\r\n";
            // $this -> CodeString = ";full engraving length: " . round($this -> length, 2) . "mm\r\n" . $this -> CodeString;
            // $this -> CodeString = ";full engraving duration: " . $this -> calcTime() . "\r\n" . $this -> CodeString;
            return $str;
        }
        private function calcTime(){
            $length = $this -> length;
            $cfg = $this -> cfg -> laser;
            $speed = round($cfg -> workTravel -> F / 60, 0);
            $duration = round(($speed * $length) / 60, 2);
            return explode('.',$duration)[0] ."min " . explode('.', $duration)[1] . "s" ;
        }
        // public static function getFromPathObject(PathObject $pathObject){
        //     $pathElements = $pathObject -> getElements();
        //     $result = "G28 \r\n
        //                 G0 Z0\r\n\r\n";
        //     foreach($pathElements as $pathElement){
        //         $steps = $pathElement -> getSteps();
        //         foreach($steps as $key => $step){
        //             scale($step);
        //             if($key == 0){
        //                 // $result .= "SET_PIN PIN=TOOL VALUE=0\r\n";
        //                 $result .= "G0 Z1 F3000\r\n";
        //                 $result .= "G0 X" . $step['x'] . " Y" . -$step['y'] . "\r\n";
        //                 $result .= "G0 Z0.1\r\n";
        //                 // $result .= "SET_PIN PIN=TOOL VALUE=1\r\n";
        //                 $result .= "G0 F100\r\n";
        //             }
        //             $result .= "G1 X" . $step['x'] . " Y" . -$step['y'] . "\r\n";
        //         }
        //         $result .= "\r\n";
        //     }
        //     // $result .= "SET_PIN PIN=TOOL VALUE=0\r\n";
        //     // $path = PATH_Project::get(PATH_Project::NONE, )
        //     return $result;

        // }
    }