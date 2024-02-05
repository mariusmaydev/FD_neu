<?php

require_once $rootpath.'/fd/resources/php/converter/NC/NCModelLaser.php';
    class laserGCodeHelper {
        public static function genProjectImage($ProjectData, $UserID, $ImgData = null, $TextData = null, $args = null){
            global $LIGHTER_HEIGHT;
            global $LIGHTER_WIDTH;
            global $LIGHTER_MULTIPLY;

            $min = 50;
            $max = 200;
            $dif = $max - $min;
            //1900 x 2880
            $imgWidth = 1;
            $imgHeight = 1;
            $ProjectID = $ProjectData[ProjectDB::PROJECT_ID];
            $imgBase = new Imagick();
            $cfg = ConverterConfig::get();
            // $LIGHTER_WIDTH / 50 / 0.1;
            $quality = $cfg -> laserFlat -> quality_PpMM / 1 / 50;
            // $imgBase -> newimage(intval($LIGHTER_WIDTH * 16.4 / 0.9/5), intval($LIGHTER_HEIGHT * 16.4 / 0.9/2/5), "none", 'png');
            $imgBase -> newimage(intval($LIGHTER_WIDTH * $quality), intval($LIGHTER_HEIGHT * $quality), "none", 'png');

            if($ImgData !=null){
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
                    $img->setImageMatte(TRUE);
                    $img->setImageVirtualPixelMethod(Imagick::VIRTUALPIXELMETHOD_TRANSPARENT);
                    $imgBase -> compositeImage($img -> getImage(), Imagick::COMPOSITE_DEFAULT, intval(($xAdd * $quality) - ($width/2)), intval(($yAdd * $quality) - ($height/2)), Imagick::CHANNEL_ALL);
                    // imagecopyresampled($imgBase, $img, $xAdd, $yAdd, 0, 0, $width, $height, $width, $height);
                    $img -> destroy();
                }
            }
            
            // $k = $imgBase -> getImagePixelColor(0, 0) -> getColor(true);
            $pathObj = new PathObject3D();
            $pathEle = null;
            // $imgBase->resizeImage(950, 1440, imagick::FILTER_GAUSSIAN    , 0);
            file_put_contents ("test_1.png", $imgBase);

            for($y = 0; $y < $LIGHTER_HEIGHT * $quality; $y++){
                for($x = 0; $x < $LIGHTER_WIDTH * $quality; $x++){
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
            $cfg = ConverterConfig::get();


            if($args -> PointZero -> X === null){
                $args -> PointZero -> X = $cfg -> laser -> zero -> X;
                $args -> PointZero -> Y = $cfg -> laser -> zero -> Y;
            }
            $model = new NCModelLaser($pathObjOut);//1970 ; 2875 ; = 0,02
            $model -> scale = 0.02;//$LIGHTER_HEIGHT / ($LighterHeight);
            $model -> xNull = $args -> PointZero -> X;//($cfg -> laser -> zero -> X *  $LIGHTER_MULTIPLY) -($LighterWidth / 2);//-(7.5 * ProjectDB::SCALE)) ;//31 = 92.5
            $model -> yNull = $args -> PointZero -> Y + $ProjectData[ProjectDB::SQUARE] -> heightMM;;//($cfg -> laser -> zero -> Y * $LIGHTER_MULTIPLY ) +($LighterHeight / 2);// + (5.25 * ProjectDB::SCALE)) ;//50,5 = 107.25
            $path = PATH_Project::get(PATH_Project::NC, $ProjectData[ProjectDB::PROJECT_ID], $UserID);
            $model -> save($path);
            // Debugger::log($pathObj);
        }
    }