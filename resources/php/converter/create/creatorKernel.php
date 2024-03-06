<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class ConverterCreatorKernel  {
        public $imgArray;
        public $x;
        public $y;

        public function __construct(fixedArray &$imgArray, int $x, int $y){
            $this -> imgArray = $imgArray;
            $this -> x = $x;
            $this -> y = $y;
        }
        public function check6Field() : bool {
            for($x = 0; $x <= 2; $x++){
                for($y = 0; $y <= 1; $y++){
                    if($this -> imgArray -> get($this -> x + $x, $this -> y + $y) != 1){ 
                        return false;
                    }
                }
            }
            return true;
        }
        public function check6Field_High() : bool {
            for($x = 0; $x <= 1; $x++){
                for($y = 0; $y <= 2; $y++){
                    if($this -> imgArray -> get($this -> x + $x, $this -> y + $y) != 1){ 
                        return false;
                    }
                }
            }
            return true;
        }
        public function check4Field() : bool {
            for($x = 0; $x <= 1; $x++){
                for($y = 0; $y <= 1; $y++){
                    if($this -> imgArray -> get($this -> x + $x, $this -> y + $y) != 1){ 
                        return false;
                    }
                }
            }
            return true;
        }
        public function fix6Field() : fixedArray {
            $checkMatrix = [
                [ 1, 1, 1, 1, 1],
                [ 1, 0, 0, 0, 1],
                [ 1, 0, 0, 0, 1],
                [ 1, 1, 1, 1, 1]      
            ];
            $coords1 = array();
            $coords1['x'] = 0;
            $coords1['y'] = 0;
            $coords2 = array();
            $coords2['x'] = 0;
            $coords2['y'] = 0;
            $counter = 0;
            for($y = 0; $y <= 3; $y++){
                for($x = 0; $x <= 4; $x++){
                    if($this -> x + $x - 1 > 0 && $this -> y + $y - 1 > 0 && $this -> imgArray -> get($this -> x + $x - 1, $this -> y + $y - 1) == $checkMatrix[$y][$x] && $checkMatrix[$y][$x] != 0){ 
                        if($counter == 0){
                            $coords1['x'] = $this -> x + $x - 1;
                            $coords1['y'] = $this -> y + $y - 1;
                        } else if($counter == 1){
                            $coords2['x'] = $this -> x + $x - 1;
                            $coords2['y'] = $this -> y + $y - 1;
                        }
                        $counter++;
                    }
                }
            }
            if($counter == 2){
                for($y = 0; $y <= 3; $y++){
                    for($x = 0; $x <= 4; $x++){
                        if($checkMatrix[$y][$x] == 0){ 
                            $this -> imgArray -> set($this -> x + $x - 1, $this -> y + $y - 1, 0);
                        }
                    }
                }
                return $this -> findShortPath($coords1, $coords2);
            }
            return $this -> imgArray;
        }
        public function fix6Field_High() : fixedArray {
            $checkMatrix = [
                [ 1, 1, 1, 1],
                [ 1, 0, 0, 1],
                [ 1, 0, 0, 1],
                [ 1, 0, 0, 1],
                [ 1, 1, 1, 1]      
            ];
            $coords1 = array();
            $coords1['x'] = 0;
            $coords1['y'] = 0;
            $coords2 = array();
            $coords2['x'] = 0;
            $coords2['y'] = 0;
            $counter = 0;
            for($y = 0; $y <= 4; $y++){
                for($x = 0; $x <= 3; $x++){
                    if($this -> x + $x - 1 > 0 && $this -> y + $y - 1 > 0 &&  $this -> imgArray -> get($this -> x + $x - 1, $this -> y + $y - 1) == $checkMatrix[$y][$x] && $checkMatrix[$y][$x] != 0){ 
                        if($counter == 0){
                            $coords1['x'] = $this -> x + $x - 1;
                            $coords1['y'] = $this -> y + $y - 1;
                        } else if($counter == 1){
                            $coords2['x'] = $this -> x + $x - 1;
                            $coords2['y'] = $this -> y + $y - 1;
                        }
                        $counter++;
                    }
                }
            }
            if($counter == 2){
                for($y = 0; $y <= 4; $y++){
                    for($x = 0; $x <= 3; $x++){
                        if($checkMatrix[$y][$x] == 0){ 
                            $this -> imgArray -> set($this -> x + $x - 1, $this -> y + $y - 1, 0);
                        }
                    }
                }
                return $this -> findShortPath($coords1, $coords2);
            }
            return $this -> imgArray;
        }
        public function fix4Field(){
            $checkMatrix = [
                [ 1, 1, 1, 1],
                [ 1, 0, 0, 1],
                [ 1, 0, 0, 1],
                [ 1, 1, 1, 1]      
            ];
            $coords1 = array();
            $coords1['x'] = 0;
            $coords1['y'] = 0;
            $coords2 = array();
            $coords2['x'] = 0;
            $coords2['y'] = 0;
            $counter = 0;
            for($y = 0; $y <= 3; $y++){
                for($x = 0; $x <= 3; $x++){
                    if($this -> imgArray -> get($this -> x + $x - 1, $this -> y + $y - 1) == $checkMatrix[$y][$x] && $checkMatrix[$y][$x] != 0){ 
                        if($counter == 0){
                            $coords1['x'] = $this -> x + $x - 1;
                            $coords1['y'] = $this -> y + $y - 1;
                        } else if($counter == 1){
                            $coords2['x'] = $this -> x + $x - 1;
                            $coords2['y'] = $this -> y + $y - 1;
                        }
                        $counter++;
                    }
                }
            }
            if($counter == 2){
                for($y = 0; $y <= 3; $y++){
                    for($x = 0; $x <= 3; $x++){
                        if($checkMatrix[$y][$x] == 0){ 
                            $this -> imgArray -> get($this -> x + $x - 1, $this -> y + $y - 1, 0);
                        }
                    }
                }
                return $this -> findShortPath($coords1, $coords2);
            }
            return $this -> imgArray;
        }
        private function findShortPath($coords1, $coords2) : fixedArray {
            $divX = 0;
            $divY = 0;
            $x = 0;
            $y = 0;
            $xStart = 0;
            $xEnd = 0;
            $yStart = 0;
            $yEnd = 0;
    
            if($coords1['x'] > $coords2['x']){
                $divX = abs($coords1['x'] - $coords2['x']);
                $xStart = $coords2['x'];
                $xEnd = $coords1['x'];
                $x = $coords2['x'];
            } else {
                $divX = abs($coords2['x'] - $coords1['x']);
                $xStart = $coords1['x'];
                $xEnd = $coords2['x'];
                $x = $coords1['x'];
            }
            if($coords1['y'] > $coords2['y']){
                $divY = abs($coords1['y'] - $coords2['y']);
                $yStart = $coords2['y'];
                $yEnd = $coords1['y'];
                $y = $coords2['y'];
            } else {
                $divY = abs($coords2['y'] - $coords1['y']);
                $yStart = $coords1['y'];
                $yEnd = $coords2['y'];
                $y = $coords1['y'];
            }
    
            if($divX > $divY){
                for($x = $xStart; $x <= $xEnd; $x++){   
                    if ($y < $divY) {
                        $y++;
                    }
                    $this -> imgArray -> set($x, $y, 1);
                }
            } else {
                for($y = $yStart; $y <= $yEnd; $y++){   
                    if ($x < $divX) {
                        $x++;
                    }
                    $this -> imgArray -> set($x, $y, 1);
                }
            }
            return $this -> imgArray;
        }
        public static function analyseEdgesSmall(fixedArray|bool $matrix, PathElement2D &$pathElement, &$x_C, &$y_C, &$fArray) : fixedArray | false {
            if($matrix == false){
                return false;
            }
            for($x = 1; $x <= 3; $x++){
                for($y = 1; $y <= 3; $y++){
                    if(self::ifEdge($x, $y)){
                        if($matrix -> get($x, $y) == 1){
                            $path = self::doPath_Array($x, $y);
                            $matrix = self::goWay($path, $pathElement, $x_C, $y_C, $fArray);
                            return $matrix;
                        }
                    }
                }
            }
            return false;
        }
    
        public static function analyseStraightsSmall(fixedArray|bool $matrix, PathElement2D &$pathElement, &$x_C, &$y_C, &$fArray) : fixedArray | false{
            if($matrix == false){
                return false;
            }
            for($x = 1; $x <= 3; $x++){
                for($y = 1; $y <= 3; $y++){
                    if(self::ifStraight($x, $y)){
                        if($matrix -> get($x, $y) == 1){
                            $path = self::doPath_Array($x, $y);
                            $matrix = self::goWay($path, $pathElement, $x_C, $y_C, $fArray);
                            return $matrix;
                        }
                    }
                }
            }
            return false;
        }
    
        public static function analyseStraightsBig(fixedArray|bool $matrix, PathElement2D &$pathElement, &$x_C, &$y_C, &$fArray) : fixedArray | false {
            if($matrix == false){
                return false;
            }
            for($x = 1; $x <= 3; $x++){
                for($y = 1; $y <= 3; $y++){
                    if(self::ifStraight($x, $y)){
                        $path = self::doPath_Array($x, $y);
                        if($matrix -> get($x, $y) == 1 && $matrix -> get($x + $path['x'], $y + $path['y']) == 1){
                            $matrix = self::goWay($path, $pathElement, $x_C, $y_C, $fArray);
                            return $matrix;
                        }
                    }
                }
            }
            return false;
        }
    
        public static function analyseEdgesBig(fixedArray|bool $matrix, PathElement2D &$pathElement, &$x_C, &$y_C, &$fArray) : fixedArray | false {
            if($matrix == false){
                return false;
            }
            for($x = 1; $x <= 3; $x++){
                for($y = 1; $y <= 3; $y++){
                    if(self::ifEdge($x, $y)){
                        $path = self::doPath_Array($x, $y);
                        if($matrix -> get($x, $y) == 1 && $matrix -> get($x + $path['x'], $y + $path['y']) == 1){
                            $matrix = self::goWay($path, $pathElement, $x_C, $y_C, $fArray);
                            return $matrix;
                        }
                    }
                }
            }
            return false;
        }
    
        private static function ifEdge(int $x, int $y) : bool {
            if($x == 1 && $y == 1){
                return true;
            } else if($x == 3 && $y == 3){
                return true;
            } else if($x == 1 && $y == 3){
                return true;
            } else if($x == 3 && $y == 1){
                return true;
            } else {
                return false;
            }
        }
    
        private static function ifStraight(int $x, int $y) : bool {
            if($x == 1 && $y == 2){
                return true;
            } else if($x == 2 && $y == 1){
                return true;
            } else if($x == 2 && $y == 3){
                return true;
            } else if($x == 3 && $y == 2){
                return true;
            } else {
                return false;
            }
        }
    
        public static function doPath_Array(int $x, int $y) : array {
            $path = array(2);
            $path['x'] = $x - 2;
            $path['y'] = $y - 2;
    
            return $path;
        }
        private static function goWay(array $path, PathElement2D &$pathElement, &$x_C, &$y_C, &$fArray) : fixedArray | bool{
            
            $x1 = $path['x'];
            $y1 = $path['y'];
    
            if($fArray -> get($x_C + $x1 * 2, $y_C + $y1 * 2) == 2){    
                $pathElement -> addStep($x_C + $x1 * 2, $y_C + $y1 * 2);
                self::eraseMatrix($x_C, $y_C, $fArray);
                $fArray -> set($x_C, $y_C, 2);
                $fArray -> set($x_C + $x1, $y_C + $y1, 2);
                $fArray -> set($x_C + $x1 * 2, $y_C + $y1 * 2, 2);
                $x_C += $x1 * 2;
                $y_C += $y1 * 2;    
            } else {  
                $pathElement -> addStep($x_C + $x1, $y_C + $y1);
                self::eraseMatrix($x_C, $y_C, $fArray);            
                $fArray -> set($x_C, $y_C, 2);
                $fArray -> set($x_C + $x1, $y_C + $y1, 2);
                $x_C += $x1;
                $y_C += $y1;  
            }
            return self::createMatrix($fArray, $x_C, $y_C);
        }
        private static function eraseMatrix(int $x, int $y, &$fArray) : void {
            for($x1 = -1; $x1 <= 1; $x1++){
                for($y1 = -1; $y1 <= 1; $y1++){
                    // if($x1 != 0 || $y1 != 0){
                        if($fArray -> get($x + $x1, $y + $y1) == 1){
                            $fArray -> set($x + $x1, $y + $y1, 2);
                        }
                    // }
                }
            }
        }
        public static function createMatrix(fixedArray $fArray, int $x, int $y) : fixedArray | bool {
            $output = new fixedArray(5, 5);
            $flagM = false;
            $y -= 2;
            $x -= 2;
            for($x1 = 0; $x1 <= 4; $x1++){
                for($y1 = 0; $y1 <= 4; $y1++){
                    if(($x1 != 2 || $y1 != 2) && $x + $x1 >= 0 && $y + $y1 >= 0 && $x + $x1 < $fArray -> x && $y + $y1 < $fArray -> y){
                        if($fArray -> get($x + $x1, $y + $y1) == 1){
                            $output -> set($x1, $y1, 1);
                            if($x1 >= 1 && $x1 <= 3 && $y1 >= 1 && $y1 <= 3 && ($x1 != 2 || $y1 != 2)){
                                $flagM = true;
                            }
                        } else {
                            $output -> set($x1, $y1, 0);
                        }
                    } else {
                        $output -> set($x1, $y1, 0);
                    }
                }
            }
            if($flagM){
                return $output;
            } else {
                return false;
            }
        }
    }