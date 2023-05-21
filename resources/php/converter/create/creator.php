<?php    
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once 'creatorHelper.php';

    // function create_START_TEST(){
    //     global $rootpath;
    //     $img = new Imagick();
    //     $img -> readImage($rootpath.'/fd/data/images/converterTest/6.png');
    //     $img -> setImageFormat("png");

    //     $img_out = new Imagick();
    //     $img_out -> newImage($img -> getImageWidth(), $img -> getImageHeight(), new ImagickPixel('white'));
    //     $img_out -> setImageFormat("png");
    //     $m = [['x' => 3, 'y' => 3], ['x' => 3, 'y' => 3]];
    //     // print_r($m[1]['x']);
    //     $imgMatrix = c1::getImageMatrix($img, [['x' => 1, 'y' => 1], ['x' => 5, 'y' => 5]]);

    //     // $last = [];
    //     // $pA = array(array(), array());
    //     // $last['x'] = -1;
    //     // $last['y'] = -1;
    //     // for($y = -1; $y <= 1; $y++){
    //     //     for($x = -1; $x <= 1; $x++){
    //     //         if(inSearch($last, $x, $y)){
    //     //             $pA[$x + 1][$y + 1] = 1;
    //     //         } else {
    //     //             $pA[$x + 1][$y + 1] = 2;
    //     //         }
    //     //     }
    //     // }
    //     // outputArray($pA, "output.txt");
    //     $mac = new matrix(['x' => 5, 'y' => 5]);
    //     analyseMatrix_5x5($mac);
    //     // print_r($imgMatrix -> count());
    //     $b = 0;
    //     while($b < 1){
    //         for($y = 0; $y < $img -> getImageHeight(); $y++){
    //             for($x = 0; $x < $img -> getImageWidth(); $x++){
    //                 if(c1::isPixelBlack($img, $x, $y) && $imgMatrix -> get()[$x][$y] > 0){
    //                     c1::goPath($imgMatrix, $img_out, $x, $y);
    //                     $b++;
    //                     continue 3;
    //                 }
    //             }
    //         }
    //         break;
    //     }
    //     // outputArray($imgMatrix -> get(), "output.txt");
    //     // print_r(array_multisum($imgMatrix -> get()));
    //     file_put_contents("testI.png", $img_out);
    //     $img_out -> destroy();
    //     outputArray($imgMatrix -> get(), "output.txt");
    // }

    // function analyseMatrix_5x5(matrix $matrixIn){
    //     $height = $matrixIn -> height;
    //     $width  = $matrixIn -> width;
    //     for($y = -$height; $y <= $height; $y++){
    //         for($x = -$width; $x <= $width; $x++){
    //             if((abs($y) == 0 && abs($x) == 1) || (abs($y) == 1 && abs($x) == 0)){
    //                 if($matrixIn -> get($x, $y) == 1){

    //                 }
    //             }
    //             if(abs($y) == 2 || abs($x) == 2){
    //                 $matrixIn -> set($x, $y, "n");
    //             } else {
    //                 $matrixIn -> set($x, $y, "d");
    //             }
    //         }
    //     }
    //     print_r($matrixIn -> get());
    //     outputArray($matrixIn -> get(), "output2.txt");
    // }

    // function array_getMaxCoords(array $array, array $last){
    //     // outputArray($array);
    //     $coords = [];
    //     $flag = 1;
    //     // do{
    //         $max = 0;
    //         foreach($array as $x_p => $array1){
    //             foreach($array1 as $y_p => $data){
    //                 $x = $x_p - 1;
    //                 $y = $y_p - 1;
    //                 if($flag == 1){
    //                     if($data != 0 && inSearch($last, $x, $y)){
    //                         // error_log(json_encode($last) . "    " . $x . " " . $y);
    //                         if($data > $max){
    //                             $max = $data;
    //                             $coords['x'] = $x;
    //                             $coords['y'] = $y;
    //                         } else if($data == $max){
    //                             // array_push($coords, ['x' => $x, 'y' => $y]);
    //                         }
    //                     }
    //                 } else {
    //                     // if($data != 0 && inSearch($last, $x, $y)){
    //                     //     // error_log(json_encode($last) . "    " . $x . " " . $y);
    //                     //     if(abs($data) > $max){
    //                     //         $max = $data;
    //                     //         $coords = [];
    //                     //         array_push($coords, ['x' => $x, 'y' => $y]);
    //                     //     } else if($data == $max){
    //                     //         // array_push($coords, ['x' => $x, 'y' => $y]);
    //                     //     }
    //                     // }
    //                 }
    //             }
    //         }
    //     //     $flag++;
    //     // } while(count($coords) == 0 && $flag <= 1);
    //     return $coords;
    // }
    // function inSearch(array $last, int $x, int $y){
    //     if(count($last) == 0){
    //         return true;
    //     }
    //     if($x == 0 && $y == 0){
    //         return false;
    //     }
    //     if($last['x'] == $x && $last['y'] == $y){
    //         return false;
    //     }
    //     if(abs($last['x']) == 1 && abs($last['y']) == 1){
    //         if($x == -($last['x']) && $y == (-$last['y'])){
    //             return true;
    //         }
    //         if($x == -($last['x']) && $y == 0){
    //             return true;
    //         }
    //         if($y == -($last['y']) && $x == 0){
    //             return true;
    //         }
    //     } else {
    //         if($x == -($last['x']) || $y == -($last['y'])){
    //             return true;
    //         }
    //     }




    //     // if(abs($last['x']) == 0 && ($y == -($last['y']) || $y == 0)){
    //     //     return true;
    //     // }
    //     // if(abs($last['y']) == 0 && ($x == -($last['x']) || $x == 0)){
    //     //     return true;
    //     // }
    //     // // error_log("OTHER");
    //     // // // error_log($x . "  " . $y . " | " . $last['x'] . "  " . $last['y']);

    //     // if(abs($last['x']) == 1 && abs($last['y']) == 1){
    //     //     if($x == -($last['x']) || $y == -($last['y'])){
    //     //         return true;
    //     //     }
    //     // }
    //     return false;
    // }


    // function outputArray($array, string $path){
    //     $fp = fopen($path, "w+");
    //     for($y = 0; $y < count($array[0]); $y++){
    //         for($x = 0; $x < count($array) ; $x++){  
    //             if($array[$x][$y] == 0){
    //                 fwrite($fp, str_pad("+0", 4, ' ', STR_PAD_RIGHT));
    //             } else {
    //                 fwrite($fp, str_pad($array[$x][$y], 4, ' ', STR_PAD_RIGHT));
    //             }
    //         }
    //         fwrite($fp, "\n");
    //     }
    //     fclose($fp);
    // }

    // class matrix {
    //     public $width;
    //     public $height;
    //     public function __construct(array $dimensions){
    //         $this -> dimensions = $dimensions;
    //         $this -> width = ($dimensions['x'] - 1) / 2;
    //         $this -> height = ($dimensions['y'] - 1) / 2;
    //         $this -> counter = 0;
    //     }
    //     public function add(int $x, int $y, $value){
    //         $this -> storage[intval($x + $this -> width)][intval($y + $this -> height)] = $value;
    //         $this -> counter += $value;
    //     }
    //     public function set(int $x, int $y, $value){
    //         $this -> storage[intval($x + $this -> width)][intval($y + $this -> height)] = $value;
    //     }
    //     public function get(int $x = null, int $y = null) : array{
    //         if($x == null && $y == null){
    //             return $this -> storage;
    //         }
    //         return $this -> storage[$x + $this -> width][$y + $this -> height];
    //     }
    //     public function count(){
    //         return $this -> counter;
    //     }
    // }
    // $co = 0;
    // class c2 {
    //     public static function setPixel(Imagick &$img, int $x, int $y, $color = null){
    //         global $co;
    //         $imageIterator = $img->getPixelRegionIterator($x, 0, 1, $y + 2);
    //         $imageIterator->setIteratorRow($y);
    //         $pixels = $imageIterator->getCurrentIteratorRow();
    //         foreach ($pixels as $pixel) {
    //             $co++;
    //             $pixel->setColor("rgba(" .( 20 + ($co) ) .  ", 0, 0, 0)");
    //             // if($co){
    //             //     $pixel->setColor("rgba(" .( 20 + (50) ) .  ", 0, 0, 0)");
    //             //     $co = false;
    //             // } else {
    //             //     $pixel->setColor("rgba(" .( 20 + (100) ) .  ", 0, 0, 0)");
    //             //     $co = true;
    //             // }
    //         }
    //         $imageIterator->syncIterator();
    //     }
    // }
    // $a = 0;
    // class c1 {
    //     public $img;
    //     public function __construct(Imagick $img){
    //         $this -> img = $img;
    //     } 
    //     public static  function goPath(matrix &$ImageMatrix, Imagick &$img_out, int $x, int $y){
    //         c2::setPixel($img_out, $x , $y);
    //         // $ImageMatrix -> add($x, $y, 0/*-abs($ImageMatrix -> get()[$x][$y])*/);
    //         $coords = [];
    //         $coords_last = [];
    //         do {
    //             $matrix = c1::getMatrix_ofMatrix($ImageMatrix, $x , $y , ['x' => 3, 'y' => 3]);
    //             $coords = array_getMaxCoords($matrix -> get(), $coords_last);
    //             if(count($coords_last) != null){
    //                 if(abs($coords_last['x']) == 1 && abs($coords_last['y']) == 1){
    //                     $e = -$coords_last['x'];
    //                     $f = $coords_last['y'];
    //                     $ImageMatrix -> add($x + ($e), $y + ($f), -abs(8));
    //                     $e = $coords_last['x'];
    //                     $f = -$coords_last['y'];
    //                     $ImageMatrix -> add($x + ($e), $y + ($f), -abs(8));
    //                 } else if(abs($coords_last['x']) == 1 && abs($coords_last['y']) == 0){
    //                     $e = $coords_last['x'];
    //                     $f = -1;
    //                     $ImageMatrix -> add($x + ($e), $y + ($f), -abs(8));
    //                     $e = $coords_last['x'];
    //                     $f = 1;
    //                     $ImageMatrix -> add($x + ($e), $y + ($f), -abs(8));
    //                 } else if(abs($coords_last['x']) == 0 && abs($coords_last['y']) == 1){
    //                     $e = 1;
    //                     $f = $coords_last['y'];
    //                     $ImageMatrix -> add($x + ($e), $y + ($f), -abs(8));
    //                     $e = -1;
    //                     $f = $coords_last['y'];
    //                     $ImageMatrix -> add($x + ($e), $y + ($f), -abs(8));
    //                 }
    //             }
    //             if(count($coords) > 0){
    //                 if(abs($coords['x']) == 1 && abs($coords['y']) == 1){
    //                     $ImageMatrix -> add($x, $y + $coords['y'], -3);
    //                     $ImageMatrix -> add($x + $coords['x'], $y, -3);
    //                 }

    //                 $ImageMatrix -> add($x, $y, -1);
    //                 c2::setPixel($img_out, $x , $y);
    //                 $x += $coords['x'];
    //                 $y += $coords['y'];
    //                 $ImageMatrix -> add($x, $y, -2);
    //                 $coords_last['x'] = -$coords['x'];
    //                 $coords_last['y'] = -$coords['y'];
    //             }
    //         } while(count($coords) > 0);
    //     }

    //     public static function getPixelColor(Imagick $img, int $x, int $y) : array|bool {
    //         if($x >= 0 && $y >= 0 && $x < $img -> getImageWidth() && $y < $img -> getImageHeight()){
    //             return $img -> getImagePixelColor($x, $y) -> getColor();
    //         }
    //         return false;
    //     }
    //     public static function getMatrix(Imagick $img, int $xIn, int $yIn, array $dimensions) : matrix{
    //         $width = ($dimensions[0]['x'] - 1) / 2;
    //         $height = ($dimensions[0]['y'] - 1) / 2;
    //         $matrix = new matrix($dimensions[0]);
    //         for($y = -$height; $y <= $height ; $y++){
    //             for($x = -$width; $x <= $width; $x++){
    //                 $matrix -> add($x, $y, self::countBlack_inMatrix($img, $xIn + $x, $yIn + $y, $dimensions[1]));
    //             }
    //         }
    //         //dX x dY Matrix : Feld = (Anzahl schwarz in 3x3);
    //         return $matrix;
    //     }
    //     public static function getImageMatrix(Imagick $img, array $dimensions) : matrix {
    //         $width = $img -> getImageWidth();
    //         $height = $img -> getImageHeight();
    //         $matrix = new matrix(['x' => 1, 'y' => 1]);
    //         for($y = 0; $y < $height; $y++){
    //             for($x = 0; $x < $width; $x++){
    //                 // if(self::isPixelBlack($img, $x, $y)){
    //                     $size = 0;
    //                     if(self::isPixelBlack($img, $x, $y)){
    //                         $size = round(self::getMatrix($img, $x , $y , $dimensions) -> count() /*/ ($dimensions[0]['x'] * $dimensions[0]['y'])*/, 5);
    //                     } else {
    //                         $size = 0;
    //                     }
    //                     $matrix -> add($x, $y, $size);
    //                 // } else {
    //                 //     $matrix -> add($x, $y, 0);
    //                 // }
    //             }
    //         }
    //         return $matrix;
    //     }
    //     public static function isPixelBlack(Imagick $img, int $x, int $y) : bool{
    //         $color = self::getPixelColor($img, $x, $y);
    //         if($color && $color['r'] == 0 && $color['g'] == 0 && $color['b'] == 0){
    //             return true;
    //         }
    //         return false;
    //     }
    //     public static function getMatrix_ofMatrix(matrix &$matrixIn, int $xIn, int $yIn, array $dimensions) : matrix{
    //         $width = ($dimensions['x'] - 1) / 2;
    //         $height = ($dimensions['y'] - 1) / 2;
    //         $matrix     = new matrix($dimensions);
    //         for($x = -$width; $x <= $width; $x++){
    //             for($y = -$height; $y <= $height; $y++){
    //                 if($xIn + $x >= 0 && $yIn + $y >= 0 && $xIn + $x < count($matrixIn -> get()) && $yIn + $y < count($matrixIn -> get()[0])){
    //                     $matrix -> add($x, $y, $matrixIn -> get()[$xIn + $x][$yIn + $y]);
    //                     // $matrixIn -> add($xIn + $x, $yIn + $y, -abs($matrixIn -> get()[$xIn + $x][$yIn + $y]));
    //                 }
    //             }
    //         }
    //         return $matrix;
    //     }
    //     public static function sumOfMatrix(array $matrix, array $dimensions) : int{
    //         return array_multisum($matrix);
    //     }
    //     private static function countBlack_inMatrix(Imagick $img, int $xIn, int $yIn, array $dimensions) : float {
    //         $width = ($dimensions['x'] - 1) / 2;
    //         $height = ($dimensions['y'] - 1) / 2;
    //         $counter = 0;
    //         for($x = -$width; $x <= $width; $x++){
    //             for($y = -$height; $y <= $height; $y++){
    //                 if(self::isPixelBlack($img, $xIn + $x, $yIn + $y)){
    //                     // $counter += 1 / (1 + abs($x)+ abs($y));
    //                     $counter++;
    //                 }
    //             }
    //         }
    //         // $counter /= ($dimensions['x'] * $dimensions['y']);
    //         return $counter;
    //     }
    // }

    // function create_START($ProjectData, $ImgData = null, $TextData = null){
        
    //     error_log("a   " . json_encode($TextData));
    //     error_log("b   " . json_encode($ImgData));
    //     error_log("c   " . json_encode($ProjectData));

    //     $LighterHeight  = ProjectDB::LIGHTER_HEIGHT * 2 * 10;
    //     $LighterWidth   = ProjectDB::LIGHTER_WIDTH * 2 * 10;
        
    //     $SquareWidth    = $ProjectData[ProjectDB::SQUARE]["width"];
    //     $SquareHeight   = $ProjectData[ProjectDB::SQUARE]["height"]; 
        
    //     $UserID         = Sessions::get(Sessions::USER_ID);
    //     $ProjectID      = Sessions::get(Sessions::PROJECT_ID);
    //     $EPType         = $ProjectData[ProjectDB::EPTYPE]; 
    //     $ScaleFactor    = $LighterWidth / $SquareWidth;

    //     $img_out = imagecreatetruecolor($LighterWidth * 2, $LighterHeight * 2);
    //     imagefill($img_out, 0, 0, imagecolorallocatealpha($img_out, 255, 255, 255, 127));
    //     imagealphablending($img_out, true);
    //     imagesavealpha($img_out, true);

    //     if($ImgData != null){
    //         foreach($ImgData as $data){
    //             $img = new Imagick();
    //             $img -> readImage(PATH_Project::get(PATH_Userdata::IMG_VIEW, $ProjectID, $UserID, $data[ImageDB::IMAGE_ID]));

    //             $color = new \ImagickPixel("rgb(0, 0, 0)");

    //             $img -> colorizeImage($color, new \ImagickPixel("rgba(255, 255, 255, 0)"));
    //             $img -> resizeImage($data[ImageDB::IMAGE_WIDTH] * 2 * $ScaleFactor, $data[ImageDB::IMAGE_HEIGHT] * 2 * $ScaleFactor, imagick::FILTER_UNDEFINED, 0);
    //             $img -> setImageMatte(1);
    //             $img -> rotateImage(new ImagickPixel("#00000000"), $data[ImageDB::IMAGE_ALIGN]);
    //             $img -> setImageFormat("png");
    //             $blob = $img -> getImageBlob();
    //             $img -> destroy();

    //             $img = imagecreatefromstring($blob);
    //             imagecopyresampled(
    //                 $img_out,
    //                 $img,
    //                 Intval($data[ImageDB::IMAGE_POS_X]) * $ScaleFactor * 2 - imagesx($img) / 2,
    //                 Intval($data[ImageDB::IMAGE_POS_Y]) * $ScaleFactor * 2 - imagesy($img) / 2,
    //                 0,
    //                 0,
    //                 imagesx($img),
    //                 imagesy($img),
    //                 imagesx($img),
    //                 imagesy($img)
    //             );
    //             imagepng($img_out, "test.png");
    //             $imgArray = creatorHelper::img2array($img_out);
    //             creatorHelper::checkImgArray($imgArray);
    //             // $fp = fopen("testArray.txt", "w+");
    //             // fwrite($fp, $imgArray);
    //             // fclose($fp);

    //             imagedestroy($img);
    //         }
    //     }
    //     if($TextData != null){
    //         foreach($TextData as $data){
    //             $img = new Imagick();
    //             $img -> readImageBlob(base64_to_png($data[TextDB::TEXT_IMG]));
    //             error_log(json_encode($data));
    //             $img -> scaleImage($data[TextDB::TEXT_FRAME_WIDTH] * 2 / $ScaleFactor, $data[TextDB::TEXT_FRAME_HEIGHT] * 2 * $ScaleFactor);
    //             $img -> edgeImage(1);
    //             if($EPType == 'GOLD'){
    //                 $color = new \ImagickPixel("rgb(255, 215, 0)");
    //             } else {
    //                 $color = new \ImagickPixel("rgb(239, 248, 255)");
    //             }
    //             $img -> colorizeImage($color, new \ImagickPixel("rgba(255, 255, 255, 0)"));
    //             $img -> setImageMatte(1);
    //             $img -> rotateImage(new ImagickPixel("#00000000"), $data[TextDB::TEXT_ALIGN]);
    //             $img -> setImageFormat("png");
    //             $blob = $img -> getImageBlob();
    //             $img -> destroy();

    //             $img = imagecreatefromstring($blob);
    //             imagepng($img, "text.png");
    //             imagecopyresampled(
    //                 $img_out,
    //                 $img,
    //                 Intval($data[TextDB::TEXT_POS_X]) * $ScaleFactor * 2 - imagesx($img) / 2,
    //                 Intval($data[TextDB::TEXT_POS_Y]) * $ScaleFactor * 2 - imagesy($img) / 2,
    //                 0,
    //                 0,
    //                 imagesx($img),
    //                 imagesy($img),
    //                 imagesx($img),
    //                 imagesy($img)
    //             );
    //             imagedestroy($img);       
    //         }
    //     }
    //     imagefilter($img_out, IMG_FILTER_CONTRAST, -1000000);

    //     $img_bg = imagecreatetruecolor($LighterWidth * 2, $LighterHeight * 2);
    //     imagefill($img_bg, 0, 0, imagecolorallocatealpha($img_bg, 50, 50, 50, 0));

    //     imagealphablending($img_bg, true);
    //     imagesavealpha($img_bg, true);

    //     imagecopy($img_bg, $img_out, 0, 0, 0, 0, imagesx($img_out), imagesy($img_out));
    //     //imagepng($img_bg, "test5.png");
    //     ob_start(); 
    //         imagepng($img_bg, "test1.png");
    //         $imgBlob = base64_encode(ob_get_contents()); 
    //     ob_end_clean(); 
    //     Project::editImages($UserID, $ProjectID, $imgBlob);

    //     imagedestroy($img_bg);
    //     imagedestroy($img_out);
    // }