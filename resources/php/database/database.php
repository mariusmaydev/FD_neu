<?php namespace DataBase;

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    define('SERVERNAME', "localhost");
    define('USER', 'root');
    define('PASSWORD', "");

use Communication;
use \stdClass;
    use \mysqli;
    use \Debugg;
use mysqli_result;

    class DataBase_access {
        const COMMAND = "command";
        const DB_NAME = "DBname";

        public static function execute(string $command, string|null $DBname, bool $print = true){
            Communication::sendBack(DataBase_C::execute($command, $DBname, DataBase_C::FORCE_ORDERED), true, $print);
        }
    }

    trait DataBaseHelper_C {
        public static function fetchResult($result, string $arg = DataBase_C::NORMAL_ORDERED) : bool|array|string|null {
            if ($result) {
                $response = [];
                $EntryCount = 1;
                $flag = true;
                if($arg == DataBase_C::FORCE_ORDERED){
                  $EntryCount = 0;
                } else if($arg == DataBase_C::DENY_ORDERED){
                  $flag = false;
                }
                if($result -> num_rows > $EntryCount && $flag){
                  $i = 0;
                  while($row = $result -> fetch_assoc()){
                    $response[$i] = $row;
                    $i++;
                  }
                  return $response;
                } else {
                  return $result -> fetch_assoc();
                }
            } else {
                return false;
            }
        }
    }

    class DataBase_C {
        public const FORCE_ORDERED   = "FORCE_ORDERED";
        public const DENY_ORDERED    = "DENY_ORDERED";
        public const NORMAL_ORDERED  = "NORMAL_ORDERED";

        use DataBaseHelper_C;
        public static function getDataSet(){
            return new DataSet_C();
        }
        public static function execute($command, $DBname, string $resultOrderType = self::NORMAL_ORDERED) : mixed {
            $con = self::getConnection($DBname);
            if($con == false){
                return false;
            }
            $res = $con -> query($command);
            $con -> close();
            $res = self::fetchResult($res, $resultOrderType);
            return $res;
        }
        public static function getConnection($DBname) : mysqli|bool {
            $con = new mysqli(SERVERNAME, USER, PASSWORD, $DBname);
            if($con -> connect_error){
                return false;
            } else {
                return $con;
            }
        }

    }



    class DataSet_C {
        private $entrys      = [];
        private $keys        = [];
        private $DBName      = false;
        private $TBName      = false;
        private $primaryKey  = false;

        public function __construct(){}
        public function getPrimaryKey() : string|bool {
            return $this -> primaryKey;
        }
        public function getTBName() : string|bool {
            return $this -> TBName;
        }
        public function getDBName() : string|bool {
            return $this -> DBName;
        }
        public function getEntrys() : array {
            return $this -> keys;
        }
        public function getKeys() : array {
            return $this -> keys;
        }
        public function addEntry(string $key, string $value) : void {
            array_push($this -> entrys, $this -> Key_value($key, $value));
        }
        public function addKey(string $key, string $value){
            array_push($this -> keys, $this -> Key_value($key, $value));
        }
        public function setDBName(string $DBName) : void {
            $this -> DBName = $DBName;
        }
        public function setTBName(string $TBName) : void {
            $this -> TBName = $TBName;
        }
        public function setPrimaryKey(string $key, string $value) : void {
            $this -> primaryKey = $this -> Key_value($key, $value);
        }
        private function Key_value(string $key, string $value) : stdClass {
            $obj = new stdClass();
            $obj -> key = $key;
            $obj -> value = $value;
            return $obj;
        }
    }