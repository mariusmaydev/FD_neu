<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/create/creatorKernel.php';


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
        public static function img2Path(Imagick $img, bool $invert = false) : PathObject2D {
            $pathObject = new PathObject2D();
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
        public static function fArray2Path(fixedArray $fArray) : PathObject2D {
 
            $flag = false;
            $pathObject = new PathObject2D();
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
            $kernel = new ConverterCreatorKernel($fArray, 0, 0);
            foreach($fArray -> array as $key => $element){
                if($element == 1){
                    $index = $fArray -> getCoordsForIndex($key);
                    $kernel -> x = $index['x'];
                    $kernel -> y = $index['y'];
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
    }

    class PathHelper {
        public static $FlagG1 = true;
        public static function smoothBezier_complex(PathObject2D $PathObject) : PathObject2D {
            // if($smoothingFactor % 2 == 1){
            //     $smoothingFactor_Calc = ($smoothingFactor - 1) / 2;
            // } else {
            //     $smoothingFactor_Calc = ($smoothingFactor) / 2;
            // }
            $PathElements = $PathObject -> getElements();
            $PathObjectOut = new PathObject2D();
            foreach($PathElements as $PathElement){
                $PathElementOut = new PathElement2D();
                $steps = $PathElement -> getSteps();
                $stepCount = count($steps);
                if($stepCount >= 5 && $steps[0]['x']  == $steps[$stepCount - 1]['x'] && $steps[0]['y']  == $steps[$stepCount - 1]['y']){
                    $cArray = new cycleArray($steps);
                    for($i = 1; $i < $stepCount - 1; $i++){
                        $t = 0.5;
                        $x = [5];
                        $x[0] = $cArray -> get($i-2)['x'];
                        $x[1] = $cArray -> get($i-1)['x'];
                        $x[2] = $cArray -> get($i)['x'];
                        $x[3] = $cArray -> get($i+1)['x'];
                        $x[4] = $cArray -> get($i+2)['x'];

                        $y = [5];
                        $y[0] = $cArray -> get($i-2)['y'];
                        $y[1] = $cArray -> get($i-1)['y'];
                        $y[2] = $cArray -> get($i)['y'];
                        $y[3] = $cArray -> get($i+1)['y'];
                        $y[4] = $cArray -> get($i+2)['y'];

                        $xL0_1 = ((1 - $t) * $x[0] + $t * $x[1]);
                        $xL1_2 = ((1 - $t) * $x[1] + $t * $x[2]);
                        $xL2_3 = ((1 - $t) * $x[2] + $t * $x[3]);
                        $xL3_4 = ((1 - $t) * $x[3] + $t * $x[4]);

                        $xL0_1__2 = (1 - $t) * $xL0_1 + $t * $xL1_2;
                        $xL1_2__2 = (1 - $t) * $xL1_2 + $t * $xL2_3;
                        $xL2_3__2 = (1 - $t) * $xL2_3 + $t * $xL3_4;

                        
                        $xL0_1__3 = (1 - $t) * $xL0_1__2 + $t * $xL1_2__2;
                        $xL1_2__3 = (1 - $t) * $xL1_2__2 + $t * $xL2_3__2;

                        $x_j = (1 - $t) * $xL0_1__3 + $t * $xL1_2__3;

                        $yL0_1 = ((1 - $t) * $y[0] + $t * $y[1]);
                        $yL1_2 = ((1 - $t) * $y[1] + $t * $y[2]);
                        $yL2_3 = ((1 - $t) * $y[2] + $t * $y[3]);
                        $yL3_4 = ((1 - $t) * $y[3] + $t * $y[4]);

                        $yL0_1__2 = (1 - $t) * $yL0_1 + $t * $yL1_2;
                        $yL1_2__2 = (1 - $t) * $yL1_2 + $t * $yL2_3;
                        $yL2_3__2 = (1 - $t) * $yL2_3 + $t * $yL3_4;

                        
                        $yL0_1__3 = (1 - $t) * $yL0_1__2 + $t * $yL1_2__2;
                        $yL1_2__3 = (1 - $t) * $yL1_2__2 + $t * $yL2_3__2;

                        $y_j = (1 - $t) * $yL0_1__3 + $t * $yL1_2__3;
                        $PathElementOut -> addStep($x_j, $y_j);
                    }
                } else {
                    for($i = 0; $i < $stepCount; $i++){

                        if($i > 1 && $i < $stepCount - 2){
                            $t = 0.5;
                            $x = [5];
                            $x[0] = $steps[$i-2]['x'];
                            $x[1] = $steps[$i-1]['x'];
                            $x[2] = $steps[$i]['x'];
                            $x[3] = $steps[$i+1]['x'];
                            $x[4] = $steps[$i+2]['x'];
    
                            $y = [5];
                            $y[0] = $steps[$i-2]['y'];
                            $y[1] = $steps[$i-1]['y'];
                            $y[2] = $steps[$i]['y'];
                            $y[3] = $steps[$i+1]['y'];
                            $y[4] = $steps[$i+2]['y'];
    
                            $xL0_1 = ((1 - $t) * $x[0] + $t * $x[1]);
                            $xL1_2 = ((1 - $t) * $x[1] + $t * $x[2]);
                            $xL2_3 = ((1 - $t) * $x[2] + $t * $x[3]);
                            $xL3_4 = ((1 - $t) * $x[3] + $t * $x[4]);
    
                            $xL0_1__2 = (1 - $t) * $xL0_1 + $t * $xL1_2;
                            $xL1_2__2 = (1 - $t) * $xL1_2 + $t * $xL2_3;
                            $xL2_3__2 = (1 - $t) * $xL2_3 + $t * $xL3_4;
    
                            
                            $xL0_1__3 = (1 - $t) * $xL0_1__2 + $t * $xL1_2__2;
                            $xL1_2__3 = (1 - $t) * $xL1_2__2 + $t * $xL2_3__2;
    
                            $x_j = (1 - $t) * $xL0_1__3 + $t * $xL1_2__3;
    
                            $yL0_1 = ((1 - $t) * $y[0] + $t * $y[1]);
                            $yL1_2 = ((1 - $t) * $y[1] + $t * $y[2]);
                            $yL2_3 = ((1 - $t) * $y[2] + $t * $y[3]);
                            $yL3_4 = ((1 - $t) * $y[3] + $t * $y[4]);
    
                            $yL0_1__2 = (1 - $t) * $yL0_1 + $t * $yL1_2;
                            $yL1_2__2 = (1 - $t) * $yL1_2 + $t * $yL2_3;
                            $yL2_3__2 = (1 - $t) * $yL2_3 + $t * $yL3_4;
    
                            
                            $yL0_1__3 = (1 - $t) * $yL0_1__2 + $t * $yL1_2__2;
                            $yL1_2__3 = (1 - $t) * $yL1_2__2 + $t * $yL2_3__2;
    
                            $y_j = (1 - $t) * $yL0_1__3 + $t * $yL1_2__3;
                            $PathElementOut -> addStep($x_j, $y_j);
                        } else {
                            $PathElementOut -> addStep($steps[$i]['x'], $steps[$i]['y']);
                        }
                    }
                }
                $PathObjectOut -> addElement($PathElementOut);
            }
            return $PathObjectOut;
        }
        public static function smoothBezier(PathObject2D $PathObject) : PathObject2D {
            // if($smoothingFactor % 2 == 1){
            //     $smoothingFactor_Calc = ($smoothingFactor - 1) / 2;
            // } else {
            //     $smoothingFactor_Calc = ($smoothingFactor) / 2;
            // }
            $PathElements = $PathObject -> getElements();
            $PathObjectOut = new PathObject2D();
            foreach($PathElements as $PathElement){
                $PathElementOut = new PathElement2D();
                $steps = $PathElement -> getSteps();
                $stepCount = count($steps);
                if($stepCount >= 3 && $steps[0]['x']  == $steps[$stepCount - 1]['x'] && $steps[0]['y']  == $steps[$stepCount - 1]['y']){
                    $cArray = new cycleArray($steps);
                    for($i = 1; $i < $stepCount -1; $i++){
                        $t = 0.5;
                        $x_j = pow(1-$t, 2) * $cArray -> get($i - 1)['x'] + 2 * (1 - $t) * $t * $cArray -> get($i)['x'] + pow($t, 2) * $cArray -> get($i + 1)['x'];
                        $y_j = pow(1-$t, 2) * $cArray -> get($i - 1)['y'] + 2 * (1 - $t) * $t * $cArray -> get($i)['y'] + pow($t, 2) * $cArray -> get($i + 1)['y']; ;

                        $PathElementOut -> addStep($x_j, $y_j);
                    }
                } else {
                    for($i = 0; $i < $stepCount; $i++){
                        if($i > 0 && $i < $stepCount - 1){
                            $t = 0.5;
                            $x_j = pow(1 - $t, 2) * $steps[$i - 1]['x'] + 2 * (1 - $t) * $t * $steps[$i]['x'] + pow($t, 2) * $steps[$i + 1]['x'];
                            $y_j = pow(1 - $t, 2) * $steps[$i - 1]['y'] + 2 * (1 - $t) * $t * $steps[$i]['y'] + pow($t, 2) * $steps[$i + 1]['y']; 
    
                            $PathElementOut -> addStep($x_j, $y_j);
                        } else {
                            $PathElementOut -> addStep($steps[$i]['x'], $steps[$i]['y']);
                        }
                    }
                }
                $PathObjectOut -> addElement($PathElementOut);
            }
            return $PathObjectOut;
        }
        public static function smoothPaths(PathObject2D $PathObject, int $smoothingFactor = 5, bool $weighted = true, float $intensity = 1) : PathObject2D {
            if($smoothingFactor % 2 == 1){
                $smoothingFactor_Calc = ($smoothingFactor - 1) / 2;
            } else {
                $smoothingFactor_Calc = ($smoothingFactor) / 2;
            }
            $PathElements = $PathObject -> getElements();
            $PathObjectOut = new PathObject2D();
            foreach($PathElements as $PathElement){
                $PathElementOut = new PathElement2D();
                $steps = $PathElement -> getSteps();
                $stepCount = count($steps);
                if($stepCount >= $smoothingFactor && $steps[0]['x']  == $steps[$stepCount - 1]['x'] && $steps[0]['y']  == $steps[$stepCount - 1]['y']){
                    $cArray = new cycleArray($steps);
                    for($i = 0; $i < $stepCount; $i++){
                        $x_j = 0;
                        $y_j = 0;
                        if($weighted){
                            $r = 0;
                            for($ie = 1; $ie <= $smoothingFactor_Calc; $ie++){
                                $r += $ie;
                            }
                            $rI = 2 * $r + ($smoothingFactor_Calc + 1);
                            $spl = $smoothingFactor / $rI;
    
                            for($j = -($smoothingFactor_Calc); $j <= $smoothingFactor_Calc; $j++){
                                $x_j += $cArray -> get($i + $j)['x'] * ($spl * ($smoothingFactor_Calc + 1 - abs($j)));
                                $y_j += $cArray -> get($i + $j)['y'] * ($spl * ($smoothingFactor_Calc + 1 - abs($j)));
                            }
                        } else {
                            for($j = -($smoothingFactor_Calc); $j <= $smoothingFactor_Calc; $j++){
                                $x_j += $cArray -> get($i + $j)['x'];
                                $y_j += $cArray -> get($i + $j)['y'];
                            }
                        }
                        $x_Calc = $x_j / $smoothingFactor;
                        $Xdif = $cArray -> get($i)['x'] - $x_Calc;
                        $x_j = $cArray -> get($i)['x'] - ($Xdif * $intensity);

                        $y_Calc = $y_j / $smoothingFactor;
                        $Ydif = $cArray -> get($i)['y'] - $y_Calc;
                        $y_j = $cArray -> get($i)['y'] - ($Ydif * $intensity);

                        $PathElementOut -> addStep($x_j, $y_j);
                    }
                } else {
                    for($i = 0; $i < $stepCount; $i++){

                        if($i > $smoothingFactor_Calc - 1 && $i < $stepCount - $smoothingFactor_Calc){
                            $x_j = 0;
                            $y_j = 0;
                            if($weighted){
                                $r = 0;
                                for($ie = 1; $ie <= $smoothingFactor_Calc; $ie++){
                                    $r += $ie;
                                }
                                $rI = 2 * $r + ($smoothingFactor_Calc + 1);
                                $spl = $smoothingFactor / $rI;
                                for($j = -($smoothingFactor_Calc); $j <= $smoothingFactor_Calc; $j++){
                                    $x_j += $steps[$i + $j]['x'] * ($spl * ($smoothingFactor_Calc + 1 - abs($j)));
                                    $y_j += $steps[$i + $j]['y'] * ($spl * ($smoothingFactor_Calc + 1 - abs($j)));
                                }
                            } else {
                                for($j = -($smoothingFactor_Calc); $j <= $smoothingFactor_Calc; $j++){
                                    $x_j += $steps[$i + $j]['x'];
                                    $y_j += $steps[$i + $j]['y'];
                                }
                            }
                            $x_Calc = $x_j / $smoothingFactor;
                            $Xdif = $steps[$i]['x'] - $x_Calc;
                            $x_j = $steps[$i]['x'] - ($Xdif * $intensity);
    
                            $y_Calc = $y_j / $smoothingFactor;
                            $Ydif = $steps[$i]['y'] - $y_Calc;
                            $y_j = $steps[$i]['y'] - ($Ydif * $intensity);
                            $PathElementOut -> addStep($x_j, $y_j);
                        // }
                        // exit();
                        // if($i > 1 && $i < $stepCount -2){
                        //     $x = ($steps[$i + 2]['x'] + $steps[$i - 2]['x'] + $steps[$i + 1]['x'] + $steps[$i - 1]['x'] + $steps[$i]['x']) / 5;
                        //     $y = ($steps[$i + 2]['y'] + $steps[$i - 2]['y'] + $steps[$i + 1]['y'] + $steps[$i - 1]['y'] + $steps[$i]['y']) / 5;
                        //     $PathElementOut -> addStep($x, $y);
                        } else {
                            $PathElementOut -> addStep($steps[$i]['x'], $steps[$i]['y']);
                        }
                    }
                }
                $PathObjectOut -> addElement($PathElementOut);
            }
            return $PathObjectOut;
        }
        public static function fixElements(PathObject2D $PathObject, stdClass $lighterSize) : PathObject2D {
            $PathElements = $PathObject -> getElements();
            $PathObjectOutput = new PathObject2D();
            $LW = $lighterSize -> width;
            $LH = $lighterSize -> height;
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

                                if(isset($steps[$key1-1]) && $steps[$key1-1]['x'] >= -2 && $steps[$key1-1]['x'] <= $LW){
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
        public static function translatePathObject(PathObject2D $PathObject, stdClass $transformData) : PathObject2D {
            $PathObjectOut = new PathObject2D();
            $pathElements = $PathObject -> getElements();
            foreach($pathElements as $pathElement){
                $PathElementOut = new PathElement2D();
                $steps = $pathElement -> getSteps();
                foreach($steps as $step){
                    $r = self::CalcCoords($step['x'], $step['y'], $transformData);
                    $PathElementOut -> addStep($r -> x, $r -> y);
                }
                $PathObjectOut -> addElement($PathElementOut);
            }
            return $PathObjectOut;
        }    
        public static function sortPath1(PathObject2D $pathObject, bool $combineFlag = true) : PathObject2D {
            $PathObjectOutput = new PathObject2D();
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
                if($combineFlag && $minElement['ele'] -> stepCount() > 2 && $minDist <= 4){
                    $PathObjectOutput -> combineElement($PathObjectOutput -> elementCount() -1, $minElement['ele']);
                } else {
                    $PathObjectOutput -> addElement($minElement['ele']);
                }
                array_splice($pathElements, $minElement['key'], 1);
            }
            return $PathObjectOutput;
        }
        
        public static function closePaths(PathObject2D $pathObject) : PathObject2D {
            $PathObjectOutput = new PathObject2D();
            $pathElements = $pathObject -> getElements();
            while(count($pathElements) > 0){
                $pathElement = $pathElements[0];
                $steps = $pathElement -> getSteps();
                $step0 = $steps[0];
                $step1 = $steps[count($steps) -1];
                $dX = $step0['x'] - $step1['x'];
                $dY = $step0['y'] - $step1['y'];
                if(abs($dX) <= 8 && abs($dY) <= 8){
                    $pathElement -> addStep($step0['x'], $step0['y']);
                }
                if($pathElement -> stepCount() >= 1){
                    $PathObjectOutput -> addElement($pathElement);
                }
                array_splice($pathElements, 0, 1);
            }
            return $PathObjectOutput;
        }
        public static function shortPaths(PathObject2D $pathObject) : PathObject2D {
            $PathObjectOutput = new PathObject2D();
            $pathElements = $pathObject -> getElements();
            $last = [];
            foreach($pathElements as $key => $pathElement){
                $responsePathObject = self::f2($pathElement);
                // if($responsePathObject -> stepCount() > 0){
                    $PathObjectOutput -> addElement($responsePathObject);
                // }
            }
            return $PathObjectOutput;
        }
        private static function f2(PathElement2D $pathElement){
            $pathElementOutput = new PathElement2D(); 
            $steps = $pathElement -> getSteps();
            while(count($steps) > 1){
                    $pathElementOutput -> addStep($steps[0]['x'], $steps[0]['y']);
                    $dX1 = $steps[1]['x'] - $steps[0]['x'];
                    $dY1 = $steps[1]['y'] - $steps[0]['y'];
                    array_splice($steps, 0, 1);
                    while(true){
                        if(count($steps) <= 2){
                            $pathElementOutput -> addStep($steps[0]['x'], $steps[0]['y']);
                            if(count($steps) == 2){
                                $pathElementOutput -> addStep($steps[1]['x'], $steps[1]['y']);
                            }
                            break 2;
                        }
                        $dX = $steps[1]['x'] - $steps[0]['x'];
                        $dY = $steps[1]['y'] - $steps[0]['y'];
                        if($dX1 == $dX && $dY1 == $dY){
                            array_splice($steps, 0, 1);
                        } else {
                            $pathElementOutput -> addStep($steps[0]['x'], $steps[0]['y']);
                            array_splice($steps, 0, 1);
                            break;
                        }
                    }
            }
            return $pathElementOutput;
        }
        public static function CalcCoords(float $x, float $y, stdClass $transformData) : stdClass{
            $align = $transformData -> align;
            $xAdd = $transformData -> addValue -> x;
            $yAdd = $transformData -> addValue -> y;
            $xScale = $transformData -> scale -> x;
            $yScale = $transformData -> scale -> y;
            $offsetCenter = $transformData -> offsetCenter;
        
            $r = 8;
            $x = $x * $xScale - $offsetCenter -> x;
            $y = $y * $yScale - $offsetCenter -> y;
            $output = new stdClass();
            $output -> x = round($x * $align -> cos - $y * $align -> sin + $xAdd, $r);
            $output -> y = round($x * $align -> sin + $y * $align -> cos + $yAdd, $r);
            return $output;
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
