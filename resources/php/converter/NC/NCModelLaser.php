<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/converter/converterCore.php';
    require_once $rootpath.'/fd/resources/php/converter/converterConfig.php';
    require_once $rootpath.'/fd/resources/php/project/project.php';

    trait genNCCodeHelperLaser {
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
    class NCModelLaser {
        public $CodeString = "";
        public $PathObject;

        public $digits      = 2;
        public $xNull       = 0;
        public $yNull       = 0;
        public $scale       = 1;
        public $XMultiply   = 1;
        public $YMultiply   = 1;

        use genNCCodeHelperLaser;

        public function __construct(PathObject $pathObject){
            $this -> PathObject = $pathObject;
        }        
        public static function getGCode(PathObject $pathObject) : string {
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
        private function newElement(PathElement2D &$pathElement){
            $cfg = ConverterConfig::get();
            $steps = $pathElement -> getSteps();
            foreach($steps as $key => $step){
                $this -> scale($step);
                if($key == 0){
                    // $this -> CodeString .= "\r\nM220 S200\r\n";
                    $this -> CodeString .= "M400\r\n";
                    $this -> add_S(0);
                    $this -> add_G(0, Coords::get($step['x'], $step['y'], 10), $cfg -> fastTravel -> F);
                    $this -> CodeString .= "M400\r\n";
                    $this -> add_S(1);
                    // $this -> CodeString .= "M220 S100\r\n";
                    // $this -> add_G(1, null, 1500);
                    // $this -> CodeString .= "M400\r\n";
                    // $this -> CodeString .= "M220 S100\r\n";
                }
                $this -> add_G(1, Coords::get($step['x'], $step['y']), $cfg -> workTravel -> F);
            }
            // $this -> CodeString .= "\r\nM220 S100";
            // $this -> CodeString .= "\r\nM400\r\n\r\n";
        }
        private function scale(array &$step){            
            $step['x'] = round(($step['x'] + $this -> xNull) * $this -> scale, $this -> digits) * $this -> XMultiply;
            $step['y'] = round(($step['y'] + $this -> yNull) * $this -> scale, $this -> digits) * $this -> YMultiply;
        }
        private function getStart(){
            $cfg = ConverterConfig::get();
            $this -> CodeString = "G90\r\nG28\r\n";
            $this -> add_S(0);
            $this -> add_G(0, Coords::get(round((800 + $this -> xNull) * $this -> scale, $this -> digits), round( (800 + $this -> yNull) * $this -> scale, $this -> digits), 10), $cfg -> fastTravel -> F);
            // $this -> CodeString .= "M220 S500\r\n";
            // $this -> CodeString .= "\r\nM400\r\n";
            // $this -> CodeString .= "M220 S100\r\n\r\n";
            // $this -> add_G(1, Coords::get(70, 120, 75), 3000);
        }
        private function getEnd(){
            $cfg = ConverterConfig::get();
            $this -> add_S(0);
            $this -> add_G(0, Coords::get(null, null, 0.1), $cfg -> fastTravel -> F);
            $this -> CodeString .= "\r\nM400\r\n";
            $this -> add_G(0, Coords::get(0.1, 0.1, 0.1), $cfg -> fastTravel -> F);
            $str = "\r\nM400\r\nG28\r\nG18";
            return $str;
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