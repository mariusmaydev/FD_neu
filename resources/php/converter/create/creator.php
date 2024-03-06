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
            $pathElement = new PathElement2D();

            $pathElement -> addStep(0, 0);
            $pathElement -> addStep(0, $height);
            $pathElement -> addStep($width, $height);
            $pathElement -> addStep($width, 0);
            $pathElement -> addStep(0, 0);
            $pathObject -> addElement($pathElement);
            if($args -> innerFrame["active"] == "true") {
                $left = $args -> innerFrame["left"];
                $right = $args -> innerFrame["right"];
                $top = $args -> innerFrame["top"];
                $bottom = $args -> innerFrame["bottom"];

                $pathElement_inner = new PathElement2D();
                $pathElement_inner -> addStep($left, $top);
                $pathElement_inner -> addStep($left, $height - $bottom);
                $pathElement_inner -> addStep($width - $right, $height - $bottom);
                $pathElement_inner -> addStep($width - $right, $top);
                $pathElement_inner -> addStep($left, $top);
                $pathObject -> addElement($pathElement_inner);
            }

            $cfg = ConverterConfig::get();
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
            $cfg = ConverterConfig::get();
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
            $cfg = ConverterConfig::get();
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

            $min = $args -> intensity -> min;
            $max = $args -> intensity -> max;
            $dif = $max - $min;
            //1900 x 2880
            $ProjectID = $ProjectData[ProjectDB::PROJECT_ID];
            $imgBase = new Imagick();
            // $LIGHTER_WIDTH / 50 / 0.1;
            $quality = $args -> quality_PpMM / 1 / 50;
            // $imgBase -> newimage(intval($LIGHTER_WIDTH * 16.4 / 0.9/5), intval($LIGHTER_HEIGHT * 16.4 / 0.9/2/5), "none", 'png');
            $imgBase -> newimage(intval($args -> lighterSize -> width * $quality), intval($args -> lighterSize -> height * $quality), "none", 'png');

            if($TextData != null){
                foreach($TextData as $i => $data){
                    $img = Text::getTextImg($data[TextDB::TEXT_ID], $ProjectID, $UserID);
                    $img -> brightnessContrastImage(0, 100, Imagick::CHANNEL_ALL);
                    // $img -> br(100, 0);
                    $img -> edgeImage(1);
                    $img -> modulateImage(100, 0, 0);
                    $img -> setImageFormat('png');

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
                    
                    // ImagickHelper::setColorTransparent($img, 'white');
                    $img -> setImageMatte(TRUE);
                    $img -> setImageVirtualPixelMethod(Imagick::VIRTUALPIXELMETHOD_TRANSPARENT);
                    $imgBase -> compositeImage($img -> getImage(), Imagick::COMPOSITE_DEFAULT, intval(($xAdd * $quality) - ($width/2)), intval(($yAdd * $quality) - ($height/2)), Imagick::CHANNEL_ALL);
                    // imagecopyresampled($imgBase, $img, $xAdd, $yAdd, 0, 0, $width, $height, $width, $height);
                    $img -> destroy();
                }
            }
            
            // $k = $imgBase -> getImagePixelColor(0, 0) -> getColor(true);
            $pathObj = new PathObject3D();
            $pathEle = null;
            // $imgBase->resizeImage(950, 1440, imagick::FILTER_GAUSSIAN    , 0);
            // file_put_contents ("test_1.png", $imgBase);

            for($y = 0; $y < $args -> lighterSize -> height * $quality; $y++){
                for($x = 0; $x < $args -> lighterSize -> width * $quality; $x++){
                    $color = $imgBase -> getImagePixelColor($x, $y) -> getHSL();

                    if($color['luminosity'] > 0 && $color['luminosity'] < 1){
                        if($pathEle == null){
                            $pathEle = new PathElement3D();
                        }

                        $s = $min + ((1 - $color['luminosity']) * $dif);
                        $pathEle -> addStep($x / $quality, $y / $quality, $s);
                        // continue;
                    } else {
                        if($pathEle != null && $pathEle -> stepCount() > 0){
                            $pathObj -> addElement($pathEle);
                        }
                        $pathEle = null;
                    }
                }
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
            $pathElements = $pathObj -> getElements();
            $pathObjOut = new PathObject3D();
            foreach($pathElements as $pathElement){
                $pathElementOut = new PathElement3D();

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
    }