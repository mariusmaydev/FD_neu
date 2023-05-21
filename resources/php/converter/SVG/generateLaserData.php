<?php

    //SET_PIN PIN=TOOL VALUE = 0 
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/SVG/createSVG.php';
    // require_once $rootpath.'/fd/resources/php/converter/image/imageCore.php';
    require_once $rootpath.'/fd/resources/php/converter/create/creatorHelper.php';

    $fArray;
    $xAdd;
    $yAdd;
    $xScale;
    $yScale;
    $align = [];
    $offsetCenter = [];
function start_generatingLaserData($ProjectData, $ImgData = null, $TextData = null){
    global $fArray;
    global $yAdd;
    global $xAdd;
    global $xScale;
    global $yScale;
    global $align;
    global $offsetCenter;
    
    $UserID         = Sessions::get(Sessions::USER_ID);
    $ProjectID      = Sessions::get(Sessions::PROJECT_ID);
    
    $LastIndex = array();
    $LastIndex['xM'] = -1;
    $lastIndex['yM'] = -1;
    $PathObjectOut = new PathObject();
    if($TextData != null){
        foreach($TextData as $i => $data){
            $PathObject = new PathObject();
            $img = new Imagick();
            $img -> readImageBlob(base64_to_png($data[TextDB::TEXT_IMG]));
            $img -> brightnessContrastImage(0, 100);
            $img -> edgeImage(1);
            $img -> setImageFormat('png');
            file_put_contents("testOut.png",$img);
            $img ->writeImage("testOut.png");
            $xScale = $data[TextDB::TEXT_FRAME_WIDTH] / $img -> getImageWidth();
            $yScale = $data[TextDB::TEXT_FRAME_HEIGHT] / $img -> getImageHeight();

            $xAdd = $data[TextDB::TEXT_POS_X];
            $yAdd = $data[TextDB::TEXT_POS_Y];

            $fArray = creatorHelper::img2fArray($img, false);
            $img -> destroy();
            creatorHelper::checkImgArray($fArray);
            $y_C = 0;
            $x_C = 0;
            $offsetCenter['x'] = $data[TextDB::TEXT_FRAME_WIDTH] / 2;
            $offsetCenter['y'] = $data[TextDB::TEXT_FRAME_HEIGHT] / 2;
            $align['sin'] = sin(deg2rad($data[TextDB::TEXT_ALIGN]));
            $align['cos'] = cos(deg2rad($data[TextDB::TEXT_ALIGN]));

            doImage($PathObject);
            $PathObject = sortPath1($PathObject);
            $PathObject = smoothPaths($PathObject);
            $PathObject = shortPaths($PathObject);
            $PathObject = sortPath1($PathObject, false);
            $PathObject = translatePathObject($PathObject);
            $PathObject = fixElements($PathObject);
            $PathObjectOut -> combinePathObject($PathObject);
        }
    }
    if($ImgData !=null){
        foreach($ImgData as $i => $data){
            $PathObject = new PathObject();
            $img = getSingleProjectImage($UserID, $ProjectID, $data[ImageDB::IMAGE_ID], PATH_Project::IMG_VIEW);
            $xScale = $data[ImageDB::IMAGE_WIDTH] / $img -> getImageWidth();
            $yScale = $data[ImageDB::IMAGE_HEIGHT] / $img -> getImageHeight();

            $img -> setImageFormat('png');
            $xAdd = $data[ImageDB::IMAGE_POS_X];
            $yAdd = $data[ImageDB::IMAGE_POS_Y];
            $PathObjectOut = creatorHelper::img2Path($img, false);
            $img -> destroy();
            $offsetCenter['x'] = $data[ImageDB::IMAGE_WIDTH] / 2;
            $offsetCenter['y'] = $data[ImageDB::IMAGE_HEIGHT] / 2;
            $align['sin'] = sin(deg2rad($data[ImageDB::IMAGE_ALIGN]));
            $align['cos'] = cos(deg2rad($data[ImageDB::IMAGE_ALIGN]));

            // doImage($PathObject);
            // $PathObject = sortPath1($PathObject);
            // $PathObject = smoothPaths($PathObject);
            // $PathObject = shortPaths($PathObject);
            // $PathObject = sortPath1($PathObject, false);
            $PathObjectOut = translatePathObject($PathObjectOut);
            // $PathObject = fixElements($PathObject);
            // $PathObjectOut -> combinePathObject($PathObject);
        }
    }
    // $PathObjectOut = sortPath1($PathObjectOut, false);
    // $PathObjectOut = array2Path();
    StartCreateSVG($ProjectData, $PathObjectOut);
}

