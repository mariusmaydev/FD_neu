<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/converter/converterCore.php';
    require_once $rootpath.'/fd/resources/php/converter/converterConfig.php';
    require_once $rootpath.'/fd/resources/php/project/project.php';

    trait genNCCodeHelper {
        public function add_G(int $GNumber, Coords|null $coords = null, int|string $F = "") : string {
            $c = $this -> parseCoords($coords);
            if($F != ""){
                $F = " F" . $F;
            }
            $result = "G" . $GNumber . $c -> x . $c -> y . $c -> z . $F . "\r\n";
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
                $strCoords -> z = " Z" . $coords -> z;
            }
            return $strCoords;
        }
    }
    class NCModel {
        public $CodeString = "";
        public $PathObject;

        public $digits      = 2;
        public $xNull       = 0;
        public $yNull       = 0;
        public $scale       = 1;
        public $XMultiply   = 1;
        public $YMultiply   = 1;
        public $length      = 0;

        use genNCCodeHelper;

        public function __construct(PathObject $pathObject){
            $this -> PathObject = $pathObject;
        }        
        public static function getGCode(PathObject $pathObject) : string {
            return (new self($pathObject)) -> get();
        }
        public function save(string $path){
            // file_put_contents($path, $this -> get());
            // file_put_contents("test.nc", base_convert(unpack('H*',$this -> get())[1], 16, 2));
            // $q = pack('H*', base_convert(file_get_contents("test.nc"), 2, 16));
            writeToFile($path, $this -> get());
            // $a = file_get_contents($path);
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
        private function newElement(PathElement2D &$pathElement){
            $cfg = ConverterConfig::get() -> engraving;

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
                    $this -> add_G(0, Coords::get(null, null, $cfg -> fastTravel -> height), $cfg -> fastTravel -> F);
                    $this -> CodeString .= "M400\r\n";
                    $this -> add_G(0, Coords::get($step['x'], $step['y']), $cfg -> fastTravel -> F);
                    $this -> CodeString .= "M400\r\n";
                    // $this -> CodeString .= "M220 S100\r\n";
                    $this -> add_G(1, Coords::get(null, null,  $cfg -> workTravel -> height), $cfg -> workTravel -> F);
                    $this -> CodeString .= "M400\r\n";
                    // $this -> add_G(1, null, 1500);
                    // $this -> CodeString .= "M400\r\n";
                    // $this -> CodeString .= "M220 S100\r\n";
                }
                $this -> add_G(1, Coords::get($step['x'], $step['y']));
                $this -> length += sqrt(pow($step['x'] - $lastStep['x'], 2) + pow($step['y'] - $lastStep['y'], 2) + pow($step['z'] - $lastStep['z'], 2));
                $lastStep = $step;
            }
            // $this -> CodeString .= "\r\nM220 S100";
            // $this -> CodeString .= "\r\nM400\r\n\r\n";
        }
        private function scale(array &$step){         
            $step['x'] = round($this -> xNull + ($step['x']) * $this -> scale, $this -> digits) * $this -> XMultiply;
            $step['y'] = -round(-$this -> yNull + (($step['y'])) * $this -> scale, $this -> digits) * $this -> YMultiply;
        }
        private function getStart(){
            $cfg = ConverterConfig::get() -> engraving;
            $this -> CodeString .= "G90\r\nG28\r\n";
            $this -> add_G(0, Coords::get(round($this -> xNull, $this -> digits), round( $this -> yNull, $this -> digits), 0.5), $cfg -> fastTravel -> F);
            // $this -> CodeString .= "M220 S500\r\n";
            // $this -> CodeString .= "\r\nM400\r\n";
            // $this -> CodeString .= "M220 S100\r\n\r\n";
            // $this -> add_G(1, Coords::get(70, 120, 75), 3000);
        }
        private function getEnd(){
            $cfg = ConverterConfig::get() -> engraving;
            $this -> add_G(0, Coords::get(null, null, 0.1), $cfg -> fastTravel -> F);
            $this -> CodeString .= "\r\nM400\r\n";
            $this -> add_G(0, Coords::get(0.1, 0.1, 0.1), $cfg -> fastTravel -> F);
            $str = "\r\nM400\r\nG28\r\nG18";
            $this -> CodeString = ";full engraving length: " . round($this -> length, 2) . "mm\r\n" . $this -> CodeString;
            $this -> CodeString = ";full engraving duration: " . $this -> calcTime() . "\r\n" . $this -> CodeString;
            return $str;
        }
        private function calcTime(){
            $length = $this -> length;
            $cfg = ConverterConfig::get() -> engraving;
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