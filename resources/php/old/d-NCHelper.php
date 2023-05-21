<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class NCHelper {
        private static function getCoords(float|null $x, float|null $y, float|null $z, float|null $E) : stdClass {
            $output = new stdClass();
            $output -> x = "";
            $output -> y = "";
            $output -> z = "";
            $output -> E = "";
            if($x !== null){
                $output -> x = " X" . $x;
            }
            if($y !== null){
                $output -> y = " Y" . $y;
            }
            if($z !== null){
                $output -> z = " Z" . $z;
            }
            if($E !== null){
                $output -> E = " E" . $E;
            }
            return $output;
        }
        public static function G0(float $x = null, float $y = null, float $z = null, float $E = null) : string {
            $coords = self::getCoords($x, $y, $z, $E);
            return "G0" . $coords -> x . $coords -> y . $coords -> z . $coords -> E . "\r\n";
        }
        public static function G1(float $x = null, float $y = null, float $z = null, float $E = null) : string {
            $coords = self::getCoords($x, $y, $z, $E);
            return "G1" . $coords -> x . $coords -> y . $coords -> z . $coords -> E . "\r\n";
        }
    }