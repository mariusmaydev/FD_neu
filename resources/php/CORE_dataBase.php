<?php

  class login extends DataBase {
    public static $TBName     = "logins";
    public static $DBName     = "userdata";
    public static $keyName;
    public static $key;
    const USER_ID   = "UserID";
    // const USER_NAME = "UserName";
    // const EMAIL     = "Email";
    // const PASSWORD  = "Password";
    const TIME_JOIN = "JoinTime";
    const TIME_LAST = "lastLogin";
    const LOGGED_IN = "loggedIn";
    // const CODE      = "code";
    const GUEST     = "Guest";
    // const SAVE_CODE = "saveCode";

    public function __construct($key = null, $keyName = null){
        self::$key      = $key;
        self::$keyName  = $keyName;
    }
    private static function getStructure(){
      $dataset = new DataSet();
      $dataset -> newEntry(self::USER_ID,   "VARCHAR(10) UNIQUE");
    //   $dataset -> newEntry(self::USER_NAME, "VARCHAR(40)");
    //   $dataset -> newEntry(self::EMAIL,     "VARCHAR(255)");
    //   $dataset -> newEntry(self::PASSWORD,  "VARCHAR(255)");
      $dataset -> newEntry(self::TIME_JOIN, "INT(10) UNSIGNED");
      $dataset -> newEntry(self::TIME_LAST, "INT(10) UNSIGNED");  
    //   $dataset -> newEntry(self::CODE,      "VARCHAR(255)");  
    //   $dataset -> newEntry(self::SAVE_CODE, "VARCHAR(255)");
      $dataset -> primaryKey(self::USER_ID);
      $dataset -> TBName(self::$TBName);
      return $dataset;
    }
    public static function get(DataSet $DataSet){
        $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
        $DataSet -> TBName(self::$TBName);
        return self::getData($DataSet, $con);
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