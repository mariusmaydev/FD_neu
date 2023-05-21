<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class hashtags {
        public static function add(array $names){
            foreach($names as $name){
                $DataSet = new DataSet();
                $DataSet -> newEntry(hashtagsDB::NAME, $name);
                hashtagsDB::add($DataSet);
            }
            Communication::sendBack(true);
        }
        public static function get(string|null $name = null){
            $DataSet = new DataSet();
            if($name == null){
                $output = hashtagsDB::get($DataSet, DataBase::FORCE_ORDERED);
                Communication::sendBack($output);
                return;
            }
            $DataSet -> newKey(hashtagsDB::NAME, $name);
            $output = hashtagsDB::get($DataSet, DataBase::FORCE_ORDERED);
            Communication::sendBack($output);
            return;
        }
        public static function remove(string $name){
            $DataSet = new DataSet();
            $DataSet -> newEntry(hashtagsDB::NAME, $name);
            hashtagsDB::remove($DataSet);
            Communication::sendBack(true);
        }
        public static function edit(string $name, $views = null){
            $DataSet = new DataSet();
            if($views != null){
                $DataSet -> newEntry(hashtagsDB::VIEWS, $views);
            }
            $DataSet -> newKey(hashtagsDB::NAME, $name);
            $output = hashtagsDB::get($DataSet, DataBase::FORCE_ORDERED);
            Communication::sendBack($output);
        }
    }

    class hashtagsDB extends DataBase {
        public static $TBName     = "tags";
        public static $DBName     = "designs";
        public static $keyName;
        public static $key;
        
        const NAME                  = "name";
        const DATE                  = "date";
        const VIEWS                 = "views";
      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure(){
          $dataset = new DataSet();
          $dataset -> newEntry(self::NAME,      "VARCHAR(40) UNIQUE");
          $dataset -> newEntry(self::VIEWS,     "VARCHAR(40)");
          $dataset -> newEntry(self::DATE,      "DATETIME DEFAULT CURRENT_TIMESTAMP");
          $dataset -> primaryKey(self::NAME);
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