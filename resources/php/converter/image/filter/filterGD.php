
<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath . '/fd/resources/php/converter/converterCore.php';
    require_once $rootpath . '/fd/resources/php/converter/image/image.php';

    class FilterGD {
        public static function createImage(GdImage $img, Array $filterData, bool $grayscale = false) {
            
            $sharpness      = $filterData[ImageDB::FILTER_SHARPNESS] + 1;
            $antialiasing   = $filterData[ImageDB::FILTER_ANTIALIASING]; // Stärke
            $contrast       = $filterData[ImageDB::FILTER_CONTRAST];
            $lineWidth      = $filterData[ImageDB::FILTER_LINE_WIDTH];
            $d              = ($filterData[ImageDB::FILTER_D] / 100); 
            $edges          = $filterData[ImageDB::FILTER_EDGES]; 
            if($grayscale){
                $edges = false;
                // $img -> brightnessContrastImage(0, $contrast, Imagick::CHANNEL_ALL);
                // $img -> setImageColorspace(Imagick::COLORSPACE_GRAY);
            }
            if($edges){
            }
            $image = imagecreatetruecolor(imagesx($img), imagesy($img));
            imagesavealpha($image, false);
            // $transparent = imagecolorallocatealpha($image, 0, 0, 0, 127);
            // imagefill($image, imagesx($img), imagesy($img), $transparent);
            imagecopyresampled($image, $img, 0, 0, 0, 0, imagesx($img), imagesy($img), imagesx($img), imagesy($img));

            // // Transparent Background
            imagealphablending($image, true);
            // // imagefill($image, 0, 0, $transparency);
            imagesavealpha($image, false);

            // // Drawing over
            // $black = imagecolorallocate($image, 0, 0, 0);

            // imagefilter($image, IMG_FILTER_BRIGHTNESS,100);
            // // // imagecolortransparent($img, $index);
            // // imagefilter($img, IMG_FILTER_SMOOTH,0);
            // imagefilter($image, IMG_FILTER_EDGEDETECT);
            // // imagefilter($image, IMG_FILTER_GRAYSCALE);
            // imagefilter($image, IMG_FILTER_CONTRAST, 100);
            // imagefilter($image, IMG_FILTER_NEGATE);

            // imagefilter($image, IMG_FILTER_CONTRAST,-100000);
            // imagesavealpha($image, true);
            // // $transparency = imagecolorallocatealpha($image, 0, 0, 0, 127);
            // // imagefilter($img, IMG_FILTER_CONTRAST,-100000);
            // /*$img_edit_out = dilate($img_edit_out); 
            // $img_edit_out = erode($img_edit_out,3);*/    
            // $index = imagecolorexact($image, 255, 255, 255);
            // imagefilter($image, IMG_FILTER_EDGEDETECT);
            // imagefilter($image, IMG_FILTER_GRAYSCALE);
            // imagefilter($image, IMG_FILTER_CONTRAST,-100000);
            // imagecolortransparent($image, $index);
            $image = self::ImageToBlackAndWhite($image);
            // $index = imagecolorexact($image, 255, 255, 255);
            // $image = self::transparent([8, 8, 8], $image);
            // imagesavealpha($image, true);
            // imagecolortransparent($image, $transparent);
            // imagefilter($img, IMG_FILTER_NEGATE);
            // imagepng($image, "test.png");
            imagepng($image, "text.png");
            return $image;
        }
        private static function transparent(Array $color, GdImage $img) : GdImage {
            $colorf = imagecolorexact($img, $color[0], $color[1], $color[2]);
            imagecolortransparent($img, $colorf);
            return $img;
        }
        
        // public static function getImageFromURL(string $url) : GdImage {
        //     $img = imagecreatefromstring(file_get_contents($url));
        //     return $img;
        // }
        
        public static function resize_image(GdImage &$img, $w, $h) {
            $width  = imagesx($img);
            $height = imagesy($img); 
            $dst = imagecreatetruecolor(intval($w), intval($h));
            imagecopyresampled($dst, $img, 0, 0, 0, 0, intval($w), intval($h), $width, $height);
        }

        public static function GDImageToBase64(GdImage $img){
            ob_start(); 
                imagepng($img);
                $imgBlob = base64_encode(ob_get_contents()); 
            ob_end_clean(); 
            return $imgBlob;
        }
    
        public static function GDImageFromURL($path) : GdImage {
            return imagecreatefromstring(file_get_contents($path));
            // $base64 = self::URLToBase64($path);
            
            // // $img = imagecreatefrompng($path);


            // ob_start(); 
            //     // imagepng($img);
            //     base64_decode($base64);
            //     $imgGD = imagecreatefrompng(ob_get_contents()); 
            // ob_end_clean(); 
            // return $imgGD;
        }
        public static function URLToBase64($path){
            $img = imagecreatefromstring(file_get_contents($path));
            ob_start(); 
                imagepng($img);
                $imgBlob = base64_encode(ob_get_contents()); 
            ob_end_clean(); 
            return $imgBlob;
        }
        public static function ImageToBlackAndWhite($im) {
    
            for ($x = imagesx($im); $x--;) {
                for ($y = imagesy($im); $y--;) {
                    $rgb = imagecolorat($im, $x, $y);
                    $r = ($rgb >> 16) & 0xFF;
                    $g = ($rgb >> 8 ) & 0xFF;
                    $b = $rgb & 0xFF;
                    $gray = ($r + $g + $b) / 3;
                    if ($gray < 0xFF) {
        
                        imagesetpixel($im, $x, $y, 0xFFFFFF);
                    }else
                        imagesetpixel($im, $x, $y, 0x000000);
                }
            }
        
            imagefilter($im, IMG_FILTER_NEGATE);
            return $im;
        }

    }
