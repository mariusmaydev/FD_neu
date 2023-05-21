<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once '3DprintHelper.php';

    class print3Dvase {
        public $dimensions;
        public $stroke;
        public $path;

        public function __construct(float $x, float $y, float $z){
            $this -> dimensions = new Coords($x, $y, $z);

            $this -> stroke = new Stroke(0.2, 0.1, 1);
        }
        public function draw(){
            $dimensions = new Coords($this -> dimensions -> x, $this -> dimensions -> y, 0.6);
            $base = print3D_Helper::fillSquare($dimensions, $this -> stroke);

            $this -> dimensions -> x -= $this -> stroke -> deviation / 4;
            $this -> dimensions -> y -= $this -> stroke -> deviation / 4;
            $baseCoords = new Coords($this -> dimensions -> x, $this -> dimensions -> y, 0.6);
            $top = print3D_Helper::outlineSquare($this -> dimensions, $baseCoords, $this -> stroke);
            $pathObject = new PathObject3D();
            $pathObject -> addElement($base);
            $pathObject -> addElement($top);
            $this -> path = $pathObject;
            // error_log(print_r($pathObject, true));
            // print3D::PathObject2Img($pathObject, "3DLayer", $this -> dimensions -> x, $this -> dimensions -> y);
        }
        public function getNC(){
            $pathElements = $this -> path -> getElements();
            $result = "s24000 \r\n\r\n";
            $dist = 0;
            foreach($pathElements as $pathElement){
                $steps = $pathElement -> getSteps();
                foreach($steps as $key => $step){
                    $step = self::scale($step);
                    if($key == 0){
                        $result .= NCHelper::G0($step['x'], $step['y'], $step['z']);
                        $result .= "\r\n";
                        continue;
                    }          
                    $step1 = self::scale($steps[$key-1]);              
                    $dist += Coords::getDist(Coords::get($step['x'], $step['y'], $step['z']), Coords::get($step1['x'], $step1['y'], $step1['z']));

                    $result .= NCHelper::G1($step['x'], $step['y'], $step['z'], $dist);
                }
                $result .= "\r\n";
            }
            $fp = fopen("FULL.nc", "w+");
            fwrite($fp, $result);
            fclose($fp);
        }
        public static function scale(array &$step) : array {
            $width = 290;
            $height = 290;
            
            $scale  = 1;
        
            $Xnull  =+ $width / 2;
            $Ynull  =+ $height / 2;
            
            $step['x'] = round(($step['x'] + $Xnull) * $scale, 3);
            $step['y'] = round(($step['y'] + $Ynull) * $scale, 3);
            return $step;
        }
    }