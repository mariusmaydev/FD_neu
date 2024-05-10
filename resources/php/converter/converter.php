<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/image/filter/filterCore.php';
    require_once $rootpath.'/fd/resources/php/converter/image/filter/filterGD.php';
    require_once $rootpath.'/fd/resources/php/converter/image/image.php'; 
    require_once $rootpath.'/fd/resources/php/converter/converterConfig.php'; 
    require_once $rootpath.'/fd/resources/php/converter/create/creator.php';
    require_once $rootpath.'/fd/resources/php/converter/3Dprint/3Dprint.php';
    require_once $rootpath.'/fd/resources/php/converter/3Dprint/3DprintVase.php';
    require_once $rootpath.'/fd/resources/php/converter/3mf/3mfConverter.php';
    require_once $rootpath.'/fd/resources/php/project/project.php';

    class Converter {
        const FLIP_TYPE     = "FLIP_TYPE";
        const USER_ID       = "UserID";
        const PROJECT_ID    = "ProjectID";

        public static function isGD(){
            return true;
            if(class_exists("Imagick")){
                return false;
            } else {
                return true;
            }
        }
        // public static function createThumbnail(){
        //     $StorageProject = $_POST["StorageProject"];

        //     $StorageImg     = null;
        //     $StorageText    = null;
        //     if(isset($_POST["StorageImg"])){
        //         $StorageImg     = $_POST["StorageImg"];
        //     }
        //     if(isset($_POST["StorageText"])){
        //         $StorageText    = $_POST["StorageText"];
        //     }
        //     createThumbnail($StorageProject, $StorageImg, $StorageText);
        // }
        public static function genFrame($UserID, $ProjectID,bool $sendBack = true){
            $args = new stdClass();
            $args -> type = "laser";
            $args -> PointZero = new stdClass();
            $args -> PointZero -> X = null;
            $args -> PointZero -> Y = null;
            if(isset($_POST["Args"])){
                $args = $_POST["Args"];
                $args = new stdClass();
                $args -> PointZero = new stdClass();
                $args -> PointZero -> X = $_POST["Args"]["PointZero"]["X"] / 16.4;
                $args -> PointZero -> Y = $_POST["Args"]["PointZero"]["Y"] / 16.4;
                $args -> OffsetFrame = $_POST["Args"]["offsetFrame"];
                $args -> CurrentConfig = $_POST["Args"]["CurrentConfig"];
                Communication::sendBack($args);
            }
            
            $ProjectData = Project::get($ProjectID, $UserID, false);
            $args -> lighterSize = new stdClass();
            $args -> lighterSize -> height = $ProjectData[ProjectDB::SQUARE] -> heightMM * 50;
            $args -> lighterSize -> width = $ProjectData[ProjectDB::SQUARE] -> widthMM * 50;
            ConverterCreator::createLaserFrame($ProjectData, $UserID, $args);
        }
        public static function filter(){
            $ImageData  = $_POST["Storage"];
            $Filter     = $ImageData[ImageDB::IMAGE_FILTER]; 
            $SessionObj = new Sessions();
            $Sessions = $SessionObj -> save();
            $imgScale = getSingleProjectImage($Sessions[Sessions::USER_ID], $Sessions[Sessions::PROJECT_ID], $ImageData[ImageDB::IMAGE_ID], PATH_Project::IMG_SCALE);
            
            $ImageData["grayscale"] = false;
            if($ImageData["grayscale"] == "true"){
                $ImageData["grayscale"] = true;
            } else {
                $ImageData["grayscale"] = false;
            }

            if(!Converter::isGD()){
                Filter::createImage($imgScale, $Filter, $ImageData["grayscale"]);            
                $response[ImageDB::IMAGE_VIEW_PATH] = saveSingleProjectImage($ImageData[ImageDB::IMAGE_ID], PATH_Project::IMG_VIEW, $imgScale, $Sessions[Sessions::USER_ID], $Sessions[Sessions::PROJECT_ID]);

            } else {
                $imgout = FilterGD::createImage($imgScale, $Filter, $ImageData["grayscale"]);            
                $response[ImageDB::IMAGE_VIEW_PATH] = saveSingleProjectImage($ImageData[ImageDB::IMAGE_ID], PATH_Project::IMG_VIEW, $imgout, $Sessions[Sessions::USER_ID], $Sessions[Sessions::PROJECT_ID]);

            }
            
            // file_put_contents ("test_1.png", $imgScale); // works, or:
            $SessionObj -> unsave();
            Communication::sendBack($response);
        }
        public static function flip(){
            $ImageID = $_POST[ImageDB::IMAGE_ID];
            $flipType = IMG_FLIP_HORIZONTAL;

            $SessionObj = new Sessions();
            $Sessions = $SessionObj -> save();
            
            $Images = [];
            getProjectImages($Images, $Sessions[Sessions::USER_ID], $Sessions[Sessions::PROJECT_ID], $ImageID);

            $response = [];
            $response[ImageDB::IMAGE_SCALE] = getSingleProjectImage($Sessions[Sessions::USER_ID], $Sessions[Sessions::PROJECT_ID], $ImageID, PATH_Project::IMG_SCALE);
            $response[ImageDB::IMAGE_VIEW] = getSingleProjectImage($Sessions[Sessions::USER_ID], $Sessions[Sessions::PROJECT_ID], $ImageID, PATH_Project::IMG_VIEW);

            if($_POST[self::FLIP_TYPE] == "VERTICAL"){
                $response[ImageDB::IMAGE_SCALE] -> flipImage();
                $response[ImageDB::IMAGE_VIEW] -> flipImage();
            } else {
                $response[ImageDB::IMAGE_SCALE] -> flopImage();
                $response[ImageDB::IMAGE_VIEW] -> flopImage();
            }
            $response[ImageDB::IMAGE_SCALE_PATH] = saveSingleProjectImage($ImageID, PATH_Project::IMG_SCALE, $response[ImageDB::IMAGE_SCALE], $Sessions[Sessions::USER_ID], $Sessions[Sessions::PROJECT_ID]);
            $response[ImageDB::IMAGE_VIEW_PATH] = saveSingleProjectImage($ImageID, PATH_Project::IMG_VIEW, $response[ImageDB::IMAGE_VIEW], $Sessions[Sessions::USER_ID], $Sessions[Sessions::PROJECT_ID]);

            $SessionObj -> unsave();

            print_r(json_encode($response));
        }
        public static function createLaser($UserID, $ProjectID){

        }
        public static function create3MF(){

        }
        public static function create($UserID, $ProjectID){

            $args = new stdClass();
            $args -> type = "laser";
            $args -> PointZero = new stdClass();
            $args -> PointZero -> X = null;
            $args -> PointZero -> Y = null;
            if(isset($_POST["Args"])){
                $args = $_POST["Args"];
                $args = new stdClass();
                $args -> type = $_POST["Args"]["type"];
                $args -> PointZero = new stdClass();
                $args -> PointZero -> X = null;
                $args -> PointZero -> Y = null;
                if(isset($_POST["Args"]["PointZero"]) && isset($_POST["Args"]["PointZero"]["X"]) && $_POST["Args"]["PointZero"]["X"] != null){
                    $args -> PointZero -> X = $_POST["Args"]["PointZero"]["X"] / 16.4;
                    $args -> PointZero -> Y = $_POST["Args"]["PointZero"]["Y"] / 16.4;
                }
                $args -> CurrentConfig = $_POST["Args"]["CurrentConfig"];
                Communication::sendBack($args);
            }
            
            $ProjectData = Project::get($ProjectID, $UserID, false);
            
            $ImageData = Image::get(null, $ProjectID, $UserID, false);
            $TextData = Text::get(null, $UserID, $ProjectID, false);
            $args -> lighterSize = new stdClass();
            $args -> lighterSize -> height = $ProjectData[ProjectDB::SQUARE] -> heightMM * 50;
            $args -> lighterSize -> width = $ProjectData[ProjectDB::SQUARE] -> widthMM * 50;
            switch($args -> type){
                case "laserFlat": {
                    $cfg = ConverterConfig::get($args -> CurrentConfig, false);
                    $args -> intensity = new stdClass();
                    $args -> intensity -> min = $cfg -> laserFlat -> intensity -> min;
                    $args -> intensity -> max = $cfg -> laserFlat -> intensity -> max;
                    $args -> intensity -> binary = $cfg -> laserFlat -> intensity -> binary;
                    $args -> rendering = new stdClass();
                    $args -> rendering -> row = $cfg -> laserFlat -> rendering -> row;
                    $args -> rendering -> col = $cfg -> laserFlat -> rendering -> col;
                    $args -> PointZero -> X = $cfg -> laserFlat -> zero -> X;
                    $args -> PointZero -> Y = $cfg -> laserFlat -> zero -> Y;
                    $args -> quality_PpMM = $cfg -> laserFlat -> quality_PpMM;
                    $pathObject = ConverterCreator::createPathObjectLaserFlat($ProjectData, $UserID, $args, $ImageData, $TextData);
                    ConverterCreator::createLaserFlatData($ProjectData, $UserID, $args, $pathObject);
                } break;
                case "laser": {
                    $pathObject = ConverterCreator::createPathObject($ProjectData, $UserID, $args, $ImageData, $TextData);
                    ConverterCreator::createLaserData($ProjectData, $UserID, $args, $pathObject);
                } break;
                case "engraving": {
                    $pathObject = ConverterCreator::createPathObject($ProjectData, $UserID, $args, $ImageData, $TextData);
                    ConverterCreator::createEngravingData($ProjectData, $UserID, $args, $pathObject);
                } break;
                case "SVG": {
                    $pathObject = ConverterCreator::createPathObject($ProjectData, $UserID, $args, $ImageData, $TextData);
                    ConverterCreator::createSVGData($ProjectData, $UserID, $args, $pathObject);
                } break;
            }

            // $Storage = [];
            // $Storage["IMG"] = $_POST["StorageImg"];
            // $Storage["TXT"] = $_POST["StorageText"];
            // $Storage["PROJECT"] = $_POST["StorageProject"];
            
            // $vase = new print3Dvase(50, 50, 60);
            // $vase -> draw();
            // $vase -> getNC();
            // start_3mf();
            // debugg("start");
            // $imgScale = imagecreatefrompng($rootpath . "/fd/data/3Dprint/testFlorian2.png");
            // $print = new print3DImage();
            // $print -> gen3DImage($imgScale);
            // debugg("end");
            // $pathObjectIn = print3D::f1($imgScale, imagesx($imgScale), imagesy($imgScale));
            // $pathObject = new PathObject();
            // $pathElements = $pathObjectIn -> getElements();
            // foreach($pathElements as $key => $pathElement){
            //     $p = print3D::sortPathElement($pathElement);
            //     $pathObject -> addElement($p);
            //     // error_log($key);
            //     // break;
            // }
            // print3D::PathObject2Img($pathObject, "3DLayer", imagesx($imgScale), imagesy($imgScale));



            // error_log(print_r($imgArray, true));
            // create_START($_POST["StorageProject"], checkIsset($_POST["StorageImg"]), checkIsset($_POST["StorageText"]));

        }
        public static function createLithopane(){
            global $rootpath;
            Debugg::warn("test");
            Debugg::log("test");
            Debugg::error("test");
            Debugg::time();
            // $imgScale = imagecreatefrompng($rootpath . "/fd/data/3Dprint/4.png");
            // $print = new print3DImage();
            // $print -> x = 100;
            // $print -> y = 100;
            // $print -> stroke = 0.4;
            // $print -> baseHeight = 0.8;
            // $print -> maxHeight = 3.2;

            // $print -> gen3DImage($imgScale);
        }
    }

    function checkIsset(&$value, $else = null){
        if(isset($value)){
            return $value;
        }
        return $else;
    }
?>