<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath . '/fd/resources/php/converter/converterCore.php';
    require_once $rootpath . '/fd/resources/php/converter/image/image.php';


    class Filter {
        public $imgScale = null;
        public $response = null;
        public function __construct(Imagick &$imgScale){
            $this -> imgScale = $imgScale;
        }
        public function createObject(Array $filterData) : void {
            $this -> response = new FilterHelper(ImagickHelper::Filter($this -> imgScale, $filterData, true));
        }
        public static function createImage(Imagick &$imgScale, Array $filterData) {
            return ImagickHelper::Filter($imgScale, $filterData, false);
        }
        public function get() : Imagick|FilterHelper {
            return $this -> imgScale;
        }
    }

    class FilterHelper{
        const COLOR_WHITE   = [255, 255, 255];
        const COLOR_BLACK   = [0, 0, 0];
        var $img = null;
        public $fArray;
        public function __construct(fixedArray $fArray){
            $this -> fArray = $fArray;
        }
        public static function GD2Blob(GdImage $img) : string {
            ob_start(); 
                imagepng($img);
                $imgBlob = ob_get_contents(); 
            ob_end_clean(); 
            return $imgBlob;
        }
        public function dilate(){
            $fArray_out = new fixedArray($this -> fArray -> x, $this -> fArray -> y);
            $fArray_out -> array = clone $this -> fArray -> array;
            $black = 1;
            $white = 0;
            for($y = 0; $y < $this -> fArray -> y; $y++){
                for($x = 0; $x < $this -> fArray -> x; $x++){
                    if($this -> fArray -> get($x, $y) == $black){
                        $fArray_out -> set($x, $y, $black);
                        $fArray_out -> set($x + 1, $y, $black);
                        $fArray_out -> set($x - 1, $y, $black);
                        $fArray_out -> set($x, $y + 1, $black);
                        $fArray_out -> set($x, $y - 1, $black);
                    } 
                }
            }
            $this -> fArray -> array = $fArray_out -> array;
        }
        public function erode(int $value, bool $easyModeFlag){
            $fArray_out = new fixedArray($this -> fArray -> x, $this -> fArray -> y);
            $fArray_out -> array = clone $this -> fArray -> array;
            $black = 1;
            $white = 0;
            for($y = 0; $y < $this -> fArray -> y; $y++){
                for($x = 0; $x < $this -> fArray -> x; $x++){
                    $counter = 0;
                    if($this -> fArray -> get($x, $y) == $black){
                        if($this -> fArray -> get($x + 1, $y) == $black){
                            $counter++;
                        }
                        if($this -> fArray -> get($x - 1, $y) == $black){
                            $counter++;
                        }
                        if($this -> fArray -> get($x, $y + 1) == $black){
                            $counter++;
                        }
                        if($this -> fArray -> get($x, $y - 1) == $black){
                            $counter++;
                        }
                        if(!$easyModeFlag){
                            if($this -> fArray -> get($x + 1, $y + 1) == $black){
                                $counter++;
                            }
                            if($this -> fArray -> get($x - 1, $y - 1) == $black){
                                $counter++;
                            }
                            if($this -> fArray -> get($x - 1, $y + 1) == $black){
                                $counter++;
                            }
                            if($this -> fArray -> get($x + 1, $y - 1) == $black){
                                $counter++;
                            }
                        }
                        if($counter >= $value){
                            $fArray_out -> set($x, $y, $black);
                        }
                    }
                }
            }
            $this -> fArray -> array = $fArray_out -> array;
        }
        public function erode_fx(){
            $fArray_out = new fixedArray($this -> fArray -> x, $this -> fArray -> y);
            $fArray_out -> array = clone $this -> fArray -> array;
            $black = 1;
            $white = 0;
            for($y = 0; $y < $this -> fArray -> y; $y++){
                for($x = 0; $x < $this -> fArray -> x; $x++){
                    $counter = 0;
                    if($this -> fArray -> get($x, $y) == $black){
                        // $fArray_out -> set($x, $y, 1);
                        if($this -> fArray -> get($x + 1, $y) == $black){
                            $counter++;
                        }
                        if($this -> fArray -> get($x - 1, $y) == $black){
                            $counter++;
                        }
                        if($this -> fArray -> get($x, $y + 1) == $black){
                            $counter++;
                        }
                        if($this -> fArray -> get($x, $y - 1) == $black){
                            $counter++;
                        }
                        if($this -> fArray -> get($x + 1, $y + 1) == $black){
                            $counter++;
                        }
                        if($this -> fArray -> get($x - 1, $y - 1) == $black){
                            $counter++;
                        }
                        if($this -> fArray -> get($x - 1, $y + 1) == $black){
                            $counter++;
                        }
                        if($this -> fArray -> get($x + 1, $y - 1) == $black){
                            $counter++;
                        }
                        if($counter == 3){
                            if(CheckWhiteEdges($this -> fArray, $x, $y)){
                                $fArray_out -> set($x, $y, $white);
                            } else {
                                $fArray_out -> set($x, $y, $black);
                            }
                        }
                    }
                }
            }
            $this -> fArray -> array = $fArray_out -> array;
        } 
        public function fix(){
            $fArray_out = new fixedArray($this -> fArray -> x, $this -> fArray -> y);
            $fArray_out -> array = clone $this -> fArray -> array;
            $black = 1;
            $white = 0;
            for($y = 0; $y < $this -> fArray -> y; $y++){
                for($x = 0; $x < $this -> fArray -> x; $x++){
                    $counter = 0;
                    if($this -> fArray -> get($x, $y) == $white){
                        if($this -> fArray -> get($x + 1, $y) == $black){
                            if(!isAround($this -> fArray, $x + 1, $y)){
                                $counter++;
                            }
                        }
                        if($this -> fArray -> get($x - 1, $y) == $black){
                            if(!isAround($this -> fArray, $x - 1, $y)){
                                $counter++;
                            }
                        }
                        if($this -> fArray -> get($x, $y + 1) == $black){
                            if (!isAround($this -> fArray, $x, $y + 1)) {
                                $counter++;
                            }
                        }
                        if($this -> fArray -> get($x, $y - 1) == $black){
                            if(!isAround($this -> fArray, $x, $y - 1)){
                                $counter++;
                            }
                        }
                        if($counter == 2){
                            $this -> fArray -> set($x, $y, 1);
                        }
                    } else {
                        $this -> fArray -> set($x, $y, 1);
                    }
                }
            }
            // $this -> fArray -> array = $fArray_out -> array;
        }
        public function get(bool $transparent = false) : Imagick {
            $img = ImagickHelper::fArray2img($this -> fArray, $transparent);
            $img -> setImageFormat("png");
            return $img;
        }
        public function ImagickFilter($func) : Imagick{
            $img = new Imagick();
            $img -> newImage($this -> fArray -> x, $this -> fArray -> y, new ImagickPixel('white'));
            foreach($this -> fArray -> array as $key => $element){
                if($element == 1){
                    $array = $this -> fArray -> getCoordsForIndex($key);
                    ImagickHelper::setPixel($img, $array['x'], $array['y'], FilterHelper::COLOR_BLACK);
                }
            }
            $func($img);
            $this -> fArray -> fromArray($img -> exportImagePixels(0, 0, $img -> getImageWidth(), $img -> getImageHeight(), 'I', Imagick::PIXEL_CHAR), 1, true);
            $img -> setImageFormat("png");
            return $img;
        }
        private function transparent(Array $color, GdImage $img) : GdImage {
            $this -> color = $color;
            $color = imagecolorexact($img, $color[0], $color[1], $color[2]);
            imagecolortransparent($img, $color);
            return $img;
        }
    }

    class ImagickHelper {
        private static function filterImage(Imagick &$img, $filterData) : void {
            $sharpness      = $filterData[ImageDB::FILTER_SHARPNESS] + 1;
            $antialiasing   = $filterData[ImageDB::FILTER_ANTIALIASING]; // Stärke
            $contrast       = $filterData[ImageDB::FILTER_CONTRAST];
            $d              = ($filterData[ImageDB::FILTER_D] / 100); 
            $edges          = $filterData[ImageDB::FILTER_EDGES]; 

            if($edges){
                $img -> cannyEdgeImage(20 - ($sharpness * 2), $antialiasing, $d + 0.1, $d + 1.01 - ($contrast / 10));
            }
            $img -> setImageFormat("png");
        }
        public static function Filter(Imagick &$img, $filterData, bool $getFixedArray = true) {
            self::filterImage($img, $filterData);
            if(!$getFixedArray){
                ImagickHelper::setColorTransparent($img, 'white');
                return $img;
            } else {
                $fArray = new fixedArray($img -> getImageWidth(), $img -> getImageHeight());
                $fArray -> fromArray($img -> exportImagePixels(0, 0, $img -> getImageWidth(), $img -> getImageHeight(), 'I', Imagick::PIXEL_CHAR), 1, true);
                return $fArray;
            }
        }
        public static function getImageFromURL(string $url) : Imagick {
            $img = new Imagick();
            $img -> readImageBlob(file_get_contents($url));
            return $img;
        }
        public static function saveImage(Imagick $img, string $path) : void{
            file_put_contents($path, $img);
            $img -> writeImage($path);
        }
        public static function fArray2img(fixedArray &$fArray, bool $transparent = false) : Imagick{
            $img = new Imagick();
            $img -> newImage($fArray -> x, $fArray -> y, new ImagickPixel('white'));
            foreach($fArray -> array as $key => $element){
                if($element == 1){
                    $array = $fArray -> getCoordsForIndex($key);
                    ImagickHelper::setPixel($img, $array['x'], $array['y'], FilterHelper::COLOR_BLACK);
                }
            }
            if($transparent){
                $img -> transparentPaintImage(new ImagickPixel('white'), 0, 0, false);
            }
            return $img;
        }
        public static function setColorTransparent(Imagick &$img, string $color = "white") : void {
            $img -> transparentPaintImage(new ImagickPixel($color), 0, 0, true);
        }
        public static function setPixel(Imagick &$img, int $x, int $y, array $color) : void{
            $imageIterator = $img->getPixelRegionIterator($x, 0, 1, $y + 2);
            $imageIterator->setIteratorRow($y);
            $pixels = $imageIterator->getCurrentIteratorRow();
            foreach ($pixels as $pixel) {
                $pixel->setColor("rgba(" . $color[0] .  ", " . $color[1] . ", " . $color[2] . ", 0)");
            }
            $imageIterator->syncIterator();
        }
        public static function getPixelColor(Imagick $img, int $x, int $y) : array|bool {
            if($x >= 0 && $y >= 0 && $x < $img -> getImageWidth() && $y < $img -> getImageHeight()){
                return $img -> getImagePixelColor($x, $y) -> getColor(true);
            }
            return false;
        }
    }

    class Filter_colorConverter{
        public static function hsv2rgb($hue,$sat,$val) {
            $rgb = array(0,0,0);
            //calc rgb for 100% SV, go +1 for BR-range
            for($i=0;$i<4;$i++) {
              if (abs($hue - $i*120)<120) {
                $distance = max(60,abs($hue - $i*120));
                $rgb[$i % 3] = 1 - (($distance-60) / 60);
              }
            }
            //desaturate by increasing lower levels
            $max = max($rgb);
            $factor = 255 * ($val/100);
            for($i=0;$i<3;$i++) {
              //use distance between 0 and max (1) and multiply with value
              $rgb[$i] = round(($rgb[$i] + ($max - $rgb[$i]) * (1 - $sat/100)) * $factor);
            }
            return $rgb;
          }
    
        public static function rgb2hsv($R, $G, $B)    // RGB values:    0-255, 0-255, 0-255
        {                                // HSV values:    0-360, 0-100, 0-100
            // Convert the RGB byte-values to percentages
            $R = ($R / 255);
            $G = ($G / 255);
            $B = ($B / 255);
        
            // Calculate a few basic values, the maximum value of R,G,B, the
            //   minimum value, and the difference of the two (chroma).
            $maxRGB = max($R, $G, $B);
            $minRGB = min($R, $G, $B);
            $chroma = $maxRGB - $minRGB;
        
            // Value (also called Brightness) is the easiest component to calculate,
            //   and is simply the highest value among the R,G,B components.
            // We multiply by 100 to turn the decimal into a readable percent value.
            $computedV = 100 * $maxRGB;
        
            // Special case if hueless (equal parts RGB make black, white, or grays)
            // Note that Hue is technically undefined when chroma is zero, as
            //   attempting to calculate it would cause division by zero (see
            //   below), so most applications simply substitute a Hue of zero.
            // Saturation will always be zero in this case, see below for details.
            if ($chroma == 0)
                return array(0, 0, $computedV);
        
            // Saturation is also simple to compute, and is simply the chroma
            //   over the Value (or Brightness)
            // Again, multiplied by 100 to get a percentage.
            $computedS = 100 * ($chroma / $maxRGB);
        
            // Calculate Hue component
            // Hue is calculated on the "chromacity plane", which is represented
            //   as a 2D hexagon, divided into six 60-degree sectors. We calculate
            //   the bisecting angle as a value 0 <= x < 6, that represents which
            //   portion of which sector the line falls on.
            if ($R == $minRGB)
                $h = 3 - (($G - $B) / $chroma);
            elseif ($B == $minRGB)
                $h = 1 - (($R - $G) / $chroma);
            else // $G == $minRGB
                $h = 5 - (($B - $R) / $chroma);
        
            // After we have the sector position, we multiply it by the size of
            //   each sector's arc (60 degrees) to obtain the angle in degrees.
            $computedH = 60 * $h;
        
            return array($computedH, $computedS, $computedV);
        }
    }

    //$img-> readImageBlob($imageBlob);
//$img->segmentImage(imagick::COLORSPACE_RGB, 10, 10);
//$img-> blurImage(10, 1);
// for($i = 0; $i < $antialiasing; $i++){
//     // $img -> despeckleImage();
//     $img -> enhanceImage();
// }
// // $img-> blurImage(1,2);
// $img -> brightnessContrastImage(0, $contrast);
// // $img->adaptiveSharpenImage(10, 10);
// // $img->sharpenImage(20, 100);
// // $img -> unsharpMaskImage($sharpness, 20, 5, 0);
// // $img -> unsharpMaskImage($sharpness, 20, 10, 0);
// // $img -> unsharpMaskImage(10, 5, 20, 0);
// if($grayscaleFlag){
//     $img -> modulateImage(100, 0, 0);
// }
// $img->edgeImage(1);
// $img -> brightnessContrastImage(0 , 100);
// $img -> setImageFormat("png");
// file_put_contents("test.png", $img);
// $img -> writeImage("test.png");
// $img -> destroy();
// $blob = $img -> getImageBlob();
// $img -> setImageFormat("png");
// $matrix = [[-1,-2,-1],[-1,9,-1],[-1,-1,-1]];
// $kernel = \ImagickKernel::fromMatrix($matrix);
// $img->convolveImage($kernel);
//$img->charcoalImage(0,1);

    // function FilterImage2($imgScale, $contrast, $antialiasing, $sharpness, $EPType = null){
    //     $response = array();
    //     $img = imagecreatefromstring(filter_helper($imgScale, $contrast, $antialiasing, $sharpness));  
    
    //     $img = fix($img);
    //     $imgObj = new FilterHelper($img);
    //     $imgObj -> erode(2, true);
    //     $img = $imgObj -> get();
    //     error_log("Filter");
    //     // $img = erode($img, 2, true);
    //     $img = erode_fx($img);
    //     $index = imagecolorexact($img, 255, 255, 255);
    //     imagefilter($img, IMG_FILTER_GRAYSCALE);
    //     imagefilter($img, IMG_FILTER_CONTRAST, -100000);  
    //     $img = f2($img);
    
    //     // $img = dilate($img, 4);
    
    //     $response[ImageDB::IMAGE_VIEW_NT] = imgToBlob($img);//editImage($img, $imgID, "Image_View_nT", $UserID, $ProjectID);
    //     imagecolortransparent($img, $index);
    
    //     $response[ImageDB::IMAGE_VIEW] = imgToBlob($img);//editImage($img, $imgID, "Image_View", $UserID, $ProjectID);
        
    //     // if(isset($EPType)){
    //     //     imagefilter($img, IMG_FILTER_NEGATE);
    //     //     $img = ChangeColor($img, $EPType, true);
    //     //     $index = imagecolorexact($img, 255, 255, 255);
    //     //     imagecolortransparent($img, $index);

    //     //     $response["ImageViewColor"] = imgToBlob($img);//editImage($img, $imgID, "Image_View_color", $UserID, $ProjectID);
    //     // }
    //     imagedestroy($img);
    //     return $response;
    // }

    // function f2($img){
    //     $XSize = imagesx($img);
    //     $YSize = imagesy($img);
    //     $color_black    = imagecolorsforindex($img, imagecolorallocate($img, 0, 0, 0))["red"];

    //     $img_out = imagecreate($XSize, $YSize);
    //     imagefill($img_out, 0,0, imagecolorallocate($img_out, 255, 255, 255));
    //     $color_out      = imagecolorallocate($img_out, 0, 0, 124);

    //     for($x = 0; $x < $XSize; $x++){
    //         for($y = 0; $y < $YSize; $y++){
    //             // error_log(getValueforPixel($img, $x, $y));
    //             // error_log("L " . $color_black);
    //             if(getValueforPixel($img, $x, $y) != $color_black){
    //                 imagesetpixel($img_out, $x, $y, $color_out);
    //             }
    //         }
    //     }
    //     imagepng($img, "test2.png");
    //     imagepng($img_out, "test.png");
    //     return $img_out;
    // }


    //https://stackoverflow.com/questions/4620574/creating-vector-graphics-with-php
    //php image to vector

    // function filter_helper($ImgIn, $contrast, $antialiasing, $sharpness){
    //     $grayscaleFlag  = true;
    //     $sharpness      = $sharpness;
    //     $antialiasing   += 3;

    //     $img = new Imagick();
    //     $img -> readImageBlob(base64_decode($ImgIn));

    //     //$img-> readImageBlob($imageBlob);
    //     //$img->segmentImage(imagick::COLORSPACE_RGB, 10, 10);
    //     //$img-> blurImage(10, 1);
    //     for($i = 0; $i < $antialiasing; $i++){
    //         $img -> despeckleImage();
    //         $img -> enhanceImage();
    //     }

    //     // $img-> blurImage(1,2);
    //     $img -> brightnessContrastImage(0, $contrast);
    //     //$img->adaptiveSharpenImage(50,500);
    //     // $img->sharpenImage(20, 100);
    //     $img -> unsharpMaskImage($sharpness, 20, 5, 0);
    //     if($grayscaleFlag){
    //         $img -> modulateImage(100, 0, 0);
    //     }
        
    //     $img->edgeImage(1);
    //     // $matrix = [[-1,-2,-1],[-1,9,-1],[-1,-1,-1]];
    //     // $kernel = \ImagickKernel::fromMatrix($matrix);
    //     // $img->convolveImage($kernel);
    //     //$img->charcoalImage(0,1);
    //     $img -> setImageType(Imagick::IMGTYPE_GRAYSCALE);
    //     $img -> brightnessContrastImage(0 , 100);
    //     $img -> negateImage(false);
    //     $img -> setImageFormat("png");
    //     $blob = $img -> getImageBlob();
    //     $img -> destroy();
    //     return $blob;
    // }

    // function produceImage($img_in){
    //     $img_out = imagecreatetruecolor(imagesx($img_in), imagesy($img_in));
    //     $red    = array();
    //     $green  = array();
    //     $blue   = array();
    //     for($x = 0; $x < imagesx($img_in); $x++){
    //         for($y = 0; $y < imagesy($img_in); $y++){
    //             $i = 0;
    //             for($x1 = -2; $x1 <= 2; $x1++){
    //                 for($y1 = -2; $y1 <= 2; $y1++){
    //                     if($x + $x1 < imagesx($img_in) && $x + $x1 >= 0 && $y + $y1 < imagesy($img_in) && $y + $y1 >= 0){
    //                         $color = imagecolorat($img_in, $x + $x1, $y + $y1);
    //                         $red[$i]    = ($color >> 16) & 255;
    //                         $green[$i]  = ($color >> 8) & 255;
    //                         $blue[$i]   = $color & 255;
    //                         $i++;
    //                     }
    //                 }
    //             }
    //             sort($red);
    //             sort($green);
    //             sort($blue);
    //             if(isset($red[12]) && isset($green[12]) && isset($blue[12])){
    //                 imagesetpixel($img_out, $x, $y, imagecolorallocate($img_out, $red[12], $green[12], $blue[12]));
    //             }
    //         }
    //     }
    //     ob_start(); 
    //         imagepng($img_out);
    //         $image_data = ob_get_contents (); 
    //     ob_end_clean(); 

    //     return $image_data;
    // }



    // function reduceColor($img_in){
    //     $img_out = imagecreatetruecolor(imagesx($img_in), imagesy($img_in));

    //     for($x = 0; $x < imagesx($img_in); $x++){
    //         for($y = 0; $y < imagesy($img_in); $y++){
    //             $blue   = 0;
    //             $red    = 0;
    //             $green  = 0;
    //             for($x1 = -1; $x1 <= 1; $x1++){
    //                 for($y1 = -1; $y1 <= 1; $y1++){
    //                     if($y + $y1 >= 0 & $x + $x1 >= 0 && $y + $y1 < imagesy($img_in) & $x + $x1 < imagesx($img_in)){
    //                         $rgb    = imagecolorat($img_in, $x + $x1, $y + $y1);
    //                         $red    += ($rgb >> 16) & 255;
    //                         $green  += ($rgb >> 8) & 255;
    //                         $blue   += $rgb & 255;
    //                     }
    //                 }
    //             }
    //                             //$full = ($blue + $green + $red) / 3;
    //             $red    = roundToAny(($red / 8), 128, 255);
    //             $blue   = roundToAny(($blue / 8), 128, 255);
    //             $green  = roundToAny(($green / 8), 128, 255);

    //             $hsl = rgb2hsl($red, $green, $blue);

    //             $br = roundToAny($hsl[2]*100, 5, 100)/100;

    //             $rgb = hsl2rgb(roundToAny($hsl[0]*100, 5, 100)/100, roundToAny($hsl[1]*100, 5, 100)/100, $br);

    //             imagesetpixel($img_in, $x, $y, imagecolorallocate($img_in, $rgb[0], $rgb[1], $rgb[2]));
    //         }
    //     }
    //     $img_out = $img_in;
    //     return $img_out;
    // }

?>