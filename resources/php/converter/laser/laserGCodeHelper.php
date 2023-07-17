<?php

require_once $rootpath.'/fd/resources/php/converter/NC/NCModelLaser.php';
    class laserGCodeHelper {
        public static function genProjectImage($ProjectData, $UserID, $ImgData = null, $TextData = null){
            //1900 x 2880
            $ProjectID = $ProjectData[ProjectDB::PROJECT_ID];
            $imgBase = new Imagick();
            $imgBase -> newimage(1900, 2880, "none", 'png');

            if($ImgData !=null){
                foreach($ImgData as $i => $data){
                    // $PathObject = new PathObject();
                    $img = getSingleProjectImage($UserID, $ProjectID, $data[ImageDB::IMAGE_ID], PATH_Project::IMG_VIEW);

                    // $xScale = $data[ImageDB::IMAGE_WIDTH] / $img -> getImageWidth();
                    // $yScale = $data[ImageDB::IMAGE_HEIGHT] / $img -> getImageHeight();
        
                    $xAdd = $data[ImageDB::IMAGE_POS_X];
                    $yAdd = $data[ImageDB::IMAGE_POS_Y];
        
                    $img -> setImageFormat ('png');
                    $img -> resizeImage($data[ImageDB::IMAGE_WIDTH], $data[ImageDB::IMAGE_HEIGHT], imagick::FILTER_UNDEFINED, 2);
                    $img -> rotateImage("transparent", $data[ImageDB::IMAGE_ALIGN]);
                    $width = $img -> getImageWidth();
                    $height = $img -> getImageHeight();
                    
                    // ImagickHelper::setColorTransparent($img, 'white');
                    $img->setImageMatte(TRUE);
                    $img->setImageVirtualPixelMethod(Imagick::VIRTUALPIXELMETHOD_TRANSPARENT);
                    $imgBase -> compositeImage($img -> getImage(), Imagick::COMPOSITE_DEFAULT, ($xAdd - ($width/2)), ($yAdd - ($height/2)), Imagick::CHANNEL_ALL);
                    // imagecopyresampled($imgBase, $img, $xAdd, $yAdd, 0, 0, $width, $height, $width, $height);
                    $img -> destroy();
                }
            }
            
            // $k = $imgBase -> getImagePixelColor(0, 0) -> getColor(true);
            $pathObj = new PathObject();
            $pathEle = null;
            // $imgBase->resizeImage(950, 1440, imagick::FILTER_GAUSSIAN    , 0);
            file_put_contents ("test_1.png", $imgBase);

            for($y = 0; $y < 2880; $y++){
                for($x = 0; $x < 1900; $x++){
                    $color = $imgBase -> getImagePixelColor($x, $y) -> getColor(true);
                    if($color['a'] > 0.1){
                        if($pathEle == null){
                            $pathEle = new PathElement2D();
                        }
                        $pathEle -> addStep($x, $y);
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
                if($lastDiv_in -> x === null || /*(abs($lastDiv -> x) > 0.05 && abs($lastDiv -> y) > 0.05) ||*/$lastDiv_in -> x == $lastDiv -> x && $lastDiv_in -> y == $lastDiv -> y){
                    $res -> res = true;
                    return $res;
                }
                return $res;
            }
            $pathElements = $pathObj -> getElements();
            $pathObjOut = new PathObject();
            foreach($pathElements as $pathElement){
                $pathElementOut = new PathElement2D();

                $steps = $pathElement -> getSteps();
                $last = $steps[0];
                $lastDiv = new stdClass();
                $lastDiv -> x = null;
                $lastDiv -> y = null;
                foreach ($steps as $key => $step) {
                    if($key == 0 || $key === count($steps) -1){
                        $pathElementOut -> addStep($step['x'] , $step['y'] );
                        $last['x'] = $step['x'];
                        $last['y'] = $step['y'];
                        continue;
                    }
                    $res = f1_k($last, $step, $lastDiv);
                    if($res -> res == true){
                        $last['x'] = $step['x'];
                        $last['y'] = $step['y'];
                    } else {
                        if($key != 0 && $key != count($steps) -1){
                            $pathElementOut -> addStep($step['x'] , $step['y'] );
                        }
                        $last['x'] = $step['x'];
                        $last['y'] = $step['y'];
                    }
                    $lastDiv = $res -> div;
                }
                $pathObjOut -> addElement($pathElementOut);
            }
            $cfg = ConverterConfig::get();
            
            $LighterWidth   = ProjectDB::LIGHTER_WIDTH * 61.29;//ProjectDB::SCALE;
            $LighterHeight  = ProjectDB::LIGHTER_HEIGHT * 61.29;//ProjectDB::SCALE;

            $model = new NCModelLaser($pathObjOut);//1970 ; 2875 ; = 0,02
            $model -> scale = ProjectDB::LIGHTER_HEIGHT / ($LighterHeight);
            $model -> xNull = ($cfg -> zero -> X * ProjectDB::SCALE) -($LighterWidth / 2) ;//-(7.5 * ProjectDB::SCALE)) ;//31 = 92.5
            $model -> yNull = ($cfg -> zero -> Y * ProjectDB::SCALE) -($LighterHeight / 2);// + (5.25 * ProjectDB::SCALE)) ;//50,5 = 107.25

            $path = PATH_Project::get(PATH_Project::NC, $ProjectData[ProjectDB::PROJECT_ID], $UserID);
            $model -> save($path);
            // Debugger::log($pathObj);
        }
    }