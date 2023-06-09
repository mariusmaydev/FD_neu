<?php 

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/userdata/userdata.php';
    require_once $rootpath.'/fd/resources/php/security/security.php';

    class login_admin {
        public static function create(){
            $UserID = StringTools::realUniqID();
            $UserName = $_POST[login_adminDB::USER_NAME];
            $password = $_POST[login_adminDB::PASSWORD];
            $password_hash = password_hash($password, PASSWORD_DEFAULT);

            $dataset = new DataSet();
            $dataset -> newEntry(login_adminDB::USER_ID, $UserID);
            $dataset -> newEntry(login_adminDB::USER_NAME, $UserName);
            $dataset -> newEntry(login_adminDB::PASSWORD, $password_hash);
            $res = login_adminDB::Add($dataset);
            Communication::sendBack($res);
        }
        public static function remove(string $UserID, bool $print = true){
            $dataset = new DataSet();
            $dataset -> newEntry(login_adminDB::USER_ID, $UserID);
            $res = login_adminDB::Delete($dataset);
            Communication::sendBack($res, true, $print);
            return $res;
        }
        public static function getAll(bool $print = true){
            $dataset = new DataSet();
            $res = login_adminDB::get($dataset, DataBase::FORCE_ORDERED);
            Communication::sendBack($res, true, $print);
            return $res;
        }
        /**
         * Undocumented function
         *
         * @sendBack null if UserName not found
         * @sendBack false if password is wrong
         * @sendBack true if login is correct
         */
        public static function check(string $UserName, string $password, bool $print = true){
            $dataset = new DataSet();
            $dataset -> newKey(login_adminDB::USER_NAME, $UserName);
            $res = login_adminDB::get($dataset);
            if($res == null){
                Communication::sendBack(null, true, $print);
                return null;
            } else if(password_verify($password, $res[login_adminDB::PASSWORD])){
                Communication::sendBack(true, true, $print);
                return true;
            } else {
                Communication::sendBack(false, true, $print);
                return false;
            }
        }
        public static function login(string $UserName, string $password, bool $print = true){

            $dataset = new DataSet();
            $dataset -> newKey(login_adminDB::USER_NAME, $UserName);
            $res = login_adminDB::get($dataset);
            if($res == null){
                Communication::sendBack(null, true, $print);
            } else if(password_verify($password, $res[login_adminDB::PASSWORD])){
                Sessions::set(Sessions::ADMIN_USER_ID, $res[login_adminDB::USER_ID]);
                Sessions::set(Sessions::ADMIN_USER_NAME, $res[login_adminDB::USER_NAME]);
                Communication::sendBack($res, true, $print);
            } else {
                Communication::sendBack(false, true, $print);
            }
        }
        public static function logout(bool $print = true){
            Sessions::unset(Sessions::ADMIN_USER_ID);
            Sessions::unset(Sessions::ADMIN_USER_NAME);
            Communication::sendBack(true, true, $print);
        }
    }

    class login_adminDB extends DataBase {
        public static $TBName     = "logins_admin";
        public static $DBName     = "userdata";
        public static $keyName;
        public static $key;
        const USER_ID   = "UserID";
        const USER_NAME = "UserName";
        // const EMAIL     = "Email";
        const PASSWORD  = "Password";
        // const TIME_JOIN = "JoinTime";
        // const TIME_LAST = "lastLogin";
        // const CODE      = "code";
        // const SAVE_CODE = "saveCode";
    
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure(){
          $dataset = new DataSet();
          $dataset -> newEntry(self::USER_ID,   "VARCHAR(10) UNIQUE");
          $dataset -> newEntry(self::USER_NAME, "VARCHAR(40) UNIQUE");
        //   $dataset -> newEntry(self::EMAIL,     "VARCHAR(255)");
          $dataset -> newEntry(self::PASSWORD,  "VARCHAR(255)");
        //   $dataset -> newEntry(self::TIME_JOIN, "INT(10) UNSIGNED");
        //   $dataset -> newEntry(self::TIME_LAST, "INT(10) UNSIGNED");  
        //   $dataset -> newEntry(self::CODE,      "VARCHAR(255)");  
        //   $dataset -> newEntry(self::SAVE_CODE, "VARCHAR(255)");
          $dataset -> primaryKey(self::USER_ID);
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