<?php
    require_once 'converterCore.php';
    require_once 'image/imageCore.php';
    require_once 'image/imageWriteSingleData.php'; 

    $SendData   = $_POST["data"];
    $ImgObj     = $SendData["ImageObj"];

    $UserID     = $SendData["UserID"];
    $ProjectID  = $SendData["ProjectID"];
    $imgID      = $SendData["SingleID"];
    $EPType     = $SendData["EPtype"];
       
    $imgView_nT         = imagecreatefromstring(base64_decode(getSingleProjectImage($UserID, $ProjectID, $imgID, PATH_Project::IMG_VIEW_NT))); 
    $imgView_color      = imagecreatefromstring(base64_decode(getSingleProjectImage($UserID, $ProjectID, $imgID, PATH_Project::IMG_VIEW_COLOR))); 

    $height = 0;
    $width  = 0;
    $ypos   = 2000;
    $xpos   = 2000;
    $black = imagecolorsforindex($imgView_nT, imagecolorallocate($imgView_nT, 0,0,0))["red"];
    $white = imagecolorsforindex($imgView_nT, imagecolorallocate($imgView_nT, 255,255,255))["red"];
    for ($y = 0; $y < imagesy($imgView_nT); $y++) {
        for ($x = 0; $x < imagesx($imgView_nT); $x++) {
            $rgb = getValueforPixel($imgView_nT, $x, $y);
            if(intval($rgb) == intval($black)){
                if($xpos >= $x){
                    $xpos = $x;
                }
                if($ypos >= $y){
                    $ypos = $y;
                }
                if($height <= $y){
                    $height = $y;
                }
                if($width <= $x){
                    $width = $x;
                }
            }
        }
    } 

    $xMin = 0;
    $yMin = 0;
    $xMax = 0;
    $yMax = 0;

    if($xpos  < imagesx($imgView_nT) - $width){
        $xMin = $xpos;
        $xMax = imagesx($imgView_nT) - $xpos * 2;
    } else {
        $xMin = imagesx($imgView_nT) - $width;
        $xMax = $width - $xMin;
    }
    if($ypos < imagesy($imgView_nT) - $height){
        $yMin = $ypos;
        $yMax = imagesy($imgView_nT) - $ypos * 2;
    } else {
        $yMin = imagesy($imgView_nT) - $height;
        $yMax = $height - $yMin;
    }
    $extraDist = 10;
    if($xMin - $extraDist < 0 || $xMax + $extraDist * 2 > $width || $yMax + $extraDist * 2 > $height || $yMin - $extraDist < 0){
        $extraDist = 1;
    }
    $imgView_nT= imagecrop($imgView_nT, ['x' => ($xMin - $extraDist), 'y' => ($yMin - $extraDist), 'width' => ($xMax + $extraDist * 2), 'height' => ($yMax + $extraDist * 2)]);
    
    //imagecolortransparent($imgView, imagecolorexact($imgView, 255, 255, 255));
    
    $imgView_color = ChangeColor($imgView_nT, $EPType, true);
    $index = imagecolorexact($imgView_color, 255, 255, 255);
    imagecolortransparent($imgView_color, $index);

    $request = array();
    $request["ImageView_nT"]    = editImage($imgView_nT, $imgID, PATH_Project::IMG_VIEW_NT, $UserID, $ProjectID);
    $request["ImageViewColor"]  = editImage($imgView_color, $imgID, PATH_Project::IMG_VIEW_COLOR, $UserID, $ProjectID);

    $index = imagecolorexact($imgView_nT, 255, 255, 255);
    imagecolortransparent($imgView_nT, $index);
    $request["ImageView"]       = editImage($imgView_nT, $imgID, PATH_Project::IMG_VIEW, $UserID, $ProjectID);
    $request["X"]               = $xMin - $extraDist;
    $request["Y"]               = $yMin - $extraDist;
    $request["width"]           = $xMax + $extraDist * 2;
    $request["height"]          = $yMax + $extraDist * 2;

    imagedestroy($imgView_nT);
    imagedestroy($imgView_color);

    print_r(json_encode($request));
?>