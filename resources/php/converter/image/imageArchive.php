<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class ImageArchiveDB extends DataBase {
        public static $TBName     = "";
        public static $DBName     = "converter_images_archive";
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
          $dataset -> newEntry(self::IMAGE_ID,      "VARCHAR(40)");
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