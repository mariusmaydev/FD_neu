<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once '../../converter/image/filter/filterCore.php';
    require_once '../../userdata/userdata.php';
    require_once '../../converter/image/image.php';
    require_once '../DesignCore.php';
    require_once '../../upload/UploadCore.php';
    // require_once '../../converter/converter.php';
    // require_once '../../converter/image/imageWriteSingleData.php';
    // require_once '../../converter/image/filter/filterCore.php';
    require_once '../../project/project.php';
    // require $rootpath . '/fd/vendor/autoload.php';
    
    
    // \Unsplash\HttpClient::init([
    //     'applicationId'	=> 'mW5_smybRtwEzjFVNM2SegjYzoJ24Lj9vV_tw_scXtk',
    //     'secret'	=> 'bW7CVHbIGLKfzvOhYGhn1iPKdSHe4uQtreDZmYCH4NE',
    //     'callbackUrl'	=> 'https://your-application.com/oauth/callback',
    //     'utmSource' => 'Funkendesign'
    // ]);

    class imageDesign {
        public static function upload(){
        
            $imgID              = 0;
            $UploadFiles        = $_FILES['file']['tmp_name'];
            $BoxX               = ProjectDB::LIGHTER_WIDTH * ProjectDB::SCALE;
            $BoxY               = ProjectDB::LIGHTER_HEIGHT * ProjectDB::SCALE;
           
            $response = [];
            $Filter = new stdClass();
            $Filter -> contrast     = 0;
            $Filter -> sharpness    = 0;
            $Filter -> antialiasing = 0;
            $response = UploadImage_scaled($UploadFiles, $BoxX, $BoxY, json_decode(json_encode($Filter), true));
        
            $imgID = uniqid();
            $path = new PATH_Design_Image($imgID);
            DataEdit($path -> get(PATH_Design_Image::IMG_SCALE), $path -> getFile(), $response[ImageDB::IMAGE_SCALE]);
            DataEdit($path -> get(PATH_Design_Image::IMG_VIEW), $path -> getFile(), $response[ImageDB::IMAGE_VIEW]);
            $response[0][ImageDB::IMAGE_SCALE_PATH]     = PATHS::parsePath($path -> get(PATH_Design_Image::IMG_SCALE). $path -> getFile());
            $response[0][ImageDB::IMAGE_VIEW_PATH]     = PATHS::parsePath($path -> get(PATH_Design_Image::IMG_VIEW). $path -> getFile());

            $DataSet = new DataSet();
            $DataSet -> newEntry(imageDesignDB::IMAGE_ID, $imgID);
            $DataSet -> newEntry(imageDesignDB::IMAGE_NAME, "name");
            $DataSet -> newEntry(imageDesignDB::HASHTAGS, "");
            $DataSet -> newEntry(imageDesignDB::USES, 0);
            $DataSet -> newEntry(imageDesignDB::CREATOR, "ADMIN");
            $DataSet -> newEntry(imageDesignDB::STATUS, 0);
            imageDesignDB::add($DataSet);

            print_r(json_encode($response));
        }
        public static function add(){
            $UserID = Sessions::get(Sessions::USER_ID);
            $ProjectID = Sessions::get(Sessions::PROJECT_ID);
            $ImageID = uniqid();
            $DataSet = new DataSet();
            $DataSet -> newEntry(imageDesignDB::IMAGE_ID, $ImageID);
            $DataSet -> newEntry(imageDesignDB::IMAGE_NAME, "name");
            $DataSet -> newEntry(imageDesignDB::HASHTAGS, "");
            $DataSet -> newEntry(imageDesignDB::USES, 0);
            $DataSet -> newEntry(imageDesignDB::CREATOR, "user");
            $DataSet -> newEntry(imageDesignDB::STATUS, 0);
            imageDesignDB::add($DataSet);

            getProjectImages($response, $UserID, $ProjectID, $_POST[ImageDB::IMAGE_ID]);
            $path = new PATH_Design_Image($ImageID);
            DataEdit($path -> get(PATH_Design_Image::IMG_SCALE), $path -> getFile(), $response[ImageDB::IMAGE_SCALE]);
            DataEdit($path -> get(PATH_Design_Image::IMG_VIEW), $path -> getFile(), $response[ImageDB::IMAGE_VIEW]);
        }
        public static function get(){
            $DataSet = new DataSet();
            if(isset($_POST[imageDesignDB::IMAGE_ID])){
                $ImageID = $_POST[imageDesignDB::IMAGE_ID];
                $DataSet -> newEntry(imageDesignDB::IMAGE_ID, $ImageID);
            }
            $response = imageDesignDB::get($DataSet, DataBase::FORCE_ORDERED);
            if($response == null){
                print_r(false);
                exit();
            }
            $newResponse = array();
            foreach($response as $i => $index){
                if(isset($_POST[imageDesignDB::HASHTAGS]) && !compareAndCheckArray(json_decode($_POST[imageDesignDB::HASHTAGS]), json_decode($response[$i][imageDesignDB::HASHTAGS]))){
                    continue;
                } else {
                    if(isset($_POST[imageDesignDB::STATUS]) && $_POST[imageDesignDB::STATUS] != $response[$i][imageDesignDB::STATUS] && $_POST[imageDesignDB::STATUS] != "ALL"){
                        continue;
                    } else {
                        $path = new PATH_Design_Image($response[$i][imageDesignDB::IMAGE_ID]);
                        array_push($newResponse, $response[$i]);
                        $newResponse[$i][ImageDB::IMAGE_SCALE_PATH] = PATHS::parsePath($path -> get(PATH_Design_Image::IMG_SCALE) . $path -> getFile());
                        $newResponse[$i][ImageDB::IMAGE_VIEW_PATH] = PATHS::parsePath($path -> get(PATH_Design_Image::IMG_VIEW) . $path -> getFile());
                    }
                }
            }
            print_r(json_encode($newResponse));
            // error_log(__DIR__);
        }
        public static function edit(){
            $data = $_POST["imageObj"];
            $DataSet = new DataSet();
            $DataSet -> newKey(imageDesignDB::IMAGE_ID,     $data[imageDesignDB::IMAGE_ID]);
            $DataSet -> newEntry(imageDesignDB::IMAGE_NAME, $data[imageDesignDB::IMAGE_NAME]);
            $DataSet -> newEntry(imageDesignDB::RATING,     $data[imageDesignDB::RATING]);
            $DataSet -> newEntry(imageDesignDB::HASHTAGS,   $data[imageDesignDB::HASHTAGS]);
            $DataSet -> newEntry(imageDesignDB::STATUS,     $data[imageDesignDB::STATUS]);
            imageDesignDB::Edit($DataSet);
        }
        public static function remove(){
            $DataSet = new DataSet();
            $DataSet -> newEntry(imageDesignDB::IMAGE_ID, $_POST[imageDesignDB::IMAGE_ID]);
            imageDesignDB::remove($DataSet);

            $path = new PATH_Design_Image($_POST[imageDesignDB::IMAGE_ID]);
            DataRemove($path -> get(PATH_Design_Image::IMG_SCALE), $path -> getFile());
        }
        public static function copyToProject(){
            $ImageID            = $_POST[imageDesignDB::IMAGE_ID];
            $mode               = $_POST[imageDesignDB::MODE];
            $UserID             = Sessions::get(Sessions::USER_ID);
            $ProjectID          = Sessions::get(Sessions::PROJECT_ID);
            
            $response = [];
            // if($mode == imageDesignDB::MODE_PRIVATE){
            //     $response[0][ImageDB::IMAGE_SCALE]     = DataGet(PATH_Userdata::get(PATH_Userdata::IMG_SCALE, $ImageID, $UserID));
            //     $response[0][ImageDB::IMAGE_VIEW]      = DataGet(PATH_Userdata::get(PATH_Userdata::IMG_VIEW, $ImageID, $UserID));
            // } else {

            // }
        
            $imgID = uniqid();
            if($mode == imageDesignDB::MODE_PRIVATE){
                $pathSrc = PATH_Userdata::get(PATH_Userdata::IMG_SCALE, $ImageID, $UserID);

                $pathDst = PATH_Project::get(null, $ProjectID, $UserID, $imgID);
                DataCreatePath($pathDst);
                $pathDst .= PATH_Project::getFileName(PATH_Project::IMG_SCALE, $imgID, ".png");
                DataCopy($pathDst, $pathSrc);
                $response[0][ImageDB::IMAGE_SCALE_PATH] = PATHS::parsePath($pathDst);


                $pathSrc = PATH_Userdata::get(PATH_Userdata::IMG_VIEW, $ImageID, $UserID);

                $pathDst = PATH_Project::get(null, $ProjectID, $UserID, $imgID);
                DataCreatePath($pathDst);
                $pathDst .= PATH_Project::getFileName(PATH_Project::IMG_VIEW, $imgID, ".png");
                DataCopy($pathDst, $pathSrc);
                $response[0][ImageDB::IMAGE_VIEW_PATH] = PATHS::parsePath($pathDst);
            } else {

            }
        
            $dataset = new DataSet();
            $dataset -> newEntry(ImageDB::IMAGE_ID,         $imgID);
            $dataset -> TBName(Image::getCompressedID());
            ImageDB::Add($dataset);
        
            $Filter = new stdClass();
            $Filter -> contrast     = 0;
            $Filter -> sharpness    = 0;
            $Filter -> antialiasing = 0;
            $response[0][ImageDB::IMAGE_ID]     = $imgID;
            $response[0][ImageDB::IMAGE_ALIGN]  = 0;
            $response[0][ImageDB::IMAGE_FILTER] = $Filter;
            $response[0][ImageDB::IMAGE_NAME]   = "neues Bild";
            $response[0][ImageDB::IMAGE_CROP]   = false;
            print_r(json_encode($response));
        }
    }

    class imageDesignDB extends DataBase {
        public static $TBName     = "images";
        public static $DBName     = "designs";
        public static $keyName;
        public static $key;
        
        const IMAGE_ID      = "ImageID";
        const IMAGE_NAME    = "ImageName";
        const CREATION_DATE = "CreationDate";
        const RATING        = "Rating";
        const USES          = "Uses";
        const CREATOR       = "Creator";
        const HASHTAGS      = "Hashtags";
        const STATUS        = "ImageStatus";

        const MODE          = "mode";
        const MODE_PRIVATE  = "PRIVATE";
        const MODE_PUBLIC   = "PUBLIC";
      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure(){
          $dataset = new DataSet();
          $dataset -> newEntry(self::IMAGE_ID,      "VARCHAR(40)");
          $dataset -> newEntry(self::IMAGE_NAME,    "VARCHAR(40)");
          $dataset -> newEntry(self::CREATION_DATE, "DATETIME DEFAULT CURRENT_TIMESTAMP");
          $dataset -> newEntry(self::RATING,        "VARCHAR(255)");
          $dataset -> newEntry(self::USES,          "VARCHAR(255)");
          $dataset -> newEntry(self::CREATOR,       "VARCHAR(255)");
          $dataset -> newEntry(self::HASHTAGS,      "VARCHAR(255)");
          $dataset -> newEntry(self::STATUS,        "VARCHAR(255)");
          $dataset -> primaryKey(self::IMAGE_ID);
          $dataset -> TBName(self::$TBName);
          return $dataset;
        }
        public static function get(DataSet $DataSet, $param = null){
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
            $DataSet -> TBName(self::$TBName);
            return self::getData($DataSet, $con, $param);
        }
        public static function Edit(DataSet $DataSet){
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
            $DataSet -> TBName(self::$TBName);
            self::editData($con, $DataSet);
        }
        public static function Add(DataSet $DataSet){
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
            $DataSet -> TBName(self::$TBName);
            self::AddData($DataSet, $con);
        }
        public static function remove(DataSet $DataSet){
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
            $DataSet -> TBName(self::$TBName);
            self::removeData($DataSet, $con);
        }
      }
?>