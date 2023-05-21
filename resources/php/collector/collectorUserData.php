<?php namespace collector;
use accessDB;
use Communication;
use DataSet;
use DataBase;
use Sessions;

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';



    class c_UserDataDB extends DataBase {
        public static $keyName;
        public static $key;
        
        // const IS_ADMIN              = "IS_ADMIN";;
        const INDEX                     = "counter";
        const USER_ID                   = "UserID";
        // const PAGE                      = "Page";
        const TIME_START                = "TimeStart";
        const TIME_END                  = "TimeEnd";
        const IP                        = "IP";

        public static function getStruct(){
            $DS2 = new DataSet();
            // $DS2 -> newEntry(self::INDEX,           "INT NOT NULL AUTO_INCREMENT");
            $DS2 -> newEntry(self::USER_ID,         "VARCHAR(40)");
            $DS2 -> newEntry(self::TIME_START,      "DATETIME"); 
            $DS2 -> newEntry(self::TIME_END,        "DATETIME");
            $DS2 -> newEntry(self::IP,              "VARCHAR(40)");
            $DS2 -> primaryKey(self::USER_ID);
            $DS2 -> DBName("collector_UserData");
            return $DS2;
        }
      }

      class collectorUserData extends c_UserDataDB {
        public static function write(){
            $UserID     = $_POST[self::USER_ID];
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            $IP         = $_POST[self::IP];
            $TimeStart  = $_POST[self::TIME_START];
            $TimeEnd    = $_POST[self::TIME_END];

            $dataset = new DataSet();
            $dataset -> newEntry(self::USER_ID,     $UserID);
            $dataset -> newEntry(self::TIME_START,  $TimeStart);
            $dataset -> newEntry(self::TIME_END,    $TimeEnd);
            $dataset -> newEntry(self::IP,          $IP);
            $dataset -> TBName($UserID);
            $res = AccessDB::add(self::getStruct(), $dataset);
            Communication::sendBack($res);
        }
        public static function get(){
            $struct = self::getStruct();
            $TBName = $struct -> TBName;
            if(!empty($_POST[self::TIME_START]) && !empty($_POST[self::TIME_END])){
                $TimeStart  = $_POST[self::TIME_START];
                $TimeEnd    = $_POST[self::TIME_END];
                $str = "SELECT * FROM $TBName WHERE 
                    TimeStart BETWEEN '$TimeStart' AND '$TimeEnd' OR 
                    TimeEnd BETWEEN '$TimeStart' AND '$TimeEnd'";
            } else if(!empty($_POST[self::TIME_START])){
                $Time  = $_POST[self::TIME_START];
                $str = "SELECT * FROM $TBName WHERE 
                    TimeStart <= '$Time' AND
                    TimeEnd >= '$Time'";
            } else if(!empty($_POST[self::TIME_END])){
                $Time  = $_POST[self::TIME_END];
                $str = "SELECT * FROM $TBName WHERE 
                    TimeStart <= '$Time' AND
                    TimeEnd >= '$Time'";
            }
            
            $res = AccessDB::query($struct, $str);
            Communication::sendBack($res);

        }
    }