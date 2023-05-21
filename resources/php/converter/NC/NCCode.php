<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/converter/converterCore.php';
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

        public $digits      = 3;
        public $xNull       = 0;
        public $yNull       = 0;
        public $scale       = 1;
        public $XMultiply   = 1;
        public $YMultiply   = 1;

        use genNCCodeHelper;

        public function __construct(PathObject $pathObject){
            $this -> PathObject = $pathObject;
        }        
        public static function getGCode(PathObject $pathObject) : string {
            return (new self($pathObject)) -> get();
        }
        public function save(string $path){
            writeToFile($path, $this -> get());
        }
        public function get(){
            $pathElements = $this -> PathObject -> getElements();

            $this -> add_G(0, Coords::get(null, null, 0));
            foreach($pathElements as $pathElement){
                $this -> newElement($pathElement);
            }
            return $this -> CodeString;
        }    
        private function newElement(PathElement2D &$pathElement){
            $steps = $pathElement -> getSteps();
            foreach($steps as $key => $step){
                $this -> scale($step);
                if($key == 0){
                    $this -> add_G(0, Coords::get(null, null, 1), 3000);
                    $this -> add_G(0, Coords::get($step['x'], -$step['y']), 3000);
                    $this -> add_G(0, Coords::get(null, null, 0.1));
                    $this -> add_G(0, null, 100);
                }
                $this -> add_G(1, Coords::get($step['x'], -$step['y']));
            }
            $this -> CodeString .= "\r\n";
        }
        private function scale(array &$step){            
            $step['x'] = round(($step['x'] + $this -> xNull) * $this -> scale, $this -> digits) * $this -> XMultiply;
            $step['y'] = round(($step['y'] + $this -> yNull) * $this -> scale, $this -> digits) * $this -> YMultiply;
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