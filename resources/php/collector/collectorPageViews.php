<?php namespace collector;

use accessDB;
use Communication;
use DataSet;
use DataBase;
use Sessions;

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';



    class c_PageViewsDB extends DataBase {
        // public static $TBName     = "collector_";
        // public static $DBName     = "collector_pageviews";
        public static $keyName;
        public static $key;
        
        // const IS_ADMIN              = "IS_ADMIN";;
        const INDEX                     = "counter";
        const USER_ID                   = "UserID";
        const PAGE                      = "Page";
        const TIME_START                = "TimeStart";
        const TIME_END                  = "TimeEnd";

        public static function getStruct(){
            $DS2 = new DataSet();
            $DS2 -> newEntry(self::INDEX,           "INT NOT NULL AUTO_INCREMENT");
            $DS2 -> newEntry(self::USER_ID,         "VARCHAR(40)");
            $DS2 -> newEntry(self::PAGE,            "VARCHAR(40)");
            $DS2 -> newEntry(self::TIME_START,      "DATETIME"); 
            $DS2 -> newEntry(self::TIME_END,        "DATETIME");
            $DS2 -> primaryKey(self::INDEX);
            $DS2 -> TBName("pageViews");
            $DS2 -> DBName("collector");
            return $DS2;
        }
      }

      class collectorPageViews extends c_PageViewsDB {
        public static function add(){
            $UserID     = $_POST[self::USER_ID];
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            $Page       = $_POST[self::PAGE];
            $TimeStart  = $_POST[self::TIME_START];
            $TimeEnd    = $_POST[self::TIME_END];

            $dataset = new DataSet();
            $dataset -> newEntry(self::USER_ID,     $UserID);
            $dataset -> newEntry(self::PAGE,        $Page);
            $dataset -> newEntry(self::TIME_START,  $TimeStart);
            $dataset -> newEntry(self::TIME_END,    $TimeEnd);
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

    class MySQL_query {
        public function __construct(){
            
        }
        public function between(string $name, mixed $v1, mixed $v2) : string {
            return "$name BETWEEN '$v1' AND '$v2' ";
        }
        public function select(DataSet $dataset){
            $TBName = $dataset -> TBName;
            $entrys = implode(", ", $dataset -> getEntrys_Names());
            if($entrys == ""){
                $entrys = "*";
            }
            return "SELECT $entrys FROM $TBName WHERE ";
        }
    }