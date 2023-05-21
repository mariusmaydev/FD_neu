<?php namespace collector;
use accessDB;
use Communication;
use DataSet;
use DataBase;
use Sessions;

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';



    class c_IP_DB extends DataBase {
        public static $keyName;
        public static $key;
        
        // const IS_ADMIN              = "IS_ADMIN";;
        const INDEX                     = "counter";
        const USER_ID                   = "UserID";
        const HOSTNAME                  = "hostname";
        const CITY                      = "city";
        const COUNTRY                   = "country";
        const IP                        = "ip";
        const LOC                       = "loc";
        const ORG                       = "org";
        const POSTAL                    = "postal";
        const REGION                    = "region";
        const TIME_ZONE                 = "timezone";

        public static function getStruct(){
            $DS2 = new DataSet();
            $DS2 -> newEntry(self::INDEX,           "INT NOT NULL AUTO_INCREMENT");
            $DS2 -> newEntry(self::USER_ID,         "VARCHAR(40)");
            $DS2 -> newEntry(self::HOSTNAME,        "VARCHAR(40)");
            $DS2 -> newEntry(self::CITY,            "VARCHAR(40)"); 
            $DS2 -> newEntry(self::COUNTRY,         "VARCHAR(40)");
            $DS2 -> newEntry(self::IP,              "VARCHAR(40)");
            $DS2 -> newEntry(self::LOC,              "VARCHAR(40)");
            $DS2 -> newEntry(self::ORG,              "VARCHAR(40)");
            $DS2 -> newEntry(self::POSTAL,              "VARCHAR(40)");
            $DS2 -> newEntry(self::REGION,              "VARCHAR(40)");
            $DS2 -> newEntry(self::TIME_ZONE,              "VARCHAR(40)");
            $DS2 -> primaryKey(self::INDEX);
            $DS2 -> TBName("IP");
            $DS2 -> DBName("collector");
            return $DS2;
        }
      }

      class collectorIP extends c_IP_DB {
        public static function write(){
            $UserID     = $_POST[self::USER_ID];
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            $data = $_POST;
            $data[self::USER_ID] = $UserID;
            $dataset = new DataSet();
            // $dataset -> newEntry(self::USER_ID, $UserID);
            foreach($data as $key => $val){
                $dataset -> newEntry($key,     $val);
            }
            $res = AccessDB::add(self::getStruct(), $dataset);
            Communication::sendBack($res);
            // if($UserID == null){
            //     $UserID = Sessions::get(Sessions::USER_ID);
            // }
            // $IP         = $_POST[self::IP];
            // $TimeStart  = $_POST[self::TIME_START];
            // $TimeEnd    = $_POST[self::TIME_END];

            // $dataset -> newEntry(self::USER_ID,     $UserID);
            // $dataset -> newEntry(self::TIME_START,  $TimeStart);
            // $dataset -> newEntry(self::TIME_END,    $TimeEnd);
            // $dataset -> newEntry(self::IP,          $IP);
        }
    }