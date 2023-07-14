<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/SVG/createSVG.php';
    // require_once $rootpath.'/fd/resources/php/converter/image/imageCore.php';
    require_once $rootpath.'/fd/resources/php/converter/create/creatorHelper.php';
    require_once $rootpath.'/fd/resources/php/converter/converterConfig.php';

    $fArray;
    $xAdd;
    $yAdd;
    $xScale;
    $yScale;
    $x_C;
    $y_C;
    $align = [];
    $offsetCenter = [];
function start($ProjectData, $UserID, $ImgData = null, $TextData = null){
    global $fArray;
    global $yAdd;
    global $xAdd;
    global $xScale;
    global $yScale;
    global $x_C;
    global $y_C;
    global $align;
    global $offsetCenter;
    $cfg = ConverterConfig::get();
    
    $ProjectID = $ProjectData[ProjectDB::PROJECT_ID];
    
    $LastIndex = array();
    $LastIndex['xM'] = -1;
    $lastIndex['yM'] = -1;
    $PathObjectOut = new PathObject();
    if($TextData != null){
        foreach($TextData as $i => $data){
            $PathObject = new PathObject();
            $img = Text::getTextImg($data[TextDB::TEXT_ID], $ProjectID, $UserID);
            $img -> brightnessContrastImage(0, 100);
            $img -> edgeImage(1);
            $img -> setImageFormat('png');
            file_put_contents("testOut.png",$img);
            $img ->writeImage("testOut.png");
            $xScale = $data[TextDB::TEXT_FRAME_WIDTH] / $img -> getImageWidth();
            $yScale = $data[TextDB::TEXT_FRAME_HEIGHT] / $img -> getImageHeight();

            $xAdd = $data[TextDB::TEXT_POS_X];
            $yAdd = $data[TextDB::TEXT_POS_Y];

            $fArray = creatorHelper::img2fArray($img, true);
            $img -> destroy();
            creatorHelper::checkImgArray($fArray);
            $y_C = 0;
            $x_C = 0;
            $offsetCenter['x'] = $data[TextDB::TEXT_FRAME_WIDTH] / 2;
            $offsetCenter['y'] = $data[TextDB::TEXT_FRAME_HEIGHT] / 2;
            $align['sin'] = sin(deg2rad($data[TextDB::TEXT_ALIGN]));
            $align['cos'] = cos(deg2rad($data[TextDB::TEXT_ALIGN]));

            doImage($PathObject);
            $PathObject = PathHelper::sortPath1($PathObject);
            $PathObject = PathHelper::smoothPaths($PathObject);
            $PathObject = PathHelper::shortPaths($PathObject);
            $PathObject = PathHelper::sortPath1($PathObject, false);
            $PathObject = PathHelper::translatePathObject($PathObject);
            $PathObject = PathHelper::fixElements($PathObject);
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

            // TIMER -> start();
            $fArray = creatorHelper::img2fArray($img, true);
            // $gh = $fArray -> getArray();
            // creatorHelper::farray2file($fArray, "test" . random_int(0, 9) . ".txt");
            // TIMER -> print();
            // file_put_contents ("test_1.png", $img); // works, or:
            // $img-> writeImage(fopen ("test_2.jpg", "wb")); //also works
            $img -> destroy();
            creatorHelper::checkImgArray($fArray);
            // TIMER -> print();
            $y_C = 0;
            $x_C = 0;
            $offsetCenter['x'] = $data[ImageDB::IMAGE_WIDTH] / 2;
            $offsetCenter['y'] = $data[ImageDB::IMAGE_HEIGHT] / 2;
            $align['sin'] = sin(deg2rad($data[ImageDB::IMAGE_ALIGN]));
            $align['cos'] = cos(deg2rad($data[ImageDB::IMAGE_ALIGN]));

            
            // TIMER -> print();
            doImage($PathObject);
            // TIMER -> end();
            $PathObject = PathHelper::sortPath1($PathObject);
            // $PathObject = PathHelper::smoothPaths($PathObject);
            // $PathObject = PathHelper::shortPaths($PathObject);
            $PathObject = PathHelper::sortPath1($PathObject, false);
            $PathObject = PathHelper::translatePathObject($PathObject);
            $PathObject = PathHelper::fixElements($PathObject);
            $PathObjectOut -> combinePathObject($PathObject);
        }
    }
    // $PathObjectOut = PathHelper::sortPath1($PathObjectOut, false);
    
    $LighterWidth   = ProjectDB::LIGHTER_WIDTH * 61.29;//ProjectDB::SCALE;
    $LighterHeight  = ProjectDB::LIGHTER_HEIGHT * 61.29;//ProjectDB::SCALE;

    $model = new NCModel($PathObjectOut);//1970 ; 2875 ; = 0,02
    $model -> scale = ProjectDB::LIGHTER_HEIGHT / ($LighterHeight);
    $model -> xNull = ($cfg -> zero -> X * ProjectDB::SCALE) -($LighterWidth / 2) ;//-(7.5 * ProjectDB::SCALE)) ;//31 = 92.5
    $model -> yNull = ($cfg -> zero -> Y * ProjectDB::SCALE) -($LighterHeight / 2);// + (5.25 * ProjectDB::SCALE)) ;//50,5 = 107.25

    $path = PATH_Project::get(PATH_Project::NC, $ProjectData[ProjectDB::PROJECT_ID], $UserID);
    $model -> save($path);
    error_log("finish");
}

function CalcCoords(float $x, float $y) : stdClass{
    global $align;
    global $xAdd;
    global $yAdd;
    global $xScale;
    global $yScale;
    global $offsetCenter;

    $r = 3;
    $x = $x * $xScale - $offsetCenter['x'];
    $y = $y * $yScale - $offsetCenter['y'];
    $output = new stdClass();
    $output -> x = round($x * $align['cos'] - $y * $align['sin'] + $xAdd, $r);
    $output -> y = round($x * $align['sin'] + $y * $align['cos'] + $yAdd, $r);
    return $output;
}

    function doImage(PathObject &$pathObject){
        global $LastIndex;
        global $fArray;
        global $x_C;
        global $y_C;
        $flag = true;
        for($y = 1; $y < $fArray -> y; $y++){
            for($x = 1; $x < $fArray -> x; $x++){
                if($fArray -> get($x, $y) == 1){
                    // $pathElement -> addStep($x, $y);
                    $x_C = $x;
                    $y_C = $y;
                    $matrix = createMatrix($fArray, $x, $y);
                    if($matrix != false){
                        $pathElement = new PathElement2D();
                        if($flag){                       
                            $pathElement -> addStep($x, $y);
                            $LastIndex['xM'] = $x;
                            $LastIndex['yM'] = $y; 
                            $flag = false;
                        }
                        creatorHelper::handleMatrix($matrix, $x, $y, $x_C, $y_C, $pathElement);
                        // $pathElement -> removeStep($pathElement -> stepCount()  -1);
                        $lastStep = $pathElement -> getSteps($pathElement -> stepCount() -1);
                        if($pathElement ->  stepCount() > 2){
                            if($LastIndex['xM'] <= $lastStep['x'] + 1 && $LastIndex['xM'] >= $lastStep['x'] - 1){
                                if($LastIndex['yM'] <= $lastStep['y'] + 1 && $LastIndex['yM'] >= $lastStep['y'] - 1){
                                    $pathElement -> addStep($LastIndex['xM'], $LastIndex['yM']);
                                }
                            }
                        }
                        $pathObject -> addElement($pathElement);
                    }
                } else {
                    $flag = true;
                }
            }
        }
    }

    function goWay(array $path, PathElement2D &$pathElement) : fixedArray | bool{
        global $fArray;
        global $x_C;
        global $y_C;
        
        $x1 = $path['x'];
        $y1 = $path['y'];

        if($fArray -> get($x_C + $x1 * 2, $y_C + $y1 * 2) == 2){    
            $pathElement -> addStep($x_C + $x1 * 2, $y_C + $y1 * 2);
            eraseMatrix($x_C, $y_C);
            $fArray -> set($x_C, $y_C, 2);
            $fArray -> set($x_C + $x1, $y_C + $y1, 2);
            $fArray -> set($x_C + $x1 * 2, $y_C + $y1 * 2, 2);
            $x_C += $x1 * 2;
            $y_C += $y1 * 2;    
        } else {  
            $pathElement -> addStep($x_C + $x1, $y_C + $y1);
            eraseMatrix($x_C, $y_C);            
            $fArray -> set($x_C, $y_C, 2);
            $fArray -> set($x_C + $x1, $y_C + $y1, 2);
            $x_C += $x1;
            $y_C += $y1;  
        }
        return createMatrix($fArray, $x_C, $y_C);
    }

    function eraseMatrix(int $x, int $y) : void {
        global $fArray;
        for($x1 = -1; $x1 <= 1; $x1++){
            for($y1 = -1; $y1 <= 1; $y1++){
                // if($x1 != 0 || $y1 != 0){
                    if($fArray -> get($x + $x1, $y + $y1) == 1){
                        $fArray -> set($x + $x1, $y + $y1, 2);
                    }
                // }
            }
        }
    }
    function createMatrix(fixedArray $fArray, int $x, int $y) : fixedArray | bool {
        $output = new fixedArray(5, 5);
        $flagM = false;
        $y -= 2;
        $x -= 2;
        for($x1 = 0; $x1 <= 4; $x1++){
            for($y1 = 0; $y1 <= 4; $y1++){
                if(($x1 != 2 || $y1 != 2) && $x + $x1 >= 0 && $y + $y1 >= 0 && $x + $x1 < $fArray -> x && $y + $y1 < $fArray -> y){
                    if($fArray -> get($x + $x1, $y + $y1) == 1){
                        $output -> set($x1, $y1, 1);
                        if($x1 >= 1 && $x1 <= 3 && $y1 >= 1 && $y1 <= 3 && ($x1 != 2 || $y1 != 2)){
                            $flagM = true;
                        }
                    } else {
                        $output -> set($x1, $y1, 0);
                    }
                } else {
                    $output -> set($x1, $y1, 0);
                }
            }
        }
        if($flagM){
            return $output;
        } else {
            return false;
        }
    }
?>