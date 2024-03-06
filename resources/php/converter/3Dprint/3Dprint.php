<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/3mf/3mfConverter.php';
    require_once $rootpath.'/fd/resources/php/converter/create/creatorHelper.php';
    require_once $rootpath.'/fd/resources/php/converter/ImageObjHelper.php';


    class print3DImage {
        private $object;
        private $imgArray;
        private $colors = [];
        public $x = -1;
        public $y = -1;
        public $stroke = 0.4;
        public $model;

        public function gen3DImage(GdImage $imgScale){
            TIMER -> start();
            if($this -> x > 0 && $this -> y > 0){
                $x = $this -> x / $this -> stroke;
                $y = $this -> y / $this -> stroke;
                $imgScale = imagescale($imgScale, $x, $y);
            }
            imagepng($imgScale, "test.png");
            $this -> imgArray = new imgArray(false);
            $this -> imgArray -> fromGD($imgScale);
            $this -> object = new object3D(); 

            for($y = 0; $y < $this -> imgArray -> y; $y++){
                for($x = 0; $x < $this -> imgArray -> x; $x++){
                    // $this -> object -> addVertex(Coords::get($x, $y, $this -> getOptLightness($x, $y)), $this -> imgArray -> get($x, $y) -> colorIndex);
                    if(modulo($x, 2, 0) == 1 && modulo($y, 2, 0) == 1){
                        $this -> genTriangles($x, $y);
                    }
                }
            }
            $this -> addBorder();
            TIMER -> print();
            $this -> addBase();
            TIMER -> print();
            $this -> addBorderTops();
            TIMER -> print();
            $a = new object3mf($this -> object, false);
            TIMER -> print();
            $this -> model = new model3mf($a);
            TIMER -> print();
            $this -> model -> save("");
            TIMER -> end();
        }
        private function getColorForPixel(int $x, int $y) : string {
            $colorIndex = $this -> imgArray -> get($x, $y) -> colorIndex;
            $index = array_search($colorIndex, $this -> colors);
            if($index == false){
                return array_push($this -> colors, $colorIndex) -1;
            } else {
                return $index;
            }
        }
        private function getOptLightness(int $x, int $y) : float {
            return ((2.4 * $this -> imgArray -> get($x, $y) -> getLightness(true)) + 0.8);
        }
        private function addBase(){
            $xMax = $this -> imgArray -> x - 1;
            $yMax = $this -> imgArray -> y - 1;
            $v1 = $this -> getVertexForCoords($xMax, $yMax, 0);
            $v2 = $this -> getVertexForCoords(0, 0, 0);
            $v3 = $this -> getVertexForCoords(0, $yMax, 0);
            $v4 = $this -> getVertexForCoords($xMax, 0, 0);

            $this -> object -> addSquare($v1, $v2, $v3, $v4);
        }
        private function addBorder(){
            $xMax = $this -> imgArray -> x - 1;
            $yMax = $this -> imgArray -> y - 1;
            
            $v1 = $this -> getVertexForCoords($xMax, 0, 0.8);
            $v2 = $this -> getVertexForCoords(0, 0, 0);
            $v3 = $this -> getVertexForCoords($xMax, 0, 0);
            $v4 = $this -> getVertexForCoords(0, 0, 0.8);
            $this -> object -> addSquare($v1, $v2, $v3, $v4);

            
            $v1_1 = $this -> getVertexForCoords($xMax, $yMax, 0.8);
            $v2_1 = $this -> getVertexForCoords(0, $yMax, 0);
            $v3_1 = $this -> getVertexForCoords($xMax, $yMax, 0);
            $v4_1 = $this -> getVertexForCoords(0, $yMax, 0.8);
            $this -> object -> addSquare($v1_1, $v2_1, $v3_1, $v4_1);

            
            $v1_2 = $this -> getVertexForCoords(0, $yMax, 0.8);
            $v2_2 = $this -> getVertexForCoords(0, 0, 0);
            $v3_2 = $this -> getVertexForCoords(0, $yMax, 0);
            $v4_2 = $this -> getVertexForCoords(0, 0, 0.8);
            $this -> object -> addSquare($v1_2, $v2_2, $v3_2, $v4_2);

            
            $v1_3 = $this -> getVertexForCoords($xMax, $yMax, 0.8);
            $v2_3 = $this -> getVertexForCoords($xMax, 0, 0);
            $v3_3 = $this -> getVertexForCoords($xMax, $yMax, 0);
            $v4_3 = $this -> getVertexForCoords($xMax, 0, 0.8);
            $this -> object -> addSquare($v1_3, $v2_3, $v3_3, $v4_3);

        }
        private function addBorderTopsY(int $x = 0){
            $yMax = $this -> imgArray -> y - 1;
            for($y = 0; $y < $yMax; $y++){
                $v1 = $this -> getVertexForCoords($x, $y + 1, 0.8);
                $v2 = $this -> getVertexForCoords($x, $y, 0.8);
                $v3 = $this -> getVertexForCoords($x, $y);
                $this -> object -> addTriangle($v1, $v2, $v3);

                $v1_1 = $this -> getVertexForCoords($x, $y + 1);
                $v2_1 = $this -> getVertexForCoords($x, $y);
                $v3_1 = $this -> getVertexForCoords($x, $y + 1, 0.8);
                $this -> object -> addTriangle($v1_1, $v2_1, $v3_1);
            }
        }
        private function addBorderTops(){
            $xMax = $this -> imgArray -> x - 1;
            $yMax = $this -> imgArray -> y - 1;
            for($x = 0; $x < $xMax; $x++){
                $v1 = $this -> getVertexForCoords($x + 1, 0, 0.8);
                $v2 = $this -> getVertexForCoords($x, 0, 0.8);
                $v3 = $this -> getVertexForCoords($x, 0);
                $this -> object -> addTriangle($v1, $v2, $v3);

                $v1_1 = $this -> getVertexForCoords($x + 1, 0);
                $v2_1 = $this -> getVertexForCoords($x, 0);
                $v3_1 = $this -> getVertexForCoords($x + 1, 0, 0.8);
                $this -> object -> addTriangle($v1_1, $v2_1, $v3_1);

                $v1_2 = $this -> getVertexForCoords($x + 1, $yMax, 0.8);
                $v2_2 = $this -> getVertexForCoords($x, $yMax, 0.8);
                $v3_2 = $this -> getVertexForCoords($x, $yMax);
                $this -> object -> addTriangle($v1_2, $v2_2, $v3_2);

                $v1_3 = $this -> getVertexForCoords($x + 1, $yMax);
                $v2_3 = $this -> getVertexForCoords($x, $yMax);
                $v3_3 = $this -> getVertexForCoords($x + 1, $yMax, 0.8);
                $this -> object -> addTriangle($v1_3, $v2_3, $v3_3);
            }
            for($y = 0; $y < $yMax; $y++){
                $v1 = $this -> getVertexForCoords(0, $y + 1, 0.8);
                $v2 = $this -> getVertexForCoords(0, $y, 0.8);
                $v3 = $this -> getVertexForCoords(0, $y);
                $this -> object -> addTriangle($v1, $v2, $v3);

                $v1_1 = $this -> getVertexForCoords(0, $y + 1);
                $v2_1 = $this -> getVertexForCoords(0, $y);
                $v3_1 = $this -> getVertexForCoords(0, $y + 1, 0.8);
                $this -> object -> addTriangle($v1_1, $v2_1, $v3_1);

                $v1_2 = $this -> getVertexForCoords($xMax, $y + 1, 0.8);
                $v2_2 = $this -> getVertexForCoords($xMax, $y, 0.8);
                $v3_2 = $this -> getVertexForCoords($xMax, $y);
                $this -> object -> addTriangle($v1_2, $v2_2, $v3_2);

                $v1_3 = $this -> getVertexForCoords($xMax, $y + 1);
                $v2_3 = $this -> getVertexForCoords($xMax, $y);
                $v3_3 = $this -> getVertexForCoords($xMax, $y + 1, 0.8);
                $this -> object -> addTriangle($v1_3, $v2_3, $v3_3);
            }
        }
        private function getVertexForCoords(int $x, int $y, $z = null){
            if($z === null){
                $z = $this -> getOptLightness($x, $y);
            }
            return new vertex(Coords::get($x, $y, $z), $this -> imgArray -> get($x, $y) -> colorIndex);
        }
        private function genTriangles(int $x, int $y){
            $this -> addTriangle($x, $y, $x - 1 , $y - 1, $x - 1, $y);
            $this -> addTriangle($x, $y, $x - 1 , $y - 1, $x, $y - 1);

            $this -> addTriangle($x, $y, $x + 1 , $y + 1, $x + 1, $y);
            $this -> addTriangle($x, $y, $x + 1 , $y + 1, $x, $y + 1);

            $this -> addTriangle($x, $y, $x + 1 , $y - 1, $x, $y - 1);
            $this -> addTriangle($x, $y, $x + 1 , $y - 1, $x + 1, $y);

            $this -> addTriangle($x, $y, $x - 1 , $y + 1, $x - 1, $y);
            $this -> addTriangle($x, $y, $x - 1 , $y + 1, $x, $y + 1);
        }
        private function addTriangle(int $x1, int $y1, int $x2, int $y2, int $x3, int $y3){
            $xMax = $this -> imgArray -> x;
            $yMax = $this -> imgArray -> y;
            if($x1 >= 0 && $x1 < $xMax && $y1 >= 0 && $y1 < $yMax){
                if($x2 >= 0 && $x2 < $xMax && $y2 >= 0 && $y2 < $yMax){
                    if($x3 >= 0 && $x3 < $xMax && $y3 >= 0 && $y3 < $yMax){
                        $this -> object -> addTriangle($this -> getVertexForCoords($x1, $y1), $this -> getVertexForCoords($x2, $y2), $this -> getVertexForCoords($x3, $y3));
                    }
                }
            }
        }
        private function getAt(int $x, int $y) : float {
            if(count($this -> imgArray) <= $x || count($this -> imgArray[0]) <= $y || $x < 0 || $y < 0){
                return 0;
            } else {
                return $this -> imgArray[$x][$y];
            }
        }
        private function checkCross(int $x, int $y, float $value) : array {
            $responseArray = array();
            if($this -> getAt($x + 1, $y) < $value){
                array_push($responseArray, 'right');
            }
            if($this -> getAt(($x - 1), $y) < $value){
                array_push($responseArray, 'left');
            }
            if($this -> getAt($x, $y + 1) < $value){
                array_push($responseArray, 'front');
            }
            if($this -> getAt($x, $y - 1) < $value){
                array_push($responseArray, 'rear');
            }
            return $responseArray;
        }
    }
    class print3D {

        public static function f1($imgScale, int $width, int $height) : PathObject2D {
            // error_log("f1");
            imagefilter($imgScale, IMG_FILTER_GRAYSCALE);
            $imgArray = array(array());
            $minLightness = 2;
            $maxLightness = -1;
            for($y = 0; $y < imagesy($imgScale); $y++){
                for($x = 0; $x < imagesx($imgScale); $x++){
                    $lightness = self::LightnessForPixel($imgScale, $x, $y);
                    if($lightness > $maxLightness){
                        $maxLightness = $lightness;
                    } else if($lightness < $minLightness){
                        $minLightness = $lightness;
                    }
                    $imgArray[$x][$y] = $lightness;
                }
            }
            print_r($maxLightness . " " . $minLightness);
            $pathObject = self::f2($imgArray, $minLightness, $maxLightness);
            return $pathObject;
        }
        public static function LightnessForPixel(GdImage &$imgScale, int $x, int $y) : float{
            $c = imagecolorsforindex($imgScale, imagecolorat($imgScale, $x, $y));
            $r = rgb2hsl($c['red'], $c['green'], $c['blue']);
            return $r[2];
        }
        public static function LightnessForColor(array $color){
            $r = rgb2hsl($color['red'], $color['green'], $color['blue']);
            return $r[2];
        }
        public static function f2(array $imgArray, $min, $max) : PathObject2D {
            // error_log("f2");
            $layerCount = 10;
            $layerHeight = ($max - $min) / ($layerCount);
            $count = 1;
            $PathObject = new PathObject2D();
            while($count <= $layerCount){
                $img = imagecreatetruecolor(count($imgArray), count($imgArray[0]));
                imagefill($img, 0, 0, imagecolorallocate($img, 255, 255, 255));
                $color_black = imagecolorexact($img, 0, 0, 0);
                $PathElement = new PathElement2D();
                for($y = 0; $y < count($imgArray[0]); $y++){
                    for($x = 0; $x < count($imgArray); $x++){
                        if($imgArray[$x][$y] < ($layerHeight * $count)){
                            $PathElement -> addStep($x, $y);
                            imagesetpixel($img, $x, $y, $color_black);
                            $imgArray[$x][$y] = 2;
                        }   
                    }
                }
                imagepng($img, "3DLayer" . "_" . ($count - 1) . ".png");
                imagedestroy($img);
                $PathObject -> addElement($PathElement);
                $count++;
            }
            return $PathObject;
        }
        public static function f3(array $imgArray, $min, $max) : PathObject2D{
            // error_log("f3");
            function fin($x, $y, &$PathElement, &$imgArray, $layerHeight, &$saveArray){
                $PathElement -> addStep($x, $y);
                for($y1 = -1; $y1 <= 1; $y1++){
                    for($x1 = -1; $x1 <= 1; $x1++){
                        if($y1 != 0 || $x1 != 0){
                            if(count($imgArray) > $x + $x1 && 0 <= $x + $x1 && count($imgArray[0]) > $y + $y1 && 0 <= $y + $y1){
                                if($imgArray[$x + $x1][$y + $y1] < ($layerHeight) && !isset($saveArray[$x + $x1][$y + $y1])){
                                    $saveArray[$x + $x1][$y + $y1] = 1;
                                    // $imgArray[$x + $x1][$y + $y1] = -1;
                                    $array = array();
                                    $array['x'] = $x + $x1;
                                    $array['y'] = $y + $y1;
                                    return $array;
                                }
                            }
                        }
                    }
                } 
                return false;
            }
            $layerCount = 10;
            $layerHeight = ($max - $min) / ($layerCount);
            $count = 1;
            $PathObject = new PathObject2D();
            while($count <= $layerCount){
                $PathElement = new PathElement2D();
                $saveArray = array();
                for($y = 0; $y < count($imgArray[0]); $y++){
                    for($x = 0; $x < count($imgArray); $x++){
                        if($imgArray[$x][$y] < ($layerHeight * $count)){
                            while(true){
                                $res = fin($x, $y, $PathElement, $imgArray, $layerHeight * $count, $saveArray);
                                if($res != false){
                                    $x = $res['x'];
                                    $y = $res['y'];
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                }
                $PathObject -> addElement($PathElement);
                $count++;
            }

            return $PathObject;
        }
        public static function PathObject2Img(PathObject2D $PathObject, string $ImgPath, int $width, int $height){
            // error_log("img");
            $pathElements = $PathObject -> getElements();

            $GCode = new GCode();
            foreach(array_reverse($pathElements) as $key => $PathElement){
                $GCode1 = new GCode(); 
                $GCode1 -> setNull($width / 2, $height / 2);
                $GCode1 -> setBaseZ($key * 10);
                $key1 = $key;
                $steps = $PathElement -> getSteps();
                for($i = 0 ; $i < 9 - $key; $i++){
                    $steps = array_merge($steps, $pathElements[$i] -> getSteps());
                }
                $last = array();
                $last1 = array();
                $last1['x'] = 10000;
                $last1['y'] = 10000;
                $last['x'] = -10;
                $last['y'] = -10;
                $flag = false;
                foreach($steps as $key => $step){
                    $sX = $step['x'];
                    $sY = $step['y'];
                    $lX = $last['x'];
                    $lY = $last['y'];
                    $lX1 = $last1['x'];
                    $lY1 = $last1['y'];
                    if(($sX == $lX || $sX == $lX -1 || $sX == $lX + 1) && ($sY == $lY || $sY == $lY -1 || $sY == $lY + 1)){
                        if(($sX - $lX == $lX - $lX1) || ($sY - $lY == $lY - $lY1)){
                            if(count($steps) - 1 == $key){
                                $GCode1 -> newStep($step['x'], $step['y']);
                            }
                            $flag = true;
                        } else {
                            if($flag){
                                $GCode1 -> newStep($lX, $lY);
                            }
                            $GCode1 -> newStep($step['x'], $step['y']);
                            $flag = false;
                        }
                    } else {
                        if($flag){
                            $GCode1 -> newStep($lX, $lY);
                            $flag = false;
                        }
                        $GCode1 -> newMove($step['x'], $step['y']);
                    }
                    if(count($steps) - 1 == $key){
                        $GCode1 -> newStep($step['x'], $step['y']);
                    }
                    $last1['x'] = $last['x'];
                    $last1['y'] = $last['y'];
                    $last['x'] = $step['x'];
                    $last['y'] = $step['y'];
                }
                $GCode -> apply($GCode1 -> get());
            }
            $GCode -> save($ImgPath);
        }
        public static function sortPathElement(PathElement2D $pathElement) : PathElement2D{
            $pathElementOut = new PathElement2D();
            $steps = $pathElement -> getSteps();
            $last = [];
            while(count($steps) > 0){
                $minDist = 100000;
                $minKey = -1;
                foreach($steps as $key => $step){
                    if(count($last) == 0){
                        $last['x'] = $step['x'];
                        $last['y'] = $step['y'];
                        $pathElementOut -> addStep($step['x'], $step['y']);
                        array_splice($steps, $key, 1);
                        continue 2;
                    } else {
                        // $dist = abs($step['x'] - $last['x']) + abs($step['y'] - $last['y']);
                        $dist = sqrt(pow($step['x'] - $last['x'], 2) + pow($step['y'] - $last['y'], 2));
                        if($minDist > $dist){
                            $minDist    = $dist;
                            $minKey     = $key;
                            if($minDist <= 1){
                                break;
                            }
                        }
                    }
                }
                $last['x'] = $steps[$minKey]['x'];
                $last['y'] = $steps[$minKey]['y'];
                $pathElementOut -> addStep($steps[$minKey]['x'], $steps[$minKey]['y']);
                array_splice($steps, $minKey, 1);
            }
            return $pathElementOut;
        }
    }

    class GCode{
        private $result = "";
        private $baseZ;
        private $moveHeight;
        private $moveSpeed;
        private $lineSpeed;
        private $Null = array();
        public function __construct(float $baseZ = 0, float $moveHeight = 1, float $moveSpeed = 3000, float $lineSpeed = 200){
            $this -> baseZ      = $baseZ;
            $this -> moveHeight = $moveHeight;
            $this -> moveSpeed  = $moveSpeed;
            $this -> lineSpeed  = $lineSpeed;
            $this -> Null['x']  = 0;
            $this -> Null['y']  = 0;
        }
        public function setNull(int $x, int $y){
            $this -> Null['x'] = -$x;
            $this -> Null['y'] = -$y;
        }
        public function newStep(int $x, int $y){
            $this -> result .= "G01 " . "X" . ($x + $this -> Null['x']) . " Y" . ($y + $this -> Null['y']) . "\r\n"; 
        }
        public function newMove(int $x, int $y){
            $this -> result .= "\r\n";
            $this -> result .= "G00 " . "Z" . ($this -> baseZ + $this -> moveHeight) . " F" . $this -> moveSpeed . "\r\n";
            $this -> result .= "G00 " . "X" . ($x + $this -> Null['x']) . " Y" . ($y + $this -> Null['y']) . "\r\n"; 
            $this -> result .= "G00 " . "Z" . $this -> baseZ . " F" . $this -> lineSpeed .  "\r\n";
        }
        public function get(){
            return $this -> result;
        }
        public function apply(string $GCode){
            $this -> result .= $GCode;
        }
        public function setBaseZ(float $baseZ){
            $this -> baseZ = $baseZ;
        }
        public function save(string $path){
            $fp = fopen($path . ".nc", "w+");
            fwrite($fp, $this -> result);
            fclose($fp);
        }
    }
