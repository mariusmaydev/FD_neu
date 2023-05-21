<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class couponCode_functions{
        public static function check(){
            $DataSet = new DataSet();
            $DataSet -> newKey(CouponCodeDB::CODE, $_POST[CouponCodeDB::CODE]);
            $response = CouponCodeDB::get($DataSet);
           Communication::sendBack($response);
        }
        public static function add(string $code, string $type, $value){
            $DataSet = new DataSet();
            $DataSet -> newEntry(CouponCodeDB::CODE,        $code);
            $DataSet -> newEntry(CouponCodeDB::TYPE,        $type);
            $DataSet -> newEntry(CouponCodeDB::VALUE,       $value);
            CouponCodeDB::add($DataSet);
        }
        public static function get(string|null $code = null, string|null $type = null){
            $DataSet = new DataSet();
            if($code != null){
                $DataSet -> newKey(CouponCodeDB::CODE, $code);
            }
            if($type != null){
                $DataSet -> newKey(CouponCodeDB::TYPE, $type);
            }
            $response = CouponCodeDB::get($DataSet, DataBase::FORCE_ORDERED);
            Communication::sendBack($response);
        }
        public static function remove(string $code){
            $DataSet = new DataSet();
            $DataSet -> newEntry(CouponCodeDB::CODE, $code);
            CouponCodeDB::Delete($DataSet);
        }
    }

    class CouponCodeDB extends DataBase {
        public static $TBName     = "couponcodes";
        public static $DBName     = "code";
        public static $keyName;
        public static $key;
        const CODE           = "code";

        const TYPE           = "type";
            const TYPE_IMPERSONAL   = "impersonal";
            const TYPE_PERSONAL     = "personal"; 

        const VALUE         = "value";
      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure(){
          $dataset = new DataSet();
          $dataset -> newEntry(self::CODE,              "VARCHAR(255)");
          $dataset -> newEntry(self::TYPE,              "TEXT");
          $dataset -> newEntry(self::VALUE,             "TEXT");
          $dataset -> primaryKey(self::CODE);
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
?>