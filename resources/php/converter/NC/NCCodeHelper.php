<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/converter/converterCore.php';
    require_once $rootpath.'/fd/resources/php/converter/converterConfig.php';
    require_once $rootpath.'/fd/resources/php/project/project.php';

    trait genNCCodeHelper {
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
                $strCoords -> z = " Z" . $coords -> z;
            }
            return $strCoords;
        }
    }

    
    // trait genNCCodeHelper {
    //     public function add_G(int $GNumber, Coords|null $coords = null, int|string $F = "") : string {
    //         $c = $this -> parseCoords($coords);
    //         if($F != ""){
    //             $F = " F" . $F;
    //         }
    //         $result = "G" . $GNumber . $c -> x . $c -> y . $c -> z . $F . "\r\n";
    //         if(isset($this -> CodeString)){
    //             $this -> CodeString .= $result;
    //         }
    //         return $result;
    //     }
    //     public function parseCoords(Coords|null $coords = null) : stdClass {
    //         $strCoords = new stdClass();
    //         $strCoords -> x = "";
    //         $strCoords -> y = "";
    //         $strCoords -> z = "";

    //         if($coords === null){
    //             return $strCoords;
    //         }
    //         if($coords -> x !== null){
    //             $strCoords -> x = " X" . $coords -> x;
    //         }
    //         if($coords -> y !== null){
    //             $strCoords -> y = " Y" . $coords -> y;
    //         }
    //         if($coords -> z !== null){
    //             $strCoords -> z = " Z" . $coords -> z;
    //         }
    //         return $strCoords;
    //     }
    // }