<?php namespace collector;
    use Communication;
    use DataBase;
    use DataSet;

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class c_UserObjDB extends DataBase {
        public static $keyName;
        public static $key;
        
        // const IS_ADMIN              = "IS_ADMIN";;
        const INDEX                     = "counter";
        const USER_ID                   = "UserID";
        // const PAGE                      = "Page";
        const TIME_START                = "TimeStart";
        const TIME_END                  = "TimeEnd";
        const IP                        = "IP";
        const PATH                      = "Path";

        public static function getStruct(){
            $DS2 = new DataSet();
            // $DS2 -> newEntry(self::INDEX,           "INT NOT NULL AUTO_INCREMENT");
            $DS2 -> newEntry(self::USER_ID,         "VARCHAR(40)");
            $DS2 -> newEntry(self::TIME_START,      "DATETIME"); 
            $DS2 -> newEntry(self::TIME_END,        "DATETIME");
            $DS2 -> newEntry(self::IP,              "VARCHAR(40)");
            $DS2 -> newEntry(self::PATH,            "TEXT");
            $DS2 -> primaryKey(self::USER_ID);
            $DS2 -> DBName("collector_UserData");
            return $DS2;
        }
      }
    class collectorUserOBJ {
        public static function edit(){

        }
    }