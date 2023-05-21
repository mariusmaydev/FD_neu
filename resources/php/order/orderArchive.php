<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class OrderArchive {
        public static function getOrder(string|null $orderID = null, $UserID = null, bool $sendBack = true){
            $DataSet = new DataSet();	
            if($orderID != null){
                $DataSet -> newKey(OrderArchiveDB::ORDER_ID, $orderID);
            }
            if($UserID != null){
                $DataSet -> newKey(OrderArchiveDB::USER_ID, $UserID);
            }
            $response = OrderArchiveDB::get($DataSet, DataBase::FORCE_ORDERED);            
            foreach($response as $key => $val){
                $response[$key]["Path_PDF"] = Paths::parsePath(PATHS::buildPath($GLOBALS['SSL1'] . ($_SERVER["DOCUMENT_ROOT"]), $GLOBALS['folder'], "data", "Archive/Orders", $orderID));
            }
            Communication::sendBack($response, true, $sendBack);
            return $response;
        }
        public static function parsePath(string $path2Project, $orderID) : string {
            return str_replace("Users", "Archive/Orders/" . $orderID , $path2Project);
        }
    }

    class OrderArchiveDB extends DataBase {
        public static $TBName     = "orders_archive";
        public static $DBName     = "orders";
        public static $keyName;
        public static $key;
        const ORDER_ID    = "OrderID";
        const USER_ID     = "UserID";
        const TIME        = "Time";
        const ITEMS       = "Items";
        const ADDRESS     = "Address";
        const STATE       = "State";
            const STATE_OPEN    = "OPEN";
            const STATE_CLOSED  = "CLOSED";
      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure(){
          $dataset = new DataSet();
          $dataset -> newEntry(self::ORDER_ID,  "VARCHAR(40) UNIQUE");
          $dataset -> newEntry(self::USER_ID,   "VARCHAR(40)");
          $dataset -> newEntry(self::TIME,      "DATETIME DEFAULT CURRENT_TIMESTAMP");
          $dataset -> newEntry(self::ITEMS,     "TEXT");
          $dataset -> newEntry(self::ADDRESS,   "TEXT");
          $dataset -> newEntry(self::STATE,     "VARCHAR(255)");
          $dataset -> primaryKey(self::ORDER_ID);
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
        public static function Add(DataSet $dataset){
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
            $dataset -> TBName(self::$TBName);
            self::AddData($dataset, $con);
        }
        public static function Delete(DataSet $dataset){
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
            $dataset -> TBName(self::$TBName);
            self::removeData($dataset, $con);
        }
      }