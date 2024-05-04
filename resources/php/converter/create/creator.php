<?php    
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/NC/NCLaserCodeFlat.php';
    require_once $rootpath.'/fd/resources/php/converter/create/doImage.php';
    require_once $rootpath.'/fd/resources/php/converter/create/PathElements/PathObject2D.php';
    require_once $rootpath.'/fd/resources/php/converter/create/PathElements/PathObject3D.php';
    require_once 'creatorHelper.php';

    class ConverterCreator {
        public static function createLaserFrame($ProjectData, $UserID, $args){
            $square = $ProjectData[ProjectDB::SQUARE];
            $width = $square -> widthMM;
            $height = $square -> heightMM;
            $pathObject = new PathObject2D();

            $left = $args -> OffsetFrame["left"];
            $right = $args -> OffsetFrame["right"];
            $top = $args -> OffsetFrame["top"];
            $bottom = $args -> OffsetFrame["bottom"];

                $pathElement_inner = new PathElement2D();
                $pathElement_inner -> addStep(0, 0);
                $pathElement_inner -> addStep(0, $height);
                $pathElement_inner -> addStep($width, $height);
                $pathElement_inner -> addStep($width, 0);
                $pathElement_inner -> addStep(0, 0);
                $pathObject -> addElement($pathElement_inner);

            if($args -> OffsetFrame["active"] == "true"){
                $pathElement_frame = new PathElement2D();
                $pathElement_frame -> addStep(-$left, -$bottom);
                $pathElement_frame -> addStep(-$left, $height + $top);
                $pathElement_frame -> addStep($width + $right, $height + $top);
                $pathElement_frame -> addStep($width + $right, -$bottom);
                $pathElement_frame -> addStep(-$left, -$bottom);
                $pathObject -> addElement($pathElement_frame);
            }

            $cfg = ConverterConfig::get($args -> CurrentConfig);
            if($args -> PointZero -> X === null){
                $args -> PointZero -> X = $cfg -> laser -> zero -> X;
                $args -> PointZero -> Y = $cfg -> laser -> zero -> Y;
            }
            $model = new NCLaserModel($pathObject, $cfg);
            $model -> scale = 1;
            $model -> xNull = $args -> PointZero -> X;
            $model -> yNull = $args -> PointZero -> Y + $ProjectData[ProjectDB::SQUARE] -> heightMM;
            $path = PATH_Project::get(PATH_Project::FRAME, $ProjectData[ProjectDB::PROJECT_ID], $UserID);
            $model -> save($path);
        }
        public static function createLaserFlatData($ProjectData, $UserID, $args, PathObject3D $PathObject){
            $cfg = ConverterConfig::get($args -> CurrentConfig);
            if($args -> PointZero -> X === null){
                $args -> PointZero -> X = $cfg -> laserFlat -> zero -> X;
                $args -> PointZero -> Y = $cfg -> laserFlat -> zero -> Y;
            }
            $model = new NCLaserModel_Flat($PathObject, $cfg);
            $model -> scale = 0.02;
            $model -> xNull = $args -> PointZero -> X;
            $model -> yNull = $args -> PointZero -> Y + $ProjectData[ProjectDB::SQUARE] -> heightMM;
            $path = PATH_Project::get(PATH_Project::NC, $ProjectData[ProjectDB::PROJECT_ID], $UserID);
            $model -> save($path);
        }
        public static function createSVGData($ProjectData, $UserID, $args, PathObject2D $PathObject){
            $cfg = ConverterConfig::get();
            if($args -> PointZero -> X === null){
                $args -> PointZero -> X = $cfg -> SVG -> zero -> X;
                $args -> PointZero -> Y = $cfg -> SVG -> zero -> Y;
            }
            $model = new SVGModel($PathObject);
            $model -> scale = 0.02;
            $model -> xNull = $args -> PointZero -> X;
            $model -> yNull = $args -> PointZero -> Y + $ProjectData[ProjectDB::SQUARE] -> heightMM;
            $path = PATH_Project::get(PATH_Project::NC, $ProjectData[ProjectDB::PROJECT_ID], $UserID);
            $model -> save($path);
        }
        public static function createEngravingData($ProjectData, $UserID, $args, PathObject2D $PathObject){
            $cfg = ConverterConfig::get();
            if($args -> PointZero -> X === null){
                $args -> PointZero -> X = $cfg -> engraving -> zero -> X;
                $args -> PointZero -> Y = $cfg -> engraving -> zero -> Y;
            }
            $model = new NCEngravingModel($PathObject);
            $model -> scale = 0.02;
            $model -> xNull = $args -> PointZero -> X;
            $model -> yNull = $args -> PointZero -> Y + $ProjectData[ProjectDB::SQUARE] -> heightMM;
            $path = PATH_Project::get(PATH_Project::NC, $ProjectData[ProjectDB::PROJECT_ID], $UserID);
            $model -> save($path);
        }
        public static function createLaserData($ProjectData, $UserID, $args, PathObject2D $PathObject) {
            $cfg = ConverterConfig::get($args -> CurrentConfig);
            if($args -> PointZero -> X === null){
                $args -> PointZero -> X = $cfg -> laser -> zero -> X;
                $args -> PointZero -> Y = $cfg -> laser -> zero -> Y;
            }
            $model = new NCLaserModel($PathObject, $cfg);
            $model -> scale = 0.02;
            $model -> xNull = $args -> PointZero -> X;
            $model -> yNull = $args -> PointZero -> Y + $ProjectData[ProjectDB::SQUARE] -> heightMM;

            $path = PATH_Project::get(PATH_Project::NC, $ProjectData[ProjectDB::PROJECT_ID], $UserID);
            $model -> save($path);
        }
        public static function createPathObject($ProjectData, $UserID, $args, $ImgData = null, $TextData = null) : PathObject2D {
            $ProjectID = $ProjectData[ProjectDB::PROJECT_ID];
            
            $PathObjectOut = new PathObject2D();
            if($TextData != null){
                foreach($TextData as $i => $data){
                    $PathObject = new PathObject2D();
                    $img = Text::getTextImg($data[TextDB::TEXT_ID], $ProjectID, $UserID);
                    $img -> brightnessContrastImage(0, 100);
                    $img -> edgeImage(1);
                    $img -> modulateImage(0, 0, 100);
                    $img -> setImageFormat('png');
                    $transformData = new stdClass();
                    $transformData -> scale = new stdClass();
                    $transformData -> scale -> x = ($data[TextDB::TEXT_FRAME_WIDTH] * 2) / $img -> getImageWidth();
                    $transformData -> scale -> y = ($data[TextDB::TEXT_FRAME_HEIGHT] * 2) / $img -> getImageHeight();
                    $transformData -> addValue = new stdClass();
                    $transformData -> addValue -> x = $data[TextDB::TEXT_POS_X];
                    $transformData -> addValue -> y = $data[TextDB::TEXT_POS_Y];
                    $transformData -> offsetCenter = new stdClass();
                    $transformData -> offsetCenter -> x =($data[TextDB::TEXT_FRAME_WIDTH] * 2) / 2;
                    $transformData -> offsetCenter -> y =($data[TextDB::TEXT_FRAME_HEIGHT] * 2) / 2;
                    $transformData -> align = new stdClass();
                    $transformData -> align -> sin = sin(deg2rad($data[TextDB::TEXT_ALIGN]));
                    $transformData -> align -> cos = cos(deg2rad($data[TextDB::TEXT_ALIGN]));
        
                    $fArray = creatorHelper::img2fArray($img, true);
                    $img -> destroy();
                    creatorHelper::checkImgArray($fArray);
                    // $gh = $fArray -> getArray();
                    // creatorHelper::farray2file($fArray, "test" . random_int(0, 9) . ".txt");
                    // $imgGD = creatorHelper::fArray2img($fArray);
                    // imagepng($imgGD, "test_2.png");
                    // $offsetCenter['x'] = ($data[TextDB::TEXT_FRAME_WIDTH]*2) / 2;
                    // $offsetCenter['y'] = ($data[TextDB::TEXT_FRAME_HEIGHT]*2) / 2;
                    // $align['sin'] = sin(deg2rad($data[TextDB::TEXT_ALIGN]));
                    // $align['cos'] = cos(deg2rad($data[TextDB::TEXT_ALIGN]));
        
                    ConverterCreator_doImage::work($PathObject, $fArray);

                    $PathObject = PathHelper::sortPath1($PathObject, true);
                    $PathObject = PathHelper::smoothPaths($PathObject, 5, false, 1);
                    $PathObject = PathHelper::smoothPaths($PathObject, 7, true, 0.5);
                    $PathObject = PathHelper::sortPath1($PathObject, true);
                    $PathObject = PathHelper::shortPaths($PathObject);
                    $PathObject = PathHelper::closePaths($PathObject);
                    $PathObject = PathHelper::smoothPaths($PathObject, 9, true, 0.5);
                    $PathObject = PathHelper::translatePathObject($PathObject, $transformData);
                    $PathObject = PathHelper::fixElements($PathObject, $args -> lighterSize);
                    $PathObjectOut -> combinePathObject($PathObject);
                }
            }
            if($ImgData !=null){
                foreach($ImgData as $i => $data){
                    $PathObject = new PathObject2D();
                    $img = getSingleProjectImage($UserID, $ProjectID, $data[ImageDB::IMAGE_ID], PATH_Project::IMG_VIEW);
                    $img -> setImageFormat('png');
                    $transformData = new stdClass();
                    $transformData -> scale = new stdClass();
                    $transformData -> scale -> x = $data[ImageDB::IMAGE_WIDTH] / $img -> getImageWidth();
                    $transformData -> scale -> y = $data[ImageDB::IMAGE_HEIGHT] / $img -> getImageHeight();
                    $transformData -> addValue = new stdClass();
                    $transformData -> addValue -> x = $data[ImageDB::IMAGE_POS_X];
                    $transformData -> addValue -> y = $data[ImageDB::IMAGE_POS_Y];
                    $transformData -> offsetCenter = new stdClass();
                    $transformData -> offsetCenter -> x = $data[ImageDB::IMAGE_WIDTH] / 2;
                    $transformData -> offsetCenter -> y = $data[ImageDB::IMAGE_HEIGHT] / 2;
                    $transformData -> align = new stdClass();
                    $transformData -> align -> sin = sin(deg2rad($data[ImageDB::IMAGE_ALIGN]));
                    $transformData -> align -> cos = cos(deg2rad($data[ImageDB::IMAGE_ALIGN]));
        
                    $fArray = creatorHelper::img2fArray($img, true);
                    $img -> destroy();
                    creatorHelper::checkImgArray($fArray);
        
                    // $gh = $fArray -> getArray();
                    // creatorHelper::farray2file($fArray, "test" . random_int(0, 9) . ".txt");
                    // TIMER -> print();
                    // file_put_contents ("test_1.png", $img); // works, or:
                    // $img-> writeImage(fopen ("test_2.jpg", "wb")); //also works
                    // $imgGD = creatorHelper::fArray2img($fArray);
                    // imagepng($imgGD, "test_2.png");
                    
                    ConverterCreator_doImage::work($PathObject, $fArray);
                    $PathObject = PathHelper::sortPath1($PathObject, true);
                    $PathObject = PathHelper::smoothPaths($PathObject, 5, false, 1);
                    $PathObject = PathHelper::smoothPaths($PathObject, 7, true, 0.5);
                    $PathObject = PathHelper::sortPath1($PathObject, true);
                    $PathObject = PathHelper::shortPaths($PathObject);
                    $PathObject = PathHelper::closePaths($PathObject);
                    $PathObject = PathHelper::smoothPaths($PathObject, 9, true, 0.5);
                    $PathObject = PathHelper::translatePathObject($PathObject, $transformData);
                    $PathObject = PathHelper::fixElements($PathObject, $args -> lighterSize);
                    $PathObjectOut -> combinePathObject($PathObject);
                }
            }
            $PathObjectOut = PathHelper::sortPath1($PathObjectOut, false);
            return $PathObjectOut;
        }
        public static function createPathObjectLaserFlat($ProjectData, $UserID, $args, $ImgData = null, $TextData = null) : PathObject3D {

            $direction = "row";
            // $renderRow = $args -> rendering -> row;
            //1900 x 2880
            $ProjectID = $ProjectData[ProjectDB::PROJECT_ID];
            $imgBase = new Imagick();
            $quality = $args -> quality_PpMM / 1 / 50;

            $imgBase -> newimage(intval($args -> lighterSize -> width * $quality), intval($args -> lighterSize -> height * $quality), "none", 'png');

            if($TextData != null){
                foreach($TextData as $i => $data){
                    $img = Text::getTextImg($data[TextDB::TEXT_ID], $ProjectID, $UserID);
                    // $img -> brightnessContrastImage(0, 100, Imagick::CHANNEL_ALL);
                    // $img -> br(100, 0);
                    // $img -> edgeImage(1);
                    // $img -> modulateImage(100, 0, 0);
                    $img -> setImageFormat('png');
                    // file_put_contents ("test_1.png", $img); // works, or:

                    $xAdd = $data[TextDB::TEXT_POS_X];
                    $yAdd = $data[TextDB::TEXT_POS_Y];
                    $xScale = ($data[TextDB::TEXT_FRAME_WIDTH] * 2);
                    $yScale = ($data[TextDB::TEXT_FRAME_HEIGHT] * 2);
                    $img -> setImageFormat ('png');
                    $img -> resizeImage(intval($xScale * $quality), intval($yScale * $quality), imagick::FILTER_UNDEFINED, -1, true);
                    
                    $img -> rotateImage("transparent", $data[TextDB::TEXT_ALIGN]);
                    $width = $img -> getImageWidth();
                    $height = $img -> getImageHeight();
                    
                    $img -> setImageMatte(TRUE);
                    $img -> setImageVirtualPixelMethod(Imagick::VIRTUALPIXELMETHOD_TRANSPARENT);
                    $imgBase -> compositeImage($img -> getImage(), Imagick::COMPOSITE_DEFAULT, intval(($xAdd * $quality) - ($width/2)), intval(($yAdd * $quality) - ($height/2)), Imagick::CHANNEL_ALL);
                    
                    $img -> destroy();
                }
            }
            if($ImgData != null){
                foreach($ImgData as $i => $data){
                    // $PathObject = new PathObject();
                    $img = getSingleProjectImage($UserID, $ProjectID, $data[ImageDB::IMAGE_ID], PATH_Project::IMG_VIEW);

                    // $xScale = $data[ImageDB::IMAGE_WIDTH] / $img -> getImageWidth();
                    // $yScale = $data[ImageDB::IMAGE_HEIGHT] / $img -> getImageHeight();
        
                    $xAdd = $data[ImageDB::IMAGE_POS_X];
                    $yAdd = $data[ImageDB::IMAGE_POS_Y];
        
                    $img -> setImageFormat ('png');
                    $img -> resizeImage(intval($data[ImageDB::IMAGE_WIDTH] * $quality), intval($data[ImageDB::IMAGE_HEIGHT] * $quality), imagick::FILTER_UNDEFINED, 2);
                    $img -> rotateImage("transparent", $data[ImageDB::IMAGE_ALIGN]);
                    $width = $img -> getImageWidth();
                    $height = $img -> getImageHeight();
                    
                    $img -> setImageMatte(TRUE);
                    $img -> setImageVirtualPixelMethod(Imagick::VIRTUALPIXELMETHOD_TRANSPARENT);
                    $imgBase -> compositeImage($img -> getImage(), Imagick::COMPOSITE_DEFAULT, intval(($xAdd * $quality) - ($width/2)), intval(($yAdd * $quality) - ($height/2)), Imagick::CHANNEL_ALL);
                    $img -> destroy();
                }
            }
            
            function iterateRows($args, $quality, $imgBase) : PathObject3D {
                function checkFirst2(&$first, $yd, $xd, &$last, $quality, $y, PathObject3D &$pathObj){
                    if($first){
                        if($last['y'] >= $yd -(1 / $quality)){
                            $offset = -(10 / $quality);
                            if($y % 2 == 1){
                                $offset = (10 / $quality);
                                if($last['x'] < $xd){
                                    $offset += $xd;
                                } else {
                                    $offset += $last['x'];
                                }
                            } else {
                                if($last['x'] > $xd){
                                    $offset += $xd;
                                } else {
                                    $offset += $last['x'];
                                }
                            }
                            $pathEle1 = new PathElement3D();
                            // $pathEle1 -> addStep($offset, $last['y'], 0);
                            $pathEle1 -> addStep($offset, $last['y'] + (0.5 / $quality), 0);
                            $pathObj -> addElement($pathEle1);
                        }
                        $first = false;
                    }
                }
                $min = $args -> intensity -> min;
                $max = $args -> intensity -> max;
                $dif = $max - $min;
                $pathObj = new PathObject3D();
                $pathEle = null;
                $last = [];
                $last['x'] = 0;
                $last['y'] = 0;
                for($y = 0; $y < $args -> lighterSize -> height * $quality; $y++){
                    $first = true;
                    for($xi = 0; $xi < $args -> lighterSize -> width * $quality; $xi++){
                        $x = $xi;
                        if($y % 2 == 1){
                            $x = $args -> lighterSize -> width * $quality - $xi;
                        }
                        $color = $imgBase -> getImagePixelColor($x, $y) -> getHSL();
                        if($color['luminosity'] > 0 && $color['luminosity'] < 1){
                            if($pathEle == null){
                                $pathEle = new PathElement3D();
                            }
                            $xd = $x / $quality;
                            $yd = $y / $quality;
                            checkFirst2($first, $yd, $xd, $last, $quality, $y, $pathObj);
                            $last['x'] = $xd;
                            $last['y'] = $yd;
                            $s = $min + ((1 - $color['luminosity']) * $dif);
                            $pathEle -> addStep($xd, $yd, $s);
                        } else if($args -> intensity -> binary == "true" && $color['luminosity'] == 1){
                            if($pathEle == null){
                                $pathEle = new PathElement3D();
                            }
                            $s = $max;
                            $xd = $x / $quality;
                            $yd = $y / $quality;
                            checkFirst2($first, $yd, $xd, $last, $quality, $y, $pathObj);
                            $last['x'] = $xd;
                            $last['y'] = $yd;
                            $pathEle -> addStep($xd, $yd, $s);
                        } else {
                            if($pathEle != null && $pathEle -> stepCount() > 0){
                                $pathObj -> addElement($pathEle);
                            }
                            $pathEle = null;
                        }
                    }
                }
                return $pathObj;
            }
            function iterateCols($args, $quality, $imgBase) : PathObject3D {
                function checkFirst1(&$first, $yd, $xd, &$last, $quality, $x, PathObject3D &$pathObj){
                    if($first){
                        if($last['x'] >= $xd -(1 / $quality)){
                            $offset = -(10 / $quality);
                            if($x % 2 == 1){
                                $offset = (10 / $quality);
                                if($last['y'] < $yd){
                                    $offset += $yd;
                                } else {
                                    $offset += $last['y'];
                                }
                            } else {
                                if($last['y'] > $yd){
                                    $offset += $yd;
                                } else {
                                    $offset += $last['y'];
                                }
                            }
                            $pathEle1 = new PathElement3D();
                            // $pathEle1 -> addStep($last['x'],$offset, 0);
                            $pathEle1 -> addStep($last['x'] + (0.5 / $quality), $offset, 0);
                            $pathObj -> addElement($pathEle1);
                        }
                        $first = false;
                    }
                }
                $min = $args -> intensity -> min;
                $max = $args -> intensity -> max;
                $dif = $max - $min;
                $pathObj = new PathObject3D();
                $pathEle = null;
                $last = [];
                $last['x'] = 0;
                $last['y'] = 0;
                for($x = 0; $x < $args -> lighterSize -> width * $quality; $x++){
                    $first = true;
                    for($yi = 0; $yi < $args -> lighterSize -> height * $quality; $yi++){
                        $y = $yi;
                        if($x % 2 == 1){
                            $y = $args -> lighterSize -> height * $quality - $yi;
                        }
                        $color = $imgBase -> getImagePixelColor($x, $y) -> getHSL();
                        if($color['luminosity'] > 0 && $color['luminosity'] < 1){
                            if($pathEle == null){
                                $pathEle = new PathElement3D();
                            }
                            $xd = $x / $quality;
                            $yd = $y / $quality;
                            checkFirst1($first, $yd, $xd, $last, $quality, $x, $pathObj);
                            $last['x'] = $xd;
                            $last['y'] = $yd;
                            $s = $min + ((1 - $color['luminosity']) * $dif);
                            $pathEle -> addStep($xd, $yd, $s);
                        } else if($args -> intensity -> binary == "true" && $color['luminosity'] == 1){
                            if($pathEle == null){
                                $pathEle = new PathElement3D();
                            }
                            $s = $max;
                            $xd = $x / $quality;
                            $yd = $y / $quality;
                            checkFirst1($first, $yd, $xd, $last, $quality, $x, $pathObj);
                            $last['x'] = $xd;
                            $last['y'] = $yd;
                            $pathEle -> addStep($xd, $yd, $s);
                        } else {
                            if($pathEle != null && $pathEle -> stepCount() > 0){
                                $pathObj -> addElement($pathEle);
                            }
                            $pathEle = null;
                        }
                    }
                }
                return $pathObj;
            }
                function f1_k($last, $step, $lastDiv_in){
                    $lastDiv = new stdClass();
                    $lastDiv -> x = $last['x'] - $step['x'];
                    $lastDiv -> y = $last['y'] - $step['y'];
    
                    $res = new stdClass();
                    $res -> res = false;
                    $res -> div = $lastDiv;
                    if($lastDiv_in -> x === null || /*(abs($lastDiv -> x) > 0.05 && abs($lastDiv -> y) > 0.05) ||*/$lastDiv_in -> x == $lastDiv -> x && $lastDiv_in -> y == $lastDiv -> y && $last['z'] == $step['z']){
                        $res -> res = true;
                        return $res;
                    }
                    return $res;
                }
            function computePathObject($pathObj) : PathObject3D {
                $pathElements = $pathObj -> getElements();
                $pathObjOut = new PathObject3D();
                foreach($pathElements as $pathElement){
                    $pathElementOut = new PathElement3D();
                    $pathElementOut1 = new PathElement3D();
                    
                    $steps = $pathElement -> getSteps();
                    $last = $steps[0];
                    $lastDiv = new stdClass();
                    $lastDiv -> x = null;
                    $lastDiv -> y = null;
                    $lastDiv -> z = null;
                    foreach ($steps as $key => $step) {
                        if($key == 0 || $key === count($steps) -1){
                            $pathElementOut -> addStep($step['x'] , $step['y'], $step['z']);
                            $last['x'] = $step['x'];
                            $last['y'] = $step['y'];
                            $last['z'] = $step['z'];
                            continue;
                        }
                        $res = f1_k($last, $step, $lastDiv);
                        if($res -> res == true){
                            $last['x'] = $step['x'];
                            $last['y'] = $step['y'];
                            $last['z'] = $step['z'];
                        } else {
                            if($key != 0 && $key != count($steps) -1){
                                $pathElementOut -> addStep($step['x'] , $step['y'], $step['z'] );
                            }
                            $last['x'] = $step['x'];
                            $last['y'] = $step['y'];
                            $last['z'] = $step['z'];
                        }
                        $lastDiv = $res -> div;
                    }
                    $pathObjOut -> addElement($pathElementOut);
                }
                return $pathObjOut;
            }
            $pR = null;
            $pC = null;
            if($args -> rendering -> row == "true"){
                $pR = iterateRows($args, $quality, $imgBase);
            }
            if($args -> rendering -> col == "true"){
                $pC= iterateCols($args, $quality, $imgBase);
            }
            if($pR != null && $pC != null){
                $pR -> combinePathObject($pC);
                $pG = computePathObject($pR);
                return $pG;
            } else {
                if($pR != null){
                    return computePathObject($pR);
                } else {
                    return computePathObject($pC);
                }
            }
        }
    }