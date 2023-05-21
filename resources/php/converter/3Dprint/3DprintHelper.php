<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class print3D_Helper {
        public static function getStroke(float $width, float $height) : stdClass {
            $output = new stdClass();
            $output -> width    = $width;
            $output -> height   = $height;
            return $output;
        }

        public static function outlineSquare(Coords $dimensions, Coords $baseCoords, Stroke $stroke) : PathElement3D {
            $pathElement = new PathElement3D();
            $stepRound = (($dimensions -> x + $dimensions -> y) * 2) / $stroke -> deviation;
            $z = $baseCoords -> z;
            $deviationFlag0 = true;
            $deviationFlag1 = true;
            $deviationFlag2 = true;
            $deviationFlag3 = true;
            $Null_add = $stroke -> deviation / 4;
            while($z <= $dimensions -> z){
                $cS = new Coords($Null_add, $Null_add, $z);
                $cE = new Coords($dimensions -> x, $Null_add, $z);
                $dZ = $stepRound;
                $pathElement -> combine(self::line($cS, $cE, $stroke, $dZ, $deviationFlag0) -> getSteps());
                $deviationFlag0 = !$deviationFlag0;

                $z += $dZ;
                $cS = new Coords($dimensions -> x, $Null_add, $z);
                $cE = new Coords($dimensions -> x, $dimensions -> y, $z);
                $dZ = $stepRound;
                $pathElement -> combine(self::line($cS, $cE, $stroke, $dZ, $deviationFlag1) -> getSteps());
                $deviationFlag1 = !$deviationFlag1;

                $z += $dZ;
                $cS = new Coords($dimensions -> x, $dimensions -> y, $z);
                $cE = new Coords($Null_add, $dimensions -> y, $z);
                $dZ = $stepRound;
                $pathElement -> combine(self::line($cS, $cE, $stroke, $dZ, $deviationFlag2) -> getSteps());
                $deviationFlag2 = !$deviationFlag2;
                
                $z += $dZ;
                $cS = new Coords($Null_add, $dimensions -> y, $z);
                $cE = new Coords($Null_add, $Null_add, $z);
                $dZ = $stepRound;
                $pathElement -> combine(self::line($cS, $cE, $stroke, $dZ, $deviationFlag3) -> getSteps());
                $deviationFlag3 = !$deviationFlag3;
                $z += $dZ;
            }
            return $pathElement;
        }

        public static function fillRect(Coords $dimensions, Stroke $stroke) : PathElement2D {
            $pathElement = new PathElement2D();
            $direction = true;
            for($x = 0; $x <= $dimensions -> x; $x += $stroke -> width){
                if($direction){
                    $cS = new Coords($x, 0);
                    $cE = new Coords($x, $dimensions -> y);
                } else {
                    $cS = new Coords($x, $dimensions -> y);
                    $cE = new Coords($x, 0);
                }
                $pathElement -> addStep($cS -> x, $cS -> y);
                $pathElement -> addStep($cE -> x, $cE -> y);
                $direction = !$direction;
            }
            return $pathElement;
        }
        public static function fillSquare(Coords $dimensions, Stroke $stroke) : PathElement3D {
            $pathElement = new PathElement3D();
            $direction = false;
            for($z = 0; $z <= $dimensions -> z; $z += $stroke -> height){
                $rect = self::fillRect($dimensions, $stroke);
                if($direction){
                    $rect -> reverse();
                }
                $rect = $rect -> parse3D($z);
                $pathElement -> combine($rect -> getSteps());
                $direction = !$direction;

            }
            return $pathElement;
        }
        public static function line(Coords $cS, Coords $cE, Stroke $stroke, float &$fullRound = null, bool $deviationFlag = false) : PathElement3D {
            $dX = ($cE -> x) - ($cS -> x);
            $dY = ($cE -> y) - ($cS -> y);
            $dZ = ($cE -> z) - ($cS -> z);
            $length = sqrt(pow($dX, 2) + pow($dY, 2) + pow($dZ, 2));
            $d = ($length / abs($stroke -> deviation));

            $deviationX = (1 / ($dX + $dY) * $dY) * ($stroke -> deviation * 0.5);
            $deviationY = (1 / ($dX + $dY) * $dX) * ($stroke -> deviation * 0.5);
            if($deviationFlag){
                $deviationX *= -1;
                $deviationY *= -1;
            }
            $pathElement = new PathElement3D();
            
            $step = abs($stroke -> deviation);
            $dZ_add = 0;
            if($fullRound !== null){
                $dZ_add = $stroke -> height / (($fullRound / 2 - $d) * 4);
                $fullRound = $dZ_add * $d;
            }
            // $pathElement -> addStep($cS -> x, $cS -> y, $cS -> z);
            for($i = $step; $i < $d; $i += $step){
                $i = round($i, 2);
                $x = round(($cS -> x) + ($dX / $d * $i), 2);
                $y = round(($cS -> y) + ($dY / $d * $i), 2);
                $z = round(($cS -> z) + ($dZ / $d * $i), 2);
                // error_log((modulo($i, 2 * $step)) . "  " . $i . "  " .  2 * $step);
                $pathElement -> addStep($x + ($deviationX * (modulo($i, 2 * $step) - 0.5)), $y + ($deviationY * (modulo($i, 2 * $step) - 0.5)), $z + ($dZ_add * $i));
            }
            // $pathElement -> addStep($cE -> x, $cE -> y, $cE -> z + $fullRound);
            $stroke -> deviation *= -1;
            return $pathElement;
        }
    }

    function modulo(float $n1, float $n2, int $digits = 2) : float{
        $h = pow(10, $digits);
        return ceil((round($n1 * $h)  % round($n2 * $h)) / $h);
    }

    class Stroke {
        public $width       = null;
        public $height      = null;
        public $deviation   = null;

        public function __construct(float $width, float $height, float $deviation = null){
            $this -> width      = $width;
            $this -> height     = $height;
            $this -> deviation  = $deviation;
        }
        public static function get(float $width, float $height, float $deviation = null) : Stroke {
            return new Stroke($width, $height, $deviation);
        }
    }

    class Coords {
        public $x = null;
        public $y = null;
        public $z = null;

        public function __construct(float|null $x = 0, float|null $y = 0, float|null $z = 0){
            $this -> x = $x;
            $this -> y = $y;
            $this -> z = $z;
        }
        public static function get(float|null $x = null, float|null $y = null, float|null $z = null) : Coords {
            return new Coords($x, $y, $z);
        }
        public static function getDist(Coords $c1, Coords $c2) : float{
            $dX = $c1 -> x - $c2 -> x;
            $dY = $c1 -> y - $c2 -> y;
            $dZ = $c1 -> z - $c2 -> z;
            return round(sqrt(pow($dX, 2) + pow($dY, 2) + pow($dZ, 2)), 6);
        }
    }