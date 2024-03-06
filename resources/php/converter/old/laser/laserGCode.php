<?php

//     class laserGCode {
//         public function __construct(Imagick $img){
            
//         }
//     }
// function start($ProjectData, $UserID, $ImgData = null, $TextData = null){
//     global $fArray;
//     global $yAdd;
//     global $xAdd;
//     global $xScale;
//     global $yScale;
//     global $x_C;
//     global $y_C;
//     global $align;
//     global $offsetCenter;
//     global $LIGHTER_HEIGHT;
//     global $LIGHTER_WIDTH;
//     global $LIGHTER_MULTIPLY;
//     $cfg = ConverterConfig::get();
    
//     $ProjectID = $ProjectData[ProjectDB::PROJECT_ID];
    
//     $LastIndex = array();
//     $LastIndex['xM'] = -1;
//     $lastIndex['yM'] = -1;
//     $PathObjectOut = new PathObject();
//     if($TextData != null){
//         foreach($TextData as $i => $data){
//             $PathObject = new PathObject();
//             $img = Text::getTextImg($data[TextDB::TEXT_ID], $ProjectID, $UserID);
//             $img -> brightnessContrastImage(0, 100);
//             $img -> edgeImage(1);
//             $img -> setImageFormat('png');
//             file_put_contents("testOut.png",$img);
//             $img ->writeImage("testOut.png");
//             $xScale = $data[TextDB::TEXT_FRAME_WIDTH] / $img -> getImageWidth();
//             $yScale = $data[TextDB::TEXT_FRAME_HEIGHT] / $img -> getImageHeight();

//             $xAdd = $data[TextDB::TEXT_POS_X];
//             $yAdd = $data[TextDB::TEXT_POS_Y];

//             $fArray = creatorHelper::img2fArray($img, true);
//             $img -> destroy();
//             creatorHelper::checkImgArray($fArray);
//             $y_C = 0;
//             $x_C = 0;
//             $offsetCenter['x'] = $data[TextDB::TEXT_FRAME_WIDTH] / 2;
//             $offsetCenter['y'] = $data[TextDB::TEXT_FRAME_HEIGHT] / 2;
//             $align['sin'] = sin(deg2rad($data[TextDB::TEXT_ALIGN]));
//             $align['cos'] = cos(deg2rad($data[TextDB::TEXT_ALIGN]));

//             doImage($PathObject);
//             $PathObject = PathHelper::sortPath1($PathObject);
//             $PathObject = PathHelper::smoothPaths($PathObject);
//             $PathObject = PathHelper::shortPaths($PathObject);
//             $PathObject = PathHelper::sortPath1($PathObject, false);
//             $PathObject = PathHelper::translatePathObject($PathObject);
//             $PathObject = PathHelper::fixElements($PathObject);
//             $PathObjectOut -> combinePathObject($PathObject);
//         }
//     }
//     if($ImgData !=null){
//         foreach($ImgData as $i => $data){
//             $PathObject = new PathObject();
//             $img = getSingleProjectImage($UserID, $ProjectID, $data[ImageDB::IMAGE_ID], PATH_Project::IMG_VIEW);
//             $xScale = $data[ImageDB::IMAGE_WIDTH] / $img -> getImageWidth();
//             $yScale = $data[ImageDB::IMAGE_HEIGHT] / $img -> getImageHeight();

//             $img -> setImageFormat('png');
//             $xAdd = $data[ImageDB::IMAGE_POS_X];
//             $yAdd = $data[ImageDB::IMAGE_POS_Y];

//             // TIMER -> start();
//             // $gh = $fArray -> getArray();
//             // creatorHelper::farray2file($fArray, "test" . random_int(0, 9) . ".txt");
//             // TIMER -> print();
//             // file_put_contents ("test_1.png", $img); // works, or:
//             // $img-> writeImage(fopen ("test_2.jpg", "wb")); //also works
//             $img -> destroy();
//             // TIMER -> print();
//             $y_C = 0;
//             $x_C = 0;
//             $offsetCenter['x'] = $data[ImageDB::IMAGE_WIDTH] / 2;
//             $offsetCenter['y'] = $data[ImageDB::IMAGE_HEIGHT] / 2;
//             $align['sin'] = sin(deg2rad($data[ImageDB::IMAGE_ALIGN]));
//             $align['cos'] = cos(deg2rad($data[ImageDB::IMAGE_ALIGN]));

            
//         }
//     }
//     // $PathObjectOut = PathHelper::sortPath1($PathObjectOut, false);
    
//     $LighterWidth   = $LIGHTER_WIDTH * $LIGHTER_MULTIPLY;//ProjectDB::SCALE;
//     $LighterHeight  = $LIGHTER_HEIGHT * $LIGHTER_MULTIPLY;//ProjectDB::SCALE;

//     $model = new NCModel($PathObjectOut);//1970 ; 2875 ; = 0,02
//     $model -> scale = $LIGHTER_HEIGHT / ($LighterHeight);
//     $model -> xNull = ($cfg -> zero -> X * ProjectDB::SCALE) -($LighterWidth / 2) ;//-(7.5 * ProjectDB::SCALE)) ;//31 = 92.5
//     $model -> yNull = ($cfg -> zero -> Y * ProjectDB::SCALE) -($LighterHeight / 2);// + (5.25 * ProjectDB::SCALE)) ;//50,5 = 107.25

//     $path = PATH_Project::get(PATH_Project::NC, $ProjectData[ProjectDB::PROJECT_ID], $UserID);
//     $model -> save($path);
//     error_log("finish");
// }