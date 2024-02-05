<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';


    class creatorHelper {
        public static function img2fArray(Imagick $img, bool $invert = false) : fixedArray{
            $fArray = new fixedArray($img -> getImageWidth(), $img -> getImageHeight());
            if($invert){
                $color = ['r' => 0, 'g' => 0, 'b' => 0, 'a' => 0];
                $colorS1 = 0;
                $colorS2 = 1;
            } else {
                $color = ['r' => 0, 'g' => 0, 'b' => 0, 'a' => 1];
                $colorS1 = 1;
                $colorS2 = 0;
            }
            
            $imageIterator = $img -> getPixelIterator();
            // $fArray -> default = $colorS2;
            foreach ($imageIterator as $row => $pixels) {
                foreach ($pixels as $column => $pixel) {
                        if($pixel -> getColor() == $color){
                            $fArray -> set($column, $row, $colorS1);
                        } else {
                            $fArray -> set($column, $row, $colorS2);
                        }
                }
                $imageIterator -> syncIterator(); /* Sync the iterator, this is important to do on each iteration */
            }
            return $fArray;
        }
        public static function img2BinaryFixedArray(Imagick $img) : fixedArray {
            $fArray = new fixedArray($img -> getImageWidth(), $img -> getImageHeight());
            $fArray -> fromArray($img -> exportImagePixels(0, 0, $img -> getImageWidth(), $img -> getImageHeight(), 'I', Imagick::PIXEL_CHAR), 1, true);
            return $fArray;
        }
        public static function img2Path(Imagick $img, bool $invert = false) : PathObject {
            $pathObject = new PathObject();
            if($invert){
                $color = ['r' => 0, 'g' => 0, 'b' => 0, 'a' => 0];
            } else {
                $color = ['r' => 0, 'g' => 0, 'b' => 0, 'a' => 1];
            }
            $flag = true;
            $pathElement = new PathElement2D();
            for($y = 0; $y < $img -> getImageHeight(); $y++){
                if($flag){
                    for($x = 0; $x < $img -> getImageWidth(); $x++){
                        if(ImagickHelper::getPixelColor($img, $x, $y) == $color){
                            $pathElement -> addStep($x, $y);
                        } else if($pathElement -> stepCount() > 0){
                            $pathObject -> addElement($pathElement);
                            $pathElement = new PathElement2D();
                        }
                    }
                } else {
                    for($x = $img -> getImageWidth() -1; $x >= 0; $x--){
                        if(ImagickHelper::getPixelColor($img, $x, $y) == $color){
                            $pathElement -> addStep($x, $y);
                        } else if($pathElement -> stepCount() > 0){
                            $pathObject -> addElement($pathElement);
                            $pathElement = new PathElement2D();
                        }
                    }
                }
                $flag = !$flag;
            }
            return $pathObject;
        }
        public static function fArray2Path(fixedArray $fArray) : PathObject {
 
            $flag = false;
            $pathObject = new PathObject();
            $pathElement = new pathElement2D();
            for($y = 0; $y < $fArray -> y; $y++){
                if($flag){
                    for($x = 0; $x < $fArray -> x; $x++){
                        if($fArray -> get($x, $y) == 1){
                            $pathElement -> addStep($x, $y);
                        } else {
                            if($pathElement -> stepCount() > 0){
                                $pathObject -> addElement($pathElement);
                                $pathElement = new pathElement2D();
                            }
                        }
                    }
                } else { 
                    for($x = $fArray -> x -1; $x >= 0; $x--){
                        if($fArray -> get($x, $y) == 1){
                            $pathElement -> addStep($x, $y);
                        } else {
                            if($pathElement -> stepCount() > 0){
                                $pathObject -> addElement($pathElement);
                                $pathElement = new pathElement2D();
                            }
                        }
                    }
                }
                $flag = !$flag;
            }
            return $pathObject;
        }
        public static function farray2file(fixedArray $array, $fileName){

            $fp = fopen($fileName, "w+");
            for($y = 0; $y < $array -> y; $y++){
                for($x = 0; $x < $array -> x; $x++){
                    fwrite($fp, $array -> get($x, $y) );
                }
                fwrite($fp, "\r\n");
            }
            fclose($fp);
        }
        public static function array2file(array $array, $fileName){

            $fp = fopen($fileName, "w+");
            for($y = 0; $y < count($array[0]); $y++){
                for($x = 0; $x < count($array); $x++){
                    fwrite($fp, $array[$x][$y]);
                }
                fwrite($fp, "\r\n");
            }
            fclose($fp);
        }
        public static function fArray2img(fixedArray $fArray) : GdImage {
            $img = imagecreatetruecolor($fArray -> x, $fArray -> y);
            imagefill($img, 0, 0, imagecolorallocate($img, 255, 255, 255));
            $black = imagecolorallocate($img, 0, 0, 0);
            foreach($fArray -> array as $key => $element){
                if($element == 1){
                    $array = $fArray -> getCoordsForIndex($key);
                    imagesetpixel($img, $array['x'], $array['y'], $black);
                }
            }
            return $img;
        }
        public static function checkImgArray(fixedArray &$fArray){
            foreach($fArray -> array as $key => $element){
                if($element == 1){
                    $index = $fArray -> getCoordsForIndex($key);
                    $kernel = new creatorKernel($fArray, $index['x'], $index['y']);
                    if($kernel -> check6Field()){
                        $fArray = $kernel -> fix6Field();
                    } else if($kernel -> check6Field_High()){
                        $fArray = $kernel -> fix6Field_High();
                    } else if($kernel -> check4Field()){
                        $fArray = $kernel -> fix4Field();
                    }
                }
            }
            // for($x = 0; $x < $fArray -> x -6; $x++){
            //     for($y = 0; $y < $fArray -> y -6; $y++){
            //         if($imgArray[$x][$y] == 1){
            //             $kernel = new creatorKernel($imgArray, $x, $y);
            //             if($kernel -> check6Field()){
            //                 $imgArray = $kernel -> fix6Field();
            //             } else if($kernel -> check6Field_High()){
            //                 $imgArray = $kernel -> fix6Field_High();
            //             } else if($kernel -> check4Field()){
            //                 $imgArray = $kernel -> fix4Field();
            //             }
            //         }
            //     }
            // }
            // self::array2file($imgArray, "out.txt");
        }
        public static function handleMatrix(fixedArray $matrix, int $x, int $y, int &$x_C, int &$y_C, PathElement2D &$pathElement){
    
            $x_C = $x;
            $y_C = $y;
            while(true){
                $MatrixFlag = false;
                for($x1 = 0; $x1 <= 4; $x1++){
                    for($y1 = 0; $y1 <= 4; $y1++){
                        if(($x1 == 0 || $x1 == 4 || $y1 == 0 || $y1 == 4) && $matrix -> get($x1, $y1) == 1){
                            $MatrixFlag = true;
                        }
                    }
                }
                while(true){
                    if($MatrixFlag){
                        $matrix1 = creatorKernel::analyseEdgesBig($matrix, $pathElement);
                        if($matrix1 != false){
                            $matrix = $matrix1;
                            continue 2;
                        }
                        $matrix1 = creatorKernel::analyseStraightsBig($matrix, $pathElement);
                        if($matrix1 != false){
                            $matrix = $matrix1;
                            continue 2;
                        } else {
                            $MatrixFlag = false;
                            continue;
                        }
                    } else {
                        $matrix1 = creatorKernel::analyseEdgesSmall($matrix, $pathElement);
                        if($matrix1 != false){
                            $matrix = $matrix1;
                            continue 2;
                        }
                        $matrix1 = creatorKernel::analyseStraightsSmall($matrix, $pathElement);
                        if($matrix1 != false){
                            $matrix = $matrix1;
                            continue 2;
                        } else {
                            return;
                        }
                    }
                }
            }
        }
    }

    class PathElement3D {
        private $steps = array();
        public function __construct(){
            
        }
        public function stepCount() : int{
            return count($this -> steps);
        }
        public function addStep(float $x, float $y, float $z){
            $step = [];
            $step['x'] = $x;
            $step['y'] = $y;
            $step['z'] = $z;
            array_push($this -> steps, $step);
        }
        public function combine(array $steps){
            foreach($steps as $step){
                $this -> addStep($step['x'], $step['y'], $step['z']);
            }
        }
        public function setSteps(array $steps){
            $this -> steps = $steps;
        }
        public function getSteps(int $index = -1){
            if($index != -1){
                return $this -> steps[$index];
            }
            return $this -> steps;
        }
        public function removeStep(int $index){
            array_splice($this -> steps, $index, 1);
        }
        public function findStep(float $x, float $y, float $z){
            foreach($this -> steps as $key => $step){
                if($step['x'] == $x && $step['y'] == $y && $step['z'] == $z){
                    return $key;
                }
            }
            return false;
        }
        public function reverse(){
            $this -> steps = array_reverse($this -> steps);
        }
    }
    class PathObject3D {
        private $storage = array();
        public function __construct(){
            
        }
        public function elementCount() : int{
            return count($this -> storage);
        }
        public function combinePathObject(PathObject3D $PathObject){
            $PathElements = $PathObject -> getElements();
            foreach($PathElements as $PathElement){
                $this -> addElement($PathElement);
            }
        }
        public function combineElement(int $index, PathElement3D $addPathElement){
            $newPathElement = new PathElement3D();
            $newPathElement -> setSteps($this -> storage[$index] -> getSteps());
            $newPathElement -> combine($addPathElement -> getSteps()); 
            $this -> storage[$index] = $newPathElement;
        }
        public function addElement(PathElement3D $pathElement){
            array_push($this -> storage, $pathElement);
        }
        public function getElements(int $index = -1){
            if($index != -1){
                return $this -> storage[$index];
            }
            return $this -> storage;
        }
        public function removeElement(int $index) : void {
            array_splice($this -> storage, $index, 1);
        }
    }

    class PathElement2D{
        private $steps = array();
        public function __construct(){
            
        }
        public function stepCount() : int{
            return count($this -> steps);
        }
        public function parse3D(float $z) : PathElement3D {
            $pathElement3D = new PathElement3D();

            foreach($this -> steps as $step){
                $pathElement3D -> addStep($step['x'], $step['y'], $z);
            }
            return $pathElement3D;
        }
        public function addStep(float $x, float $y){
            $step = [];
            $step['x'] = $x;
            $step['y'] = $y;
            array_push($this -> steps, $step);
        }
        public function combine(array $steps){
            foreach($steps as $step){
                $this -> addStep($step['x'], $step['y']);
            }
        }
        public function setSteps(array $steps){
            $this -> steps = $steps;
        }
        public function getSteps(int $index = -1){
            if($index != -1){
                return $this -> steps[$index];
            }
            return $this -> steps;
        }
        public function removeStep(int $index){
            array_splice($this -> steps, $index, 1);
        }
        public function findStep(float $x, float $y){
            foreach($this -> steps as $key => $step){
                if($step['x'] == $x && $step['y'] == $y){
                    return $key;
                }
            }
            return false;
        }
        public function reverse(){
            $this -> steps = array_reverse($this -> steps);
        }
    }
    class PathObject{
        private $storage = array();
        public function __construct(){
            
        }
        public function elementCount() : int{
            return count($this -> storage);
        }
        public function combinePathObject(PathObject $PathObject){
            $PathElements = $PathObject -> getElements();
            foreach($PathElements as $PathElement){
                $this -> addElement($PathElement);
            }
        }
        public function combineElement(int $index, PathElement2D $addPathElement){
            $newPathElement = new PathElement2D();
            $newPathElement -> setSteps($this -> storage[$index] -> getSteps());
            $newPathElement -> combine($addPathElement -> getSteps()); 
            $this -> storage[$index] = $newPathElement;
        }
        public function addElement(PathElement2D $pathElement){
            array_push($this -> storage, $pathElement);
        }
        public function getElements(int $index = -1){
            if($index != -1){
                return $this -> storage[$index];
            }
            return $this -> storage;
        }
        public function removeElement(int $index) : void {
            array_splice($this -> storage, $index, 1);
        }
    }

    class creatorKernel {
        private $imgArray;
        private $x;
        private $y;

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
        public static function analyseEdgesSmall(fixedArray|bool $matrix, PathElement2D &$pathElement) : fixedArray | false {
            if($matrix == false){
                return false;
            }
            for($x = 1; $x <= 3; $x++){
                for($y = 1; $y <= 3; $y++){
                    if(self::ifEdge($x, $y)){
                        if($matrix -> get($x, $y) == 1){
                            $path = self::doPath_Array($x, $y);
                            $matrix = goWay($path, $pathElement);
                            return $matrix;
                        }
                    }
                }
            }
            return false;
        }
    
        public static function analyseStraightsSmall(fixedArray|bool $matrix, PathElement2D &$pathElement) : fixedArray | false{
            if($matrix == false){
                return false;
            }
            for($x = 1; $x <= 3; $x++){
                for($y = 1; $y <= 3; $y++){
                    if(self::ifStraight($x, $y)){
                        if($matrix -> get($x, $y) == 1){
                            $path = self::doPath_Array($x, $y);
                            $matrix = goWay($path, $pathElement);
                            return $matrix;
                        }
                    }
                }
            }
            return false;
        }
    
        public static function analyseStraightsBig(fixedArray|bool $matrix, PathElement2D &$pathElement) : fixedArray | false {
            if($matrix == false){
                return false;
            }
            for($x = 1; $x <= 3; $x++){
                for($y = 1; $y <= 3; $y++){
                    if(self::ifStraight($x, $y)){
                        $path = self::doPath_Array($x, $y);
                        if($matrix -> get($x, $y) == 1 && $matrix -> get($x + $path['x'], $y + $path['y']) == 1){
                            $matrix = goWay($path, $pathElement);
                            return $matrix;
                        }
                    }
                }
            }
            return false;
        }
    
        public static function analyseEdgesBig(fixedArray|bool $matrix, PathElement2D &$pathElement) : fixedArray | false {
            if($matrix == false){
                return false;
            }
            for($x = 1; $x <= 3; $x++){
                for($y = 1; $y <= 3; $y++){
                    if(self::ifEdge($x, $y)){
                        $path = self::doPath_Array($x, $y);
                        if($matrix -> get($x, $y) == 1 && $matrix -> get($x + $path['x'], $y + $path['y']) == 1){
                            $matrix = goWay($path, $pathElement);
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
    }

    class PathHelper {
        public static $FlagG1 = true;
        public static function smoothPaths(PathObject $PathObject) : PathObject {
            $PathElements = $PathObject -> getElements();
            $PathObjectOut = new PathObject();
            foreach($PathElements as $PathElement){
                $PathElementOut = new PathElement2D();
                $steps = $PathElement -> getSteps();
                $stepCount = count($steps);
                if($stepCount >= 5 && $steps[0]['x']  == $steps[$stepCount - 1]['x'] && $steps[0]['y']  == $steps[$stepCount - 1]['y']){
                    $cArray = new cycleArray($steps);
                    for($i = 0; $i < $stepCount; $i++){
                        $x = ($cArray -> get($i + 2)['x'] + $cArray -> get($i - 2)['x'] + $cArray -> get($i + 1)['x'] + $cArray -> get($i - 1)['x'] + $steps[$i]['x']) / 5;
                        $y = ($cArray -> get($i + 2)['y'] + $cArray -> get($i - 2)['y'] + $cArray -> get($i + 1)['y'] + $cArray -> get($i - 1)['y'] + $steps[$i]['y']) / 5;
                        $PathElementOut -> addStep($x, $y);
                    }
                } else {
                    for($i = 0; $i < $stepCount; $i++){
                        if($i > 1 && $i < $stepCount -2){
                            $x = ($steps[$i + 2]['x'] + $steps[$i - 2]['x'] + $steps[$i + 1]['x'] + $steps[$i - 1]['x'] + $steps[$i]['x']) / 5;
                            $y = ($steps[$i + 2]['y'] + $steps[$i - 2]['y'] + $steps[$i + 1]['y'] + $steps[$i - 1]['y'] + $steps[$i]['y']) / 5;
                            $PathElementOut -> addStep($x, $y);
                        } else {
                            $PathElementOut -> addStep($steps[$i]['x'], $steps[$i]['y']);
                        }
                    }
                }
                $PathObjectOut -> addElement($PathElementOut);
            }
            return $PathObjectOut;
        }
        public static function fixElements(PathObject $PathObject) : PathObject{
            global $LIGHTER_HEIGHT;
            global $LIGHTER_WIDTH;
            global $LIGHTER_MULTIPLY;
            $PathElements = $PathObject -> getElements();
            $PathObjectOutput = new PathObject();
            $LW = $LIGHTER_WIDTH;
            $LH = $LIGHTER_HEIGHT;
            foreach($PathElements as $key => $element){
                $last = array(); 
                $newPathElement = new PathElement2D();
                $steps = $element -> getSteps();
                $last['x'] = -100000;
                $last['y'] = -100000;
                foreach($steps as $key1 => $step){
                    if($step['x'] >= -2 && $step['x'] <= $LW){
                        if($step['y'] >= -2 && $step['y'] <= $LH){
                            if($step['x'] != $last['x'] OR $step['y'] != $last['y']){

                                if($steps[$key1-1]['x'] >= -2 && $steps[$key1-1]['x'] <= $LW){
                                    if($steps[$key1-1]['y'] >= -2 && $steps[$key1-1]['y'] <= $LH){
                                        
                                    } else {
                                        if($key1 != 0){
                                            $Nstep = self::LimitCoords($step, $steps[$key1-1], null, $LH);
                                            $newPathElement -> addStep($Nstep['x'], $Nstep['y']);
                                        }
                                    }
                                } else {
                                    if($key1 != 0){
                                        $Nstep = self::LimitCoords($step, $steps[$key1-1], $LW);
                                        $newPathElement -> addStep($Nstep['x'], $Nstep['y']);
                                    }
                                }
                                $newPathElement -> addStep($step['x'], $step['y']);
                                $last['x'] = $step['x'];
                                $last['y'] = $step['y'];
                            }
                        } else {
                            if($last['x'] != -100000 && $last['y'] != -100000){
                                $Nstep = self::LimitCoords($step, $last, null, $LH);
                                if($Nstep['x'] != $last['x'] OR $Nstep['y'] != $last['y']){
                                    $newPathElement -> addStep($Nstep['x'], $Nstep['y']);
                                    $last['x'] = $Nstep['x'];
                                    $last['y'] = $Nstep['y'];
                                }
                            }
                            if($newPathElement -> stepCount() > 1){
                                $PathObjectOutput -> addElement($newPathElement);
                            }
                            $newPathElement = new PathElement2D();
                        }
                    } else {
                        if($last['x'] != -100000 && $last['y'] != -100000){
                            $Nstep = self::LimitCoords($step, $last, $LW);
                            if($Nstep['x'] != $last['x'] OR $Nstep['y'] != $last['y']){
                                $newPathElement -> addStep($Nstep['x'], $Nstep['y']);
                                $last['x'] = $Nstep['x'];
                                $last['y'] = $Nstep['y'];
                            }
                        }
                        if($newPathElement -> stepCount() > 1){
                            $PathObjectOutput -> addElement($newPathElement);
                        }
                        $newPathElement = new PathElement2D();
                    }
                } 
                if($newPathElement -> stepCount() != 0){
                    $PathObjectOutput -> addElement($newPathElement);
                }
            }
            return $PathObjectOutput;
        }
        public static function translatePathObject(PathObject $PathObject) : PathObject{
            $PathObjectOut = new PathObject();
            $pathElements = $PathObject -> getElements();
            foreach($pathElements as $pathElement){
                $PathElementOut = new PathElement2D();
                $steps = $pathElement -> getSteps();
                foreach($steps as $step){
                    $r = CalcCoords($step['x'], $step['y']);
                    $PathElementOut -> addStep($r -> x, $r -> y);
                }
                $PathObjectOut -> addElement($PathElementOut);
            }
            return $PathObjectOut;
        }    
        public static function sortPath1(PathObject $pathObject, bool $combineFlag = true) : PathObject{
            $PathObjectOutput = new PathObject();
            $pathElements = $pathObject -> getElements();
            $last = [];
            while(count($pathElements) > 0){
                $minDist = 99999999;
                $minElement = [];
                foreach($pathElements as $key => $pathElement){
                    if(count($last) == 0){
                        $last['x'] = $pathElement -> getSteps(count($pathElement -> getSteps()) -1)['x'];
                        $last['y'] = $pathElement -> getSteps(count($pathElement -> getSteps()) -1)['y'];
                        $PathObjectOutput -> addElement($pathElement);
                        array_splice($pathElements, $key, 1);
                        continue 2;
                    } else {
                        $dX = $pathElement -> getSteps(0)['x'] - $last['x'];
                        $dY = $pathElement -> getSteps(0)['y'] - $last['y'];
                        $dist = sqrt(pow($dX, 2) + pow($dY, 2));
                        if($dist < $minDist){
                            $minDist = $dist;
                            $minElement['ele'] = $pathElement;
                            $minElement['key'] = $key;
                            $minElement['invert'] = false;
                        }
                        $dX = $pathElement -> getSteps(count($pathElement -> getSteps()) -1)['x'] - $last['x'];
                        $dY = $pathElement -> getSteps(count($pathElement -> getSteps()) -1)['y'] - $last['y'];
                        $dist = sqrt(pow($dX, 2) + pow($dY, 2));
                        if($dist < $minDist){
                            $minDist = $dist;
                            $minElement['ele'] = $pathElement;
                            $minElement['key'] = $key;
                            $minElement['invert'] = true;
                        }
                    }
                }
                if($minElement['invert']){
                    $last['x'] = $minElement['ele'] -> getSteps(0)['x'];
                    $last['y'] = $minElement['ele'] -> getSteps(0)['y'];
                    $minElement['ele'] -> reverse();
                } else {
                    $last['x'] = $minElement['ele'] -> getSteps(count($minElement['ele'] -> getSteps()) -1)['x'];
                    $last['y'] = $minElement['ele'] -> getSteps(count($minElement['ele'] -> getSteps()) -1)['y'];
                }
                if($combineFlag && $minElement['ele'] -> stepCount() > 2 && $minDist <= 3){
                    $PathObjectOutput -> combineElement($PathObjectOutput -> elementCount() -1, $minElement['ele']);
                } else {
                    $PathObjectOutput -> addElement($minElement['ele']);
                }
                array_splice($pathElements, $minElement['key'], 1);
            }
            return $PathObjectOutput;
        }
        public static function shortPaths(PathObject $pathObject) : PathObject {
            $PathObjectOutput = new PathObject();
            $pathElements = $pathObject -> getElements();
            $last = [];
            foreach($pathElements as $key => $pathElement){
                $responsePathObject = f2($pathElement);
                // if($responsePathObject -> stepCount() > 0){
                    $PathObjectOutput -> addElement($responsePathObject);
                // }
            }
            return $PathObjectOutput;
        }
        public static function LimitCoords(array $step, array $last, float $X = null, float $Y = null) : array {
            // 10|10 - 0|0 = 10|10
            // 10/10=1
            // 10|20 - 0|0 = 10|20
            // 20/10 = 2
            $Xn = 0;
            $Yn = 0;
            $dX = $step['x'] - $last['x'];
            $dY = $step['y'] - $last['y'];
            $ddX_Y = 0;
            $ddY_X = 0;
            if($dX != 0){
                $ddX_Y = $dY / $dX; // 2
            } 
            if($dY != 0){
                $ddY_X = $dX / $dY; // 0,5
            }
            $st = [];
            $st['x'] = $last['x'];
            $st['y'] = $last['y'];
            if($last['x'] < $Xn || $step['x'] < $Xn){
                $rY = $ddX_Y * ($last['x'] - $Xn);
                $st['x'] = $Xn;
                $st['y'] = $last['y'] + $rY;
                if($st['y'] < $Yn){
                    $st = self::LimitCoords($st, $step, $X, $Y);
                }
            } else if($last['y'] < $Yn || $step['y'] < $Yn){
                $rX = $ddY_X * ($last['y'] - $Yn);
                $st['y'] = $Yn;
                $st['x'] = $last['x'] - $rX;
                if($st['x'] < $Xn){
                    $st = self::LimitCoords($st, $step, $X, $Y);
                }
            } else {
                if($X != null){
                    $rY = $ddX_Y * ($X - $last['x']);
                    $st['x'] = $X;
                    $st['y'] = $last['y'] - $rY;
                } else if($Y != null){
                    $rX = $ddY_X * ($Y - $last['y']);
                    $st['y'] = $Y;
                    $st['x'] = $last['x'] + $rX;
                }
            }
            return $st;
        }
    }
