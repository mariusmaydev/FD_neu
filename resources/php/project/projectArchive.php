<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/order/orderArchive.php';

    class ProjectArchive {
        public static function get($ProjectID, $UserID, $orderID, bool $print = true){
            $DataSet = new DataSet();
            $DataSet -> newKey(ProjectDB::PROJECT_ID, $ProjectID);
            $DataSet -> TBName($UserID);
            $ProjectData = ProjectArchiveDB::get($DataSet);
            if($ProjectData == null || $ProjectData == ""){
                Communication::sendBack($ProjectID, true, $print);
                return false;
            }
            $response = $ProjectData;
            $response[ProjectArchiveDB::SQUARE] = json_decode($ProjectData[ProjectArchiveDB::SQUARE]);
            // $response = array_merge($response, self::getImages($ProjectData[ProjectDB::PROJECT_ID]));

            $PATH = new PATH_Project($UserID, $ProjectID);
            $response["Thumbnail"]   = OrderArchive::parsePath(Paths::parsePath($PATH -> get(PATH_Project::THUMBNAIL)), $orderID);

            Communication::sendBack($response, true, $print);
            return $response;
        }
    }

    class ProjectArchiveDB extends DataBase {
        public static $TBName     = "projects_";
        public static $DBName     = "projects_archive";
        public static $keyName;
        public static $key;
        
        const IS_ADMIN              = "IS_ADMIN";
        const PROJECT_ID            = "ProjectID";
        const PROJECT_NAME          = "ProjectName";
        const EPTYPE                = "EPType";
        const SQUARE                = "Square";
        const FIRST_TIME            = "First_Time";
        const LAST_TIME             = "Last_Time";
        const PRODUCT               = "Product";
        const DESIGN                = "Design";
        const STATE                 = "State";
            const STATE_NORMAL          = "NORMAL";
            const STATE_CART            = "CART";
            const STATE_ORDER           = "ORDER";

        const LIGHTER_WIDTH         = 38;
        const LIGHTER_HEIGHT        = 57.5;
        const SCALE                 = 50;
      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure($TBName){
          $dataset = new DataSet();
          $dataset -> newEntry(self::PROJECT_ID,    "VARCHAR(40)");
          $dataset -> newEntry(self::PROJECT_NAME,  "VARCHAR(40)");
          $dataset -> newEntry(self::STATE,         "VARCHAR(40)"); 
          $dataset -> newEntry(self::EPTYPE,        "VARCHAR(255)");
          $dataset -> newEntry(self::PRODUCT,       "VARCHAR(40)");
          $dataset -> newEntry(self::DESIGN,        "VARCHAR(255");
          $dataset -> newEntry(self::SQUARE,        "TEXT");
          $dataset -> newEntry(self::FIRST_TIME,    "DATETIME DEFAULT CURRENT_TIMESTAMP");
          $dataset -> newEntry(self::LAST_TIME,     "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
          $dataset -> primaryKey(self::PROJECT_ID);
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