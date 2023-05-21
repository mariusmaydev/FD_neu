<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class JSON {
        public static function decode(&$json){
            if(gettype($json) == 'string'){
                $json = json_decode($json);
            } 
            return $json;
        }
        public static function encode(&$json){
            if(gettype($json) != 'string'){
                $json = json_encode($json);
            }
            return $json;
        }
    }
    class Address {
        public static function add(){
            session_start();
            $Storage = $_POST["address"];
            $AddressID = StringTools::realUniqID();
            $DataSet = new DataSet();
            $DataSet -> newEntry(AddressDB::ADDRESS_ID,     $AddressID);
            $DataSet -> newEntry(AddressDB::ADDRESS_NAME,   $Storage[AddressDB::ADDRESS_NAME]);
            $DataSet -> newEntry(AddressDB::SALUTATION,     $Storage[AddressDB::SALUTATION]);
            $DataSet -> newEntry(AddressDB::COUNTRY,        $Storage[AddressDB::COUNTRY]);
            $DataSet -> newEntry(AddressDB::CITY,           $Storage[AddressDB::CITY]); 
            $DataSet -> newEntry(AddressDB::POSTCODE,       $Storage[AddressDB::POSTCODE]);
            $DataSet -> newEntry(AddressDB::STREET,         $Storage[AddressDB::STREET]);
            $DataSet -> newEntry(AddressDB::HOUSENUMBER,    $Storage[AddressDB::HOUSENUMBER]);
            $DataSet -> newEntry(AddressDB::FIRST_NAME,     $Storage[AddressDB::FIRST_NAME]);
            $DataSet -> newEntry(AddressDB::LAST_NAME,      $Storage[AddressDB::LAST_NAME]);
            $DataSet -> newEntry(AddressDB::TITLE,          $Storage[AddressDB::TITLE]);
            $DataSet -> newEntry(AddressDB::EMAIL,          $Storage[AddressDB::EMAIL]);
            $DataSet -> newEntry(AddressDB::PHONE,          $Storage[AddressDB::PHONE]);
            $DataSet -> TBName(Sessions::get(Sessions::USER_ID));
            AddressDB::Add($DataSet);
        }
        public static function get(){
            $DataSet = new DataSet();
            if(isset($_POST[AddressDB::ADDRESS_ID]) && $_POST[AddressDB::ADDRESS_ID] != ""){
                $DataSet -> newKey(AddressDB::ADDRESS_ID, $_POST[AddressDB::ADDRESS_ID]);
            }
            $DataSet -> TBName(Sessions::get(Sessions::USER_ID));
            $response = AddressDB::get($DataSet, DataBase::FORCE_ORDERED);
            print_r(json_encode($response));
        }
        public static function remove(){
            $DataSet = new DataSet();
            $DataSet -> newEntry(AddressDB::ADDRESS_ID, $_POST[AddressDB::ADDRESS_ID]);
            $DataSet -> TBName(Sessions::get(Sessions::USER_ID));
            AddressDB::remove($DataSet);
        }
        public static function edit(){
            $Storage = $_POST["Storage"];
            $DataSet = new DataSet();
            $DataSet -> newKey(AddressDB::ADDRESS_ID,       $Storage[AddressDB::ADDRESS_ID]);
            $DataSet -> newEntry(AddressDB::ADDRESS_NAME,   $Storage[AddressDB::ADDRESS_NAME]);
            $DataSet -> newEntry(AddressDB::COUNTRY,        $Storage[AddressDB::COUNTRY]);
            $DataSet -> newEntry(AddressDB::CITY,           $Storage[AddressDB::CITY]); 
            $DataSet -> newEntry(AddressDB::POSTCODE,       $Storage[AddressDB::POSTCODE]);
            $DataSet -> newEntry(AddressDB::STREET,         $Storage[AddressDB::STREET]);
            $DataSet -> newEntry(AddressDB::HOUSENUMBER,    $Storage[AddressDB::HOUSENUMBER]);
            $DataSet -> newEntry(AddressDB::FIRST_NAME,     $Storage[AddressDB::FIRST_NAME]);
            $DataSet -> newEntry(AddressDB::LAST_NAME,      $Storage[AddressDB::LAST_NAME]);
            $DataSet -> newEntry(AddressDB::TITLE,          $Storage[AddressDB::TITLE]);
            $DataSet -> TBName(Sessions::get(Sessions::USER_ID));
            AddressDB::edit($DataSet);
        }
    }

        
    class AddressDB extends DataBase {
        public static $TBName     = "_";
        public static $DBName     = "address";
        public static $keyName;
        public static $key;
        const ADDRESS_ID        = "AddressID";
        const ADDRESS_NAME      = "AddressName";
        const COUNTRY           = "Country";
        const CITY              = "City";
        const POSTCODE          = "Postcode";
        const STREET            = "Street";
        const HOUSENUMBER       = "HouseNumber";
        const FIRST_NAME        = "FirstName";
        const LAST_NAME         = "LastName";
        const TITLE             = "Title";
        const EMAIL             = "Email";
        const PHONE             = "Phone";
        const SALUTATION        = "Salutation";

    
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure($TBName){
            $dataset = new DataSet();
            $dataset -> newEntry(self::ADDRESS_ID,    "VARCHAR(40)");
            $dataset -> newEntry(self::ADDRESS_NAME,  "VARCHAR(40)");
            $dataset -> newEntry(self::COUNTRY,       "VARCHAR(255)");
            $dataset -> newEntry(self::CITY,          "VARCHAR(255)");
            $dataset -> newEntry(self::POSTCODE,      "VARCHAR(255)");
            $dataset -> newEntry(self::STREET,        "VARCHAR(255)");
            $dataset -> newEntry(self::HOUSENUMBER,   "VARCHAR(255)");
            $dataset -> newEntry(self::FIRST_NAME,    "VARCHAR(255)");
            $dataset -> newEntry(self::LAST_NAME,     "VARCHAR(255)");
            $dataset -> newEntry(self::TITLE,         "VARCHAR(255)");
            $dataset -> newEntry(self::EMAIL,         "VARCHAR(255)");
            $dataset -> newEntry(self::PHONE,         "VARCHAR(255)");
            $dataset -> newEntry(self::SALUTATION,    "VARCHAR(255)");
            $dataset -> primaryKey(self::ADDRESS_ID);
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
    }
?>