<?php
    
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    function deleteImage($Path){
        if(file_exists($Path)){
            unlink($Path);
        }
    }

    // function QueryImage($img){
    //     $black = imagecolorsforindex($img, imagecolorallocate($img, 0, 0, 0))["red"];
    //     $img_out = imagecreatetruecolor(imagesx($img), imagesy($img));
    //     $img_out2 = imagecreatetruecolor(imagesx($img), imagesy($img));
    //     //$img_array = array(array(), array());
    //     $array = array(array(), array());
    //     $count = 0;
    //     for ($x = 5; $x < imagesx($img) - 5; $x++){
    //         for ($y = 5; $y < imagesy($img) - 5; $y++) { 
    //             imagesetpixel($img_out, $x, $y, imagecolorallocate($img_out, 255, 255, 255));
    //             $array[$x][$y] = 0;
    //             $counter = 0;
    //             if (getValueforPixel($img, $x, $y) == $black) {
    //                 for ($x1 = -5; $x1 <= 5; $x1++) {
    //                     for ($y1 = -5; $y1 <= 5; $y1++) {
    //                         if (getValueforPixel($img, $x + $x1, $y + $y1) == $black) {
    //                             $counter ++;
    //                             // if(!isset($array[$x + $x1][$y + $y1])){
    //                             //     $array[$x + $x1][$y + $y1] = 0;
    //                             // }
    //                             if ($x1 == -5 || $x1 == 5 || $y1 == -5 || $y1 == 5) {
    //                                 $array[$x][$y] += 0.03125;
    //                             } elseif (($x1 == -4 && $y1 <= 4 && $y1 >= -4) || ($y1 == -4 && $x1 <= 4 && $x1 >= -4) || ($x1 == 4 && $y1 <= 4 && $y1 >= -4) || ($y1 == 4 && $x1 <= 4 && $x1 >= -4)) {
    //                                 $array[$x][$y] += 0.0625;
    //                             } elseif (($x1 == -3 && $y1 <= 3 && $y1 >= -3) || ($y1 == -3 && $x1 <= 3 && $x1 >= -3) || ($x1 == 3 && $y1 <= 3 && $y1 >= -3) || ($y1 == 3 && $x1 <= 3 && $x1 >= -3)) {
    //                                 $array[$x][$y] += 0.125;
    //                             } elseif (($x1 == -2 && $y1 <= 2 && $y1 >= -2) || ($y1 == -2 && $x1 <= 2 && $x1 >= -2) || ($x1 == 2 && $y1 <= 2 && $y1 >= -2) || ($y1 == 2 && $x1 <= 2 && $x1 >= -2)) {
    //                                 $array[$x][$y] += 0.25;
    //                             } elseif (($x1 == -1 && $y1 <= 1 && $y1 >= -1) || ($y1 == -1 && $x1 <= 1 && $x1 >= -1) || ($x1 == 1 && $y1 <= 1 && $y1 >= -1) || ($y1 == 1 && $x1 <= 1 && $x1 >= -1)) {
    //                                 $array[$x][$y] += 0.5;
    //                             } else {
    //                                 $array[$x][$y] += 1;
    //                             }
    //                         } else {
    //                             //$array[$x1][$y1+2] = 0;
    //                         }
    //                     }
    //                 }
    //                 if ($counter > 0) {
    //                     $array[$x][$y] /= $counter;
    //                 }
    //             }
    //         }
    //     }
    //     $array2 = array(array(), array());
    //     for ($x = 13; $x < imagesx($img) - 13; $x++){
    //         for ($y = 13; $y < imagesy($img) - 13; $y++) { 
    //             if ($array[$x][$y] != 0) {
    //                 $a = 0;
    //                 $flag = false;
    //                 $flag2 = false;
    //                 $x2 = 0;
    //                 $y2 = 0;
    //                 $save = 0;
    //                 $v = 0;
    //                 for ($x1 = -1; $x1 <= 1; $x1++) {
    //                     for ($y1 = -1; $y1 <= 1; $y1++) {
    //                         $v += $array[$x + $x1][$y + $y1];
    //                         // if ($array[$x + $x1][$y + $y1] > $array[$x][$y]) {
    //                         //     $flag = false;
                                
    //                         //     //imagesetpixel($img_out, $x + $x1, $y + $y1, imagecolorallocate($img_out, 0, 0, 0));
    //                         //     break 2;
    //                         // }
    //                         //$a += $array[$x + $x1][$y + $y1];
    //                     }
    //                 }
    //                 if($v / 8 <= $array[$x][$y]){
    //                     $flag = true;
    //                 }
    //                 if ($flag) {
    //                     imagesetpixel($img_out, $x, $y, imagecolorallocate($img_out, 0, 0, 0));
    //                 //imagesetpixel($img_out2, $x, $y, imagecolorallocate($img_out2, 0, 0, 0));
    //                 } else {
    //                     imagesetpixel($img_out, $x, $y, imagecolorallocate($img_out, 255, 100, 255));
    //                     //imagesetpixel($img_out2, $x, $y, imagecolorallocate($img_out2, 255, 255, 255));
    //                 }
    //             }
    //         }       
    //     }
    //     // for ($x = 4; $x < imagesx($img) - 4; $x++){
    //     //     for ($y = 4; $y < imagesy($img) - 4; $y++) { 
    //     //         $a = 0;
    //     //         $flag = true;
    //     //         $flag2 = false;
    //     //         $counter = 0;
    //     //         for ($x1 = -1; $x1 <= 1; $x1++) {
    //     //             for ($y1 = -1; $y1 <= 1; $y1++) {
    //     //                 if($x1 != 0 && $y1 != 0 && getValueforPixel($img_out, $x + $x1, $y + $y1) == $black){
    //     //                     $counter++;
    //     //                 }
    //     //                 //$a += $array[$x + $x1][$y + $y1];
    //     //             }
    //     //         }
    //     //         if($counter >= 3){
    //     //             imagesetpixel($img_out2, $x, $y, imagecolorallocate($img_out2, 0, 0, 0));
    //     //         }
    //     //     }       
    //     // }
    //     return $img_out;
    // }
    
    // function ChangeColor($img, $EPType, $ClearFlag){
    //     $img_out = imagecreatetruecolor(imagesx($img),imagesy($img));
    //     imagefill($img_out, 0, 0, imagecolorallocatealpha($img_out, 255, 255, 255, 127));
    //     $black = imagecolorsforindex($img, imagecolorallocate($img, 0, 0, 0))["red"];
    //     $white = imagecolorsforindex($img, imagecolorallocate($img, 255, 255, 255))["red"];
    //     if($EPType == "Gold"){
    //         $black_out = imagecolorallocate($img_out, 255, 215, 0);
    //     } else {
    //         $black_out = imagecolorallocate($img_out, 239, 248, 255);
    //     }
    //     if($ClearFlag){
    //         $white_out = imagecolorallocatealpha($img_out, 255, 255, 255, 127);
    //     } else {
    //         $white_out = imagecolorallocatealpha($img_out, 255, 255, 255, 0);
    //     }
    //     $counter = 0;
    //     for($y = 0; $y < imagesy($img); $y++){
    //         for($x = 0; $x < imagesx($img); $x++){
    //             if(/*$x+1<imagesx($img)&&*/getValueforPixel($img, $x, $y) == $black){
    //                 imagesetpixel($img_out, $x, $y, $black_out);
    //                 $counter++;
    //             } else {
    //                 imagesetpixel($img_out, $x, $y, $white_out);
    //             }
    //         }
    //     }
    //     if($counter > (imagesy($img_out) * imagesx($img_out)) / 2){
    //         imagefilter($img_out, IMG_FILTER_NEGATE);
    //     }
    //     return $img_out;
    // }

    // function resize_image($img_or_blob, $w, $h, $crop=FALSE) {
    //     $src        = "";
    //     $width      = 0;
    //     $height     = 0;
    //     error_log(gettype($img_or_blob));
    //     if(gettype($img_or_blob) == 'string'){
    //         $src = imagecreatefromstring(base64_decode($img_or_blob));
    //         $width = imagesx($src);
    //         $height = imagesy($src);
    //     } else {
    //         list($width, $height) = getimagesize($img_or_blob);
    //         $src = imagecreatefrompng($img_or_blob);
    //     }
    //     $dst = imagecreatetruecolor($w, $h);
    //     imagefill($dst, 0,0, imagecolorallocatealpha($dst, 255, 255, 255, 0));
    //     $index = imagecolorallocate($dst, 0, 0, 0); 
    //     //imagecolortransparent($dst, $index);
    //     imagecopyresampled($dst, $src, 0, 0, 0, 0, $w, $h, $width, $height);
    //     imagesavealpha($dst, true);
    //     imagealphablending($dst, true);

    //     //$dst = erode($dst, 3);
    //     //$dst = dilate_fx($dst, 2);
    //     // $dst = erode($dst, 2);
    //     // // $dst = erode($dst, 2);
    //     // imagesavealpha($dst, true);
    //     $index = imagecolorallocate($dst, 0, 0, 0); 
    //     imagecolortransparent($dst, $index);
        
    //     return $dst;
    // }

    function array2string($data){
        $log_a = "";
        foreach ($data as $key => $value) {
            if ($key != 'data') {
                if (is_array($value)) {
                    $log_a .= "[".$key."] => (". array2string($value). ") \n";
                } else {
                    $log_a .= "[".$key."] => ".$value."\n";
                }
            }
        }
        return $log_a;
    }

    // function Fillelements($img){
    //     $img_out = imagecreate(imagesx($img),imagesy($img));
    //     imagefill($img_out, 0, 0, imagecolorallocate($img_out, 255, 255, 255));
    //     $black = imagecolorsforindex($img, imagecolorallocate($img, 0, 0, 0))["red"];
    //     $white = imagecolorsforindex($img, imagecolorallocate($img, 255, 255, 255))["red"];
    //     $black_out = imagecolorallocate($img_out, 0, 0, 0);
    //     $white_out = imagecolorallocate($img_out, 255, 255, 255);
    //     for($y = 0; $y < imagesy($img); $y++){
    //         for($x = 0; $x < imagesx($img); $x++){
    //             if(getValueforPixel($img, $x, $y) == $black){
    //                 imagesetpixel($img_out, $x, $y, $black_out);

    //                 imagesetpixel($img_out, $x + 1, $y, $black_out);
    //             } 
    //         }
    //     }
    //     return $img_out;
    // }

    // function BlackWhite($img){
    //     $img_out = imagecreate(imagesx($img),imagesy($img));
    //     imagefill($img_out, 0,0, imagecolorallocate($img_out, 255, 255, 255));
    //     $black = imagecolorsforindex($img, imagecolorallocate($img, 0, 0, 0))["red"];
    //     $white = imagecolorsforindex($img, imagecolorallocate($img, 255, 255, 255))["red"];
    //     $black_out = imagecolorallocate($img_out, 0, 0, 0);
    //     $white_out = imagecolorallocate($img_out, 255, 255, 255);
    //     $counter = 0;
    //     for($y = 0; $y < imagesy($img); $y++){
    //         for($x = 0; $x < imagesx($img); $x++){
    //             if(/*$x+1<imagesx($img)&&*/getValueforPixel($img, $x, $y) == $black){
    //                 imagesetpixel($img_out, $x, $y, $black_out);
    //                 $counter++;
    //             } else {
    //                 imagesetpixel($img_out, $x, $y, $white_out);
    //             }
    //         }
    //     }
    //     if($counter > (imagesy($img_out)*imagesx($img_out))/2){
    //         imagefilter($img_out, IMG_FILTER_NEGATE);
    //     }
    //     return $img_out;
    // }

    // function dilate_fx($img, $value){
    //     $img_out = imagecreate(imagesx($img),imagesy($img));
    //     imagefill($img_out, 0,0, imagecolorallocate($img_out, 255, 255, 255));
    //     $black = imagecolorsforindex($img, imagecolorallocate($img, 0, 0, 0))["red"];
    //     $white = imagecolorsforindex($img, imagecolorallocate($img, 255, 255, 255))["red"];
    //     $black_out = imagecolorallocate($img_out, 0, 0, 0);
    //     $white_out = imagecolorallocate($img_out, 255, 255, 255);
    //     for($y = 0; $y < imagesy($img); $y++){
    //         for($x = 0; $x < imagesx($img); $x++){
    //             if(getValueforPixel($img, $x, $y) == $white){
    //                 if($x - 1 >= 0 && $y + 1 < imagesy($img) && $x + 1 < imagesx($img) && $y - 1 >= 0){
    //                     $counter = 0;
    //                     if(getValueforPixel($img, $x - 1, $y) == $black){
    //                         $counter++;
    //                     }
    //                     if(getValueforPixel($img, $x, $y + 1) == $black){
    //                         $counter++;         
    //                     }
    //                     if(getValueforPixel($img, $x + 1, $y) == $black){
    //                         $counter++;
    //                     }
    //                     if(getValueforPixel($img, $x , $y - 1) == $black){
    //                         $counter++;
    //                     }
    //                     //imagesetpixel($img_out, $x, $y, $black_out);
    //                     if ($counter == $value) {
    //                         imagesetpixel($img_out, $x, $y, $black_out);
    //                         // imagesetpixel($img_out, $x+1, $y, $black_out);
    //                         // imagesetpixel($img_out, $x-1, $y, $black_out);
    //                         // imagesetpixel($img_out, $x, $y+1, $black_out);
    //                         // imagesetpixel($img_out, $x, $y-1, $black_out);
    //                     }
    //                 }
    //             } else {
    //                 imagesetpixel($img_out, $x, $y, $black_out);
    //             }
    //         }
    //     }
    //     return $img_out;
    // }

    // function dilate($imgIn, $value){
    //     imagepng($imgIn, "buffer.png");
    //     $img = imagecreatefrompng("buffer.png");
    //     $img_out = imagecreate(imagesx($img),imagesy($img));
    //     imagefill($img_out, 0,0, imagecolorallocate($img_out, 255, 255, 255));
    //     $black = imagecolorsforindex($img, imagecolorexact($img, 0, 0, 0))["red"];
    //     error_log($black);
    //     $white = imagecolorsforindex($img, imagecolorexact($img, 255, 255, 255))["red"];
    //     error_log($white);
    //     $black_out = imagecolorallocate($img_out, 0, 0, 0);
    //     $white_out = imagecolorallocate($img_out, 255, 255, 255);
    //     for($y = 0; $y < imagesy($img); $y++){
    //         for($x = 0; $x < imagesx($img); $x++){
    //             if(getValueforPixel($img, $x, $y) == $black){
    //                 imagesetpixel($img_out, $x, $y, $black_out);
    //                 imagesetpixel($img_out, $x + 1, $y, $black_out);
    //                 imagesetpixel($img_out, $x - 1, $y, $black_out);
    //                 imagesetpixel($img_out, $x, $y + 1, $black_out);
    //                 imagesetpixel($img_out, $x, $y - 1, $black_out);
    //             } 
    //         }
    //     }
    //     return $img_out;
    // }
    // function fix($imgIn){
    //     // imagepng($imgIn, "buffer.png");
    //     // $img = imagecreatefrompng("buffer.png");
    //     // unlink("buffer.png");
    //     $img = imagecreatetruecolor(imagesx($imgIn),imagesy($imgIn));
    //     imagefill($img, 0,0, imagecolorallocate($img, 255, 255, 255));
    //     imagecopy($img, $imgIn, 0, 0, 0, 0, imagesx($imgIn), imagesy($imgIn));
    //     $black = imagecolorsforindex($img, imagecolorallocate($img, 0, 0, 0))["red"];
    //     $white = imagecolorsforindex($img, imagecolorallocate($img, 255, 255, 255))["red"];
    //     for($y = 0; $y < imagesy($img); $y++){
    //         for($x = 0; $x < imagesx($img); $x++){
    //             $counter = 0;
    //             if(getValueforPixel($img, $x, $y) == $white){
    //                 if(getValueforPixel($img, $x + 1, $y) == $black){
    //                     if(!isAround($fArray, $x + 1, $y)){
    //                         $counter++;
    //                     }
    //                 }
    //                 if(getValueforPixel($img, $x - 1, $y) == $black){
    //                     if(!isAround($fArray, $x - 1, $y)){
    //                         $counter++;
    //                     }
    //                 }
    //                 if(getValueforPixel($img, $x, $y + 1) == $black){
    //                     if (!isAround($fArray, $x, $y + 1)) {
    //                         $counter++;
    //                     }
    //                 }
    //                 if(getValueforPixel($img, $x, $y - 1) == $black){
    //                     if(!isAround($fArray, $x, $y - 1)){
    //                         $counter++;
    //                     }
    //                 }
    //                 if($counter == 2){
    //                     imagesetpixel($img, $x, $y, $black);
    //                 }
    //             } else {
    //                 imagesetpixel($img, $x, $y, $black);
    //             }
    //         }
    //     }
    //     return $img;
    // }

    // function checkXY($img, $x, $y){
    //     if($x >= 0 && $x < imagesx($img)){
    //         if($y >= 0 && $y < imagesy($img)){
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    

    // function erode_fx($img){
    //     $img_out = imagecreate(imagesx($img),imagesy($img));
    //     imagefill($img_out, 0,0, imagecolorallocate($img_out, 255, 255, 255));
    //     $black = imagecolorsforindex($img, imagecolorallocate($img, 0, 0, 0))["red"];
    //     $white = imagecolorsforindex($img, imagecolorallocate($img, 255, 255, 255))["red"];
    //     $black_out = imagecolorallocate($img_out, 0, 0, 0);
    //     $white_out = imagecolorallocate($img_out, 255, 255, 255);
    //     for($y = 0; $y < imagesy($img); $y++){
    //         for($x = 0; $x < imagesx($img); $x++){
    //             $counter = 0;
    //             if(getValueforPixel($img, $x, $y) == $black){
    //                 imagesetpixel($img_out, $x, $y, $black_out);
    //                 if(getValueforPixel($img, $x + 1, $y) == $black){
    //                     $counter++;
    //                 }
    //                 if(getValueforPixel($img, $x - 1, $y) == $black){
    //                     $counter++;
    //                 }
    //                 if(getValueforPixel($img, $x, $y + 1) == $black){
    //                     $counter++;
    //                 }
    //                 if(getValueforPixel($img, $x, $y - 1) == $black){
    //                     $counter++;
    //                 }
    //                 if(getValueforPixel($img, $x + 1, $y + 1) == $black){
    //                     $counter++;
    //                 }
    //                 if(getValueforPixel($img, $x - 1, $y - 1) == $black){
    //                     $counter++;
    //                 }
    //                 if(getValueforPixel($img, $x - 1, $y + 1) == $black){
    //                     $counter++;
    //                 }
    //                 if(getValueforPixel($img, $x + 1, $y - 1) == $black){
    //                     $counter++;
    //                 }
    //                 if($counter == 3){
    //                     if(CheckWhiteEdges($img, $x, $y)){
    //                         imagesetpixel($img_out, $x, $y, $white_out);
    //                     } else {
    //                         imagesetpixel($img_out, $x, $y, $black_out);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return $img_out;
    // }


    // function erode($img, $value, $easyModeFlag){
    //     $img_out = imagecreate(imagesx($img),imagesy($img));
    //     imagefill($img_out, 0,0, imagecolorallocate($img_out, 255, 255, 255));
    //     $black = imagecolorsforindex($img, imagecolorallocate($img, 0, 0, 0))["red"];
    //     $white = imagecolorsforindex($img, imagecolorallocate($img, 255, 255, 255))["red"];
    //     $black_out = imagecolorallocate($img_out, 0, 0, 0);
    //     $white_out = imagecolorallocate($img_out, 255, 255, 255);
    //     for($y = 0; $y < imagesy($img); $y++){
    //         for($x = 0; $x < imagesx($img); $x++){
    //             $counter = 0;
    //             if(getValueforPixel($img, $x, $y) == $black){
    //                 if(getValueforPixel($img, $x + 1, $y) == $black){
    //                     $counter++;
    //                 }
    //                 if(getValueforPixel($img, $x - 1, $y) == $black){
    //                     $counter++;
    //                 }
    //                 if(getValueforPixel($img, $x, $y + 1) == $black){
    //                     $counter++;
    //                 }
    //                 if(getValueforPixel($img, $x, $y - 1) == $black){
    //                     $counter++;
    //                 }
    //                 if(!$easyModeFlag){
    //                     if(getValueforPixel($img, $x + 1, $y + 1) == $black){
    //                         $counter++;
    //                     }
    //                     if(getValueforPixel($img, $x - 1, $y - 1) == $black){
    //                         $counter++;
    //                     }
    //                     if(getValueforPixel($img, $x - 1, $y + 1) == $black){
    //                         $counter++;
    //                     }
    //                     if(getValueforPixel($img, $x + 1, $y - 1) == $black){
    //                         $counter++;
    //                     }
    //                 }
                
    //                 if($counter >= $value){
    //                     imagesetpixel($img_out, $x, $y, $black_out);
    //                 }
    //             }
    //         }
    //     }
    //     return $img_out;
    // }

    // function getValueforPixel($img, $x, $y){
    //     if (checkXY($img, $x, $y)) {
    //         return imagecolorsforindex($img, imagecolorat($img, $x, $y))["red"];
    //     } else {
    //         return false;
    //     }
    // }

    // function imageSaturation(&$image, $saturationPercentage) {
    //     $width = imagesx($image);
    //     $height = imagesy($image);
    
    //     for($x = 0; $x < $width; $x++) {
    //         for($y = 0; $y < $height; $y++) {
    //             $rgb = imagecolorat($image, $x, $y);
    //             $r = ($rgb >> 16) & 0xFF;
    //             $g = ($rgb >> 8) & 0xFF;
    //             $b = $rgb & 0xFF;            
    //             $alpha = ($rgb & 0x7F000000) >> 24;
    //             list($h, $s, $l) = rgb2hsl($r, $g, $b);         
    //             $s = $s * (100 + $saturationPercentage ) /100;
    //             $l = $l*0.75;
    //             if($s > 1) $s = 1;
    //             list($r, $g, $b) = hsl2rgb($h, $s, $l);            
    //             imagesetpixel($image, $x, $y, imagecolorallocatealpha($image, $r, $g, $b, $alpha));
    //         }
    //     }
    // }

    function rgb2hsl($r, $g, $b) {
        $var_R = ($r / 255);
        $var_G = ($g / 255);
        $var_B = ($b / 255);
     
        $var_Min = min($var_R, $var_G, $var_B);
        $var_Max = max($var_R, $var_G, $var_B);
        $del_Max = $var_Max - $var_Min;
     
        $v = $var_Max;
     
        if ($del_Max == 0) {
           $h = 0;
           $s = 0;
        } else {
           $s = $del_Max / $var_Max;
     
           $del_R = ( ( ( $var_Max - $var_R ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;
           $del_G = ( ( ( $var_Max - $var_G ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;
           $del_B = ( ( ( $var_Max - $var_B ) / 6 ) + ( $del_Max / 2 ) ) / $del_Max;
     
           if      ($var_R == $var_Max) $h = $del_B - $del_G;
           else if ($var_G == $var_Max) $h = ( 1 / 3 ) + $del_R - $del_B;
           else if ($var_B == $var_Max) $h = ( 2 / 3 ) + $del_G - $del_R;
     
           if ($h < 0) $h++;
           if ($h > 1) $h--;
        }
     
        return array($h, $s, $v);
     }
     
     function hsl2rgb($h, $s, $v) {
         if($s == 0) {
             $r = $g = $B = $v * 255;
         } else {
             $var_H = $h * 6;
             $var_i = floor( $var_H );
             $var_1 = $v * ( 1 - $s );
             $var_2 = $v * ( 1 - $s * ( $var_H - $var_i ) );
             $var_3 = $v * ( 1 - $s * (1 - ( $var_H - $var_i ) ) );
     
             if       ($var_i == 0) { $var_R = $v     ; $var_G = $var_3  ; $var_B = $var_1 ; }
             else if  ($var_i == 1) { $var_R = $var_2 ; $var_G = $v      ; $var_B = $var_1 ; }
             else if  ($var_i == 2) { $var_R = $var_1 ; $var_G = $v      ; $var_B = $var_3 ; }
             else if  ($var_i == 3) { $var_R = $var_1 ; $var_G = $var_2  ; $var_B = $v     ; }
             else if  ($var_i == 4) { $var_R = $var_3 ; $var_G = $var_1  ; $var_B = $v     ; }
             else                   { $var_R = $v     ; $var_G = $var_1  ; $var_B = $var_2 ; }
     
             $r = $var_R * 255;
             $g = $var_G * 255;
             $B = $var_B * 255;
         }    
         return array($r, $g, $B);
     }

    //  function imagehue(&$image, $angle) {
    //     if($angle % 360 == 0) return;
    //     $width = imagesx($image);
    //     $height = imagesy($image);
    
    //     for($x = 0; $x < $width; $x++) {
    //         for($y = 0; $y < $height; $y++) {
    //             $rgb = imagecolorat($image, $x, $y);
    //             $r = ($rgb >> 16) & 0xFF;
    //             $g = ($rgb >> 8) & 0xFF;
    //             $b = $rgb & 0xFF;            
    //             $alpha = ($rgb & 0x7F000000) >> 24;
    //             list($h, $s, $l) = rgb2hsl($r, $g, $b);
    //             $h += $angle / 360;
    //             if($h > 1) $h--;
    //             list($r, $g, $b) = hsl2rgb($h, $s, $l);            
    //             imagesetpixel($image, $x, $y, imagecolorallocatealpha($image, $r, $g, $b, $alpha));
    //         }
    //     }
    // }

    function hex2hsl($RGB, $ladj = 0) {
        //have we got an RGB array or a string of hex RGB values (assume it is valid!)
            if (!is_array($RGB)) {
                $hexstr = ltrim($RGB, '#');
                if (strlen($hexstr) == 3) {
                    $hexstr = $hexstr[0] . $hexstr[0] . $hexstr[1] . $hexstr[1] . $hexstr[2] . $hexstr[2];
                }
                $R = hexdec($hexstr[0] . $hexstr[1]);
                $G = hexdec($hexstr[2] . $hexstr[3]);
                $B = hexdec($hexstr[4] . $hexstr[5]);
                $RGB = array($R,$G,$B);
            }
        // scale the RGB values to 0 to 1 (percentages)
            $r = $RGB[0]/255;
            $g = $RGB[1]/255;
            $b = $RGB[2]/255;
            $max = max( $r, $g, $b );
            $min = min( $r, $g, $b );
        // lightness calculation. 0 to 1 value, scale to 0 to 100% at end
            $l = ( $max + $min ) / 2;
                
        // saturation calculation. Also 0 to 1, scale to percent at end.
            $d = $max - $min;
            if( $d == 0 ){
        // achromatic (grey) so hue and saturation both zero
                $h = $s = 0; 
            } else {
                $s = $d / ( 1 - abs( (2 * $l) - 1 ) );
        // hue (if not grey) This is being calculated directly in degrees (0 to 360)
                switch( $max ){
                    case $r:
                        $h = 60 * fmod( ( ( $g - $b ) / $d ), 6 );
                        if ($b > $g) { //will have given a negative value for $h
                            $h += 360;
                        }
                        break;
                    case $g:
                        $h = 60 * ( ( $b - $r ) / $d + 2 );
                        break;
                    case $b:
                        $h = 60 * ( ( $r - $g ) / $d + 4 );
                        break;
                } //end switch
            } //end else 
        // make any lightness adjustment required
            if ($ladj > 0) {
                $l += (1 - $l) * $ladj/100;
            } elseif ($ladj < 0) {
                $l += $l * $ladj/100;
            }
        //put the values in an array and scale the saturation and lightness to be percentages
            $hsl = array( round( $h), round( $s*100), round( $l*100) );
        //we could return that, but lets build a CSS compatible string and return that instead
            $hslstr = 'hsl('.$hsl[0].','.$hsl[1].'%,'.$hsl[2].'%)';
            return $hslstr;
        }


    // function getColorForPixel(GdImage $img, int $x, int $y) : stdClass {
    //     $rgb = imagecolorat($img, $x, $y);
    //     $r = ($rgb >> 16) & 0xFF;
    //     $g = ($rgb >> 8) & 0xFF;
    //     $b = $rgb & 0xFF;
    //     $res = new stdClass();
    //     $res -> r = $r;
    //     $res -> g = $g;
    //     $res -> b = $b;
    //     return $res;
    // }
    function RGB2Hex(stdClass $rgb){
        $R = $rgb -> r;
        $G = $rgb -> g;
        $B = $rgb -> b;
        $R = dechex($R);
        if (strlen($R)<2)
        $R = '0'.$R;
    
        $G = dechex($G);
        if (strlen($G)<2)
        $G = '0'.$G;
    
        $B = dechex($B);
        if (strlen($B)<2)
        $B = '0'.$B;
    
        return '#' . $R . $G . $B;
    }
?>