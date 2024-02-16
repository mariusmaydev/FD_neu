<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/converter.php';
    require_once 'imageArchive.php';

    Class Image {
        public static function getEmptyFilter() : array{
            $Filter = [];
            $Filter[0] = self::newFilterDataSet(10, 0, 0, true);
            $Filter[1] = self::newFilterDataSet(5, 0, 0, true);
            $Filter[2] = self::newFilterDataSet(2, 0, 0, true);

            return $Filter;
        }
        public static function newFilterDataSet(float $a = 8, float $b = 10, float $c = 3, float $d = 0, bool $edges = true) : stdClass { 
            $Filter = new stdClass();
            $Filter -> contrast     = $a;
            $Filter -> sharpness    = $b;
            $Filter -> antialiasing = $c;
            $Filter -> cannyEdge_d  = $d;
            $Filter -> edges        = $edges;
            return $Filter;

        }
        public static function newID() : string {
            return StringTools::realUniqID();
        }
        public static function getCompressedID($UserID = null, $ProjectID = null) {
            if($ProjectID == null){
                $ProjectID = Sessions::get(Sessions::PROJECT_ID);
            }
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            $output = $UserID  . "_" . $ProjectID;
            return $output;
        }
        public static function copy(){
            $ImageID = StringTools::realUniqID();
            $DataSet = new DataSet();
            $DataSet -> newEntry(ImageDB::IMAGE_ID,     $ImageID);
            $DataSet -> TBName(self::getCompressedID());
            ImageDB::add($DataSet);

            $DataSet = new DataSet();
            $DataSet -> newKey(ImageDB::IMAGE_ID, $_POST[ImageDB::IMAGE_ID]);
            $DataSet -> TBName(self::getCompressedID());

            $response = [];
            getProjectImages($response, Sessions::get(Sessions::USER_ID), Sessions::get(Sessions::PROJECT_ID), $_POST[ImageDB::IMAGE_ID]);
            
            $response[ImageDB::IMAGE_VIEW_PATH] = saveSingleProjectImage($ImageID, PATH_Project::IMG_VIEW, $response[ImageDB::IMAGE_VIEW]);
            $response[ImageDB::IMAGE_SCALE_PATH] = saveSingleProjectImage($ImageID, PATH_Project::IMG_SCALE, $response[ImageDB::IMAGE_SCALE]);
            $response[ImageDB::IMAGE_ID] = $ImageID;
            Communication::sendBack($response);
        }
        public static function add($data = null, $ImageID = null, $ProjectID = null, $UserID = null){
            if($data == null){
                $data = $_POST;
            }
            if($ImageID == null){
                $ImageID = StringTools::realUniqID();
            }
            $DataSet = new DataSet();
            $DataSet -> newEntry(ImageDB::IMAGE_ID,     $ImageID);
            $DataSet -> newEntry(ImageDB::IMAGE_NAME,   $data[ImageDB::IMAGE_NAME]);
            $DataSet -> newEntry(ImageDB::IMAGE_POS_X,  $data[ImageDB::IMAGE_POS_X]);
            $DataSet -> newEntry(ImageDB::IMAGE_POS_Y,  $data[ImageDB::IMAGE_POS_Y]);
            $DataSet -> newEntry(ImageDB::IMAGE_WIDTH,  $data[ImageDB::IMAGE_WIDTH]);
            $DataSet -> newEntry(ImageDB::IMAGE_HEIGHT, $data[ImageDB::IMAGE_HEIGHT]);
            $DataSet -> newEntry(ImageDB::IMAGE_FILTER, json_decode($data[ImageDB::IMAGE_FILTER]));
            $DataSet -> newEntry(ImageDB::IMAGE_ALIGN,  $data[ImageDB::IMAGE_ALIGN]);
            $DataSet -> newEntry(ImageDB::IMAGE_CROP,   $data[ImageDB::IMAGE_CROP]);
            $DataSet -> TBName(self::getCompressedID($UserID, $ProjectID));
            ImageDB::add($DataSet);
        }
        public static function get($imageID = null, $projectID = null, $userID = null, bool $print = true){
            $DataSet = new DataSet();
            if($userID == null){
                $userID = Sessions::get(Sessions::USER_ID);
            }
            if($projectID == null){
                $projectID = Sessions::get(Sessions::PROJECT_ID);
            }
            if($imageID != null){
                $DataSet -> newKey(ImageDB::IMAGE_ID, $imageID);
            }
            $DataSet -> TBName(self::getCompressedID($userID, $projectID));
            $ImageData = ImageDB::get($DataSet, DataBase::FORCE_ORDERED);
            $response = [];
            if($ImageData != null && count($ImageData)){
                for($i = 0; $i < count($ImageData); $i++){
                    if(!isset($_POST["NoData"])){
                        getProjectImages($ImageData[$i], $userID, $projectID, $ImageData[$i][ImageDB::IMAGE_ID]);
                    }
                    $response[$i] = $ImageData[$i];
                    $response[$i][ImageDB::IMAGE_FILTER] = json_decode($ImageData[$i][ImageDB::IMAGE_FILTER]);
                }
            }
            if($print){
                Communication::sendBack($response);
            }
            return $response;
        }
        public static function edit($Storage = null, bool $print = true){
            if($Storage == null){
                if(isset($_POST["Storage"])){
                    $Storage = $_POST["Storage"];
                } else {
                    Communication::sendBack(null, true, $print);
                    return null;
                }
            }
            if(count($Storage) > 0){
                for($i = 0; $i < count($Storage); $i++){
                    $DataSet = new DataSet();
                    $IMG_DATA = $Storage[$i];
                    $DataSet -> newKey(ImageDB::IMAGE_ID,       $IMG_DATA[ImageDB::IMAGE_ID]);
                    $DataSet -> newEntry(ImageDB::IMAGE_NAME,   $IMG_DATA[ImageDB::IMAGE_NAME]);
                    $DataSet -> newEntry(ImageDB::IMAGE_POS_X,  $IMG_DATA[ImageDB::IMAGE_POS_X]);
                    $DataSet -> newEntry(ImageDB::IMAGE_POS_Y,  $IMG_DATA[ImageDB::IMAGE_POS_Y]);
                    $DataSet -> newEntry(ImageDB::IMAGE_WIDTH,  $IMG_DATA[ImageDB::IMAGE_WIDTH]);
                    $DataSet -> newEntry(ImageDB::IMAGE_HEIGHT, $IMG_DATA[ImageDB::IMAGE_HEIGHT]);
                    $DataSet -> newEntry(ImageDB::IMAGE_FILTER, json_encode($IMG_DATA[ImageDB::IMAGE_FILTER]));
                    $DataSet -> newEntry(ImageDB::IMAGE_CROP,   $IMG_DATA[ImageDB::IMAGE_CROP]);
                    $DataSet -> newEntry(ImageDB::IMAGE_ALIGN,  $IMG_DATA[ImageDB::IMAGE_ALIGN]);
                    $DataSet -> TBName(self::getCompressedID());
                    ImageDB::Edit($DataSet);
                }
                
                Communication::sendBack(true, true, $print);
                return true;
            } 
            Communication::sendBack(null, true, $print);
            return null;

            // if(isset($_POST["Storage"])){
            //     $Storage = $_POST["Storage"];
            //     if(count($Storage) > 0){
            //         for($i = 0; $i < count($Storage); $i++){
            //             $DataSet = new DataSet();
            //             $IMG_DATA = $Storage[$i];
            //             $DataSet -> newKey(ImageDB::IMAGE_ID,       $IMG_DATA[ImageDB::IMAGE_ID]);
            //             $DataSet -> newEntry(ImageDB::IMAGE_NAME,   $IMG_DATA[ImageDB::IMAGE_NAME]);
            //             $DataSet -> newEntry(ImageDB::IMAGE_POS_X,  $IMG_DATA[ImageDB::IMAGE_POS_X]);
            //             $DataSet -> newEntry(ImageDB::IMAGE_POS_Y,  $IMG_DATA[ImageDB::IMAGE_POS_Y]);
            //             $DataSet -> newEntry(ImageDB::IMAGE_WIDTH,  $IMG_DATA[ImageDB::IMAGE_WIDTH]);
            //             $DataSet -> newEntry(ImageDB::IMAGE_HEIGHT, $IMG_DATA[ImageDB::IMAGE_HEIGHT]);
            //             $DataSet -> newEntry(ImageDB::IMAGE_FILTER, json_encode($IMG_DATA[ImageDB::IMAGE_FILTER]));
            //             $DataSet -> newEntry(ImageDB::IMAGE_CROP,   $IMG_DATA[ImageDB::IMAGE_CROP]);
            //             $DataSet -> newEntry(ImageDB::IMAGE_ALIGN,  $IMG_DATA[ImageDB::IMAGE_ALIGN]);
            //             $DataSet -> TBName(self::getCompressedID());
            //             ImageDB::Edit($DataSet);
            //         }
            //     }
            // }
        }
        public static function remove(){
            $DataSet = new DataSet();
            $DataSet -> newEntry(ImageDB::IMAGE_ID, $_POST[ImageDB::IMAGE_ID]);
            $DataSet -> TBName(self::getCompressedID());
            ImageDB::remove($DataSet);
            DataRemove(PATH_Project::get(PATH_Project::IMG_SCALE, Sessions::get(Sessions::PROJECT_ID), Sessions::get(Sessions::USER_ID), $_POST[ImageDB::IMAGE_ID], ".png"));
            DataRemove(PATH_Project::get(PATH_Project::IMG_VIEW, Sessions::get(Sessions::PROJECT_ID), Sessions::get(Sessions::USER_ID), $_POST[ImageDB::IMAGE_ID], ".png"));
        }
        public static function copy2Archive($ProjectID, $UserID, $imgID = null){
            $data = self::get($imgID, $ProjectID, $UserID, false);
            foreach($data as $img){
                $DataSet = new DataSet();
                $DataSet -> newEntry(ImageArchiveDB::IMAGE_ID,     $img[ImageDB::IMAGE_ID]);
                $DataSet -> newEntry(ImageArchiveDB::IMAGE_NAME,   $img[ImageDB::IMAGE_NAME]);
                $DataSet -> newEntry(ImageArchiveDB::IMAGE_POS_X,  $img[ImageDB::IMAGE_POS_X]);
                $DataSet -> newEntry(ImageArchiveDB::IMAGE_POS_Y,  $img[ImageDB::IMAGE_POS_Y]);
                $DataSet -> newEntry(ImageArchiveDB::IMAGE_WIDTH,  $img[ImageDB::IMAGE_WIDTH]);
                $DataSet -> newEntry(ImageArchiveDB::IMAGE_HEIGHT, $img[ImageDB::IMAGE_HEIGHT]);
                $DataSet -> newEntry(ImageArchiveDB::IMAGE_FILTER, json_encode($img[ImageDB::IMAGE_FILTER]));
                $DataSet -> newEntry(ImageArchiveDB::IMAGE_ALIGN,  $img[ImageDB::IMAGE_ALIGN]);
                $DataSet -> newEntry(ImageArchiveDB::IMAGE_CROP,   $img[ImageDB::IMAGE_CROP]);
                $DataSet -> TBName(self::getCompressedID($UserID, $ProjectID));
                ImageArchiveDB::add($DataSet);
            }
        }
    }

    function getProjectImages(&$response, $UserID, $ProjectID, $imgID){
        $response[ImageDB::IMAGE_SCALE]     = getSingleProjectImage($UserID, $ProjectID, $imgID, PATH_Project::IMG_SCALE);
        $response[ImageDB::IMAGE_VIEW]      = getSingleProjectImage($UserID, $ProjectID, $imgID, PATH_Project::IMG_VIEW);

        $response[ImageDB::IMAGE_SCALE_PATH] = str_replace($GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]), "", PATH_Project::get(PATH_Project::IMG_SCALE, $ProjectID, $UserID, $imgID, ".png"));

        $response[ImageDB::IMAGE_VIEW_PATH] = str_replace($GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]), "", PATH_Project::get(PATH_Project::IMG_VIEW, $ProjectID, $UserID, $imgID, ".png"));
    }

    function getSingleProjectImage($UserID, $ProjectID, $imgID, $imgType) : Imagick | false {
        return new \Imagick(PATH_Project::get($imgType, $ProjectID, $UserID, $imgID, ".png"));
    }
    function getSingleProjectImage_std($UserID, $ProjectID, $imgID, $imgType) : GdImage | false {
        $im = imagecreatefrompng(PATH_Project::get($imgType, $ProjectID, $UserID, $imgID, ".png"));
        return $im;
    }

    function saveSingleProjectImage($imgID, $imgType, Imagick $ImageData, $UserID = null, $ProjectID = null){
        if($UserID == null){
            $UserID = Sessions::get(Sessions::USER_ID);
        }
        if($ProjectID == null){
            $ProjectID = Sessions::get(Sessions::PROJECT_ID);
        }
        $path = PATH_Project::get(null, $ProjectID, $UserID, $imgID);
        DataCreatePath($path);
        $path .= PATH_Project::getFileName($imgType, $imgID, ".png");
        // file_put_contents($path, $ImageData);
        $ImageData -> writeImage($path);
        return str_replace($GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]), "", $path);
    }

    // function saveThumbnail(Imagick $ImageData, $UserID = null, $ProjectID = null){
    //     if($UserID == null){
    //         $UserID = Sessions::get(Sessions::USER_ID);
    //     }
    //     if($ProjectID == null){
    //         $ProjectID = Sessions::get(Sessions::PROJECT_ID);
    //     }
    //     $path = PATH_Project::get(null, $ProjectID, $UserID, null);
    //     DataCreatePath($path);
    //     $path .= PATH_Project::getFileName(PATH_Project::THUMBNAIL, null, ".png");
    //     file_put_contents($path, $ImageData);
    //     $ImageData -> writeImage($path);
    //     return str_replace($GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]), "", $path);
    // }
    
    function editImage($imgMixed, $imgID, $imgType, $UserID, $ProjectID){
        if(!isset($UserID)){
            $UserID = Sessions::get(Sessions::USER_ID);
        }
        if(!isset($ProjectID)){
            $ProjectID = Sessions::get(Sessions::PROJECT_ID);
        }
        $imgBlob = 0;
        if(gettype($imgMixed) == 'object'){
            ob_start(); 
                imagepng($imgMixed);
                $imgBlob = base64_encode(ob_get_contents()); 
            ob_end_clean(); 
        } else if(gettype($imgMixed) == 'string') {
            $imgBlob = $imgMixed;
        } else {
            $imgBlob = NULL;
        }
        DataEdit(PATH_Project::get(null, $ProjectID, $UserID, $imgID), PATH_Project::getFileName($imgType, $imgID), $imgBlob);
        return $imgBlob;
      }

    class ImageDB extends DataBase {
        public static $TBName     = "_";
        public static $DBName     = "converter_images";
        public static $keyName;
        public static $key;
        const IMAGE_ID              = "ImageID";
        const IMAGE_NAME            = "ImageName";
        const IMAGE_POS_X           = "ImagePosX";
        const IMAGE_POS_Y           = "ImagePosY";
        const IMAGE_WIDTH           = "ImageWidth";
        const IMAGE_HEIGHT          = "ImageHeight";
        const IMAGE_FILTER          = "ImageFilter";
        const IMAGE_ALIGN           = "ImageAlign";
        const IMAGE_CROP            = "ImageCrop";

        const IMAGE_SCALE           = "ImageScale";
        const IMAGE_VIEW            = "ImageView";

        const IMAGE_VIEW_PATH       = "ImageViewPath";
        const IMAGE_SCALE_PATH      = "ImageScalePath";

        const FILTER_CONTRAST       = "contrast";
        const FILTER_ANTIALIASING   = "antialiasing";
        const FILTER_SHARPNESS      = "sharpness";
        const FILTER_D              = "cannyEdge_d";
        const FILTER_EDGES          = "edges";
      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure($TBName){
          $dataset = new DataSet();
          $dataset -> newEntry(self::IMAGE_ID,      "VARCHAR(10)");
          $dataset -> newEntry(self::IMAGE_NAME,    "VARCHAR(40)");
          $dataset -> newEntry(self::IMAGE_POS_X,   "INTEGER(255)");
          $dataset -> newEntry(self::IMAGE_POS_Y,   "INTEGER(255)");
          $dataset -> newEntry(self::IMAGE_WIDTH,   "INTEGER(255)");
          $dataset -> newEntry(self::IMAGE_HEIGHT,  "INTEGER(255)");
          $dataset -> newEntry(self::IMAGE_FILTER,  "TEXT");
          $dataset -> newEntry(self::IMAGE_ALIGN,   "INTEGER(255)");
          $dataset -> newEntry(self::IMAGE_CROP,    "BOOLEAN");
          $dataset -> primaryKey(self::IMAGE_ID);
          $dataset -> TBName($TBName);
          return $dataset;
        }
        public static function get(DataSet $DataSet, $param = null){
            $TBName = self::$TBName . $DataSet -> TBName();
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure($TBName)));
            $DataSet -> TBName($TBName);
            return self::getData($DataSet, $con, $param);
        }
        public static function Edit(DataSet $DataSet){
            $TBName = self::$TBName . $DataSet -> TBName();
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure($TBName)));
            $DataSet -> TBName($TBName);
            self::editData($con, $DataSet);
        }
        public static function Add(DataSet $DataSet){
            $TBName = self::$TBName . $DataSet -> TBName();
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure($TBName)));
            $DataSet -> TBName($TBName);
            self::AddData($DataSet, $con);
        }
        public static function remove(DataSet $DataSet){
            $TBName = self::$TBName . $DataSet -> TBName();
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure($TBName)));
            $DataSet -> TBName($TBName);
            self::removeData($DataSet, $con);
        }
        public static function removeTable(DataSet $DataSet){
            $TBName = self::$TBName . $DataSet -> TBName();
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure($TBName)));
            $DataSet -> TBName($TBName);
            self::dropTable($DataSet, $con);
        }
      }
?>