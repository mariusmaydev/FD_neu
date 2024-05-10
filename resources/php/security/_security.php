<?php

    // $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    // require_once $rootpath.'/fd/resources/php/CORE.php';
    // ini_set('display_errors','On');

    // class Sessions {
    //     const LOGGEDIN      = "LOGGEDIN";
    //     const USER_ID       = "USER_ID";
    //     const USER_NAME     = "USER_NAME";
    //     const ACCOUNT_TYPE  = "ACCOUNT_TYPE";
    //     const PROJECT_ID    = "PROJECT_ID";
    //     const PROJECT_NAME  = "PROJECT_NAME";
    //     const GUEST         = "GUEST";
    //     const DATA          = "DATA";
    //     const ADMIN         = "ADMIN";
    //     var $session = null;

    //     static function start(){
    //         if (session_status() === PHP_SESSION_NONE) {
    //             // session_save_path("/tmp");
    //             // ini_set('session.save_path',getcwd(). '/');
    //             session_start();
    //         }
    //     }
    //     static function getAllJS(){
    //         $sessions = self::getAll();
    //         $response = new stdClass();
    //         foreach($sessions as $k => $session){
    //             if(str_contains($k, 'jsGen_')){
    //                 $response -> $k = $session;
    //             }
    //         }
    //         return $response;
    //     }
    //     static function getAll(){
    //         self::start();
    //         return $_SESSION;
    //     }
    //     static function get($sessionName = null){
    //         self::start();
    //         if($sessionName != null){
    //             if(isset($_SESSION[$sessionName])){
    //                 return $_SESSION[$sessionName];
    //             }
    //             return false;"SESSION not set: " . $sessionName;
    //         } else {
    //             return $_SESSION;
    //         }
    //     }
    //     static function set($sessionName, $value){
    //         self::start();
    //         $_SESSION[$sessionName] = $value;
    //     }
    //     static function unset($sessionName){
    //         self::start();
    //         unset($_SESSION[$sessionName]);
    //     }
    //     public function save(){
    //         self::start();
    //         $this -> session = $_SESSION;
    //         session_write_close();
    //         return $this -> session;
    //     }
    //     public function unsave(){
    //         self::start();
    //         $_SESSION = $this -> session;
    //     }
    // }


    // //SessionIdInterface
    // class MySessionHandler extends DataBase implements SessionHandlerInterface, SessionIdInterface {
    //     private $savePath = "C:\\";
    //     public function open($savePath = null, $sessionName): bool {
    //         // $this -> savePath = $savePath;
    //         // if (!is_dir($this -> savePath)) {
    //         //     mkdir($this -> savePath, 0777);
    //         // }
    //         return true;
    //     }
    //     private function getNextFreeId(){
    //         return md5(microtime(true));
    //     }
    //     public function create_sid(): string{
    //         return "session_" . $this -> getNextFreeId();
    //     }
    
    //     public function close(): bool {
    //         return true;
    //     }
    
    //     #[ReturnTypeWillChange]
    //     public function read($SessionID) {
    //         error_log(SessionDB::get($SessionID));
    //         return SessionDB::get($SessionID);
    //     }
    
    //     public function write($SessionID, $data): bool {
    //         SessionDB::Edit($data, $SessionID);
    //         // SessionDB::Add($data);
    //         return true;
    //     }
    
    //     public function destroy($SessionID): bool {
    //         SessionDB::Remove($SessionID);
    //         return true;
    //     }
    
    //     #[ReturnTypeWillChange]
    //     public function gc($maxlifetime) {
    //         foreach (glob("$this->savePath/sess_*") as $file) {
    //             if (filemtime($file) + $maxlifetime < time() && file_exists($file)) {
    //                 unlink($file);
    //             }
    //         }
    //         return true;
    //     }
    // }
    


    // class SessionDB extends DataBase {
    //     public static $TBName     = "sessions";
    //     public static $DBName     = "sessions";
    //     public static $SessionID;
    //     public static $key;
    //     const SESSION_ID          = "SessionID";
    //     const VALUE               = "value";
    //     const DATETIME            = "Datetime";
      
    //     public function __construct($SessionID = null){
    //         self::$SessionID      = $SessionID;
    //     }
    //     private static function getStructure(){
    //       $dataset = new DataSet();
    //       $dataset -> newEntry(self::SESSION_ID,    "VARCHAR(40)");
    //       $dataset -> newEntry(self::VALUE,         "TEXT");
    //       $dataset -> newEntry(self::DATETIME,      "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    //       $dataset -> primaryKey(self::SESSION_ID);
    //       $dataset -> TBName(self::$TBName);
    //       return $dataset;
    //     }
    //     public static function get($SessionID = null, ...$EntryNames){
    //         $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
    //         return self::getData(self::$TBName, $con, self::SESSION_ID, "session_" . $SessionID, ...$EntryNames);
    //     }
    //     public static function Edit($value, $SessionID){
    //         $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
    //         self::checkNull($SessionID, self::$SessionID);
    //         $dataset = new DataSet();
    //         $dataset -> newEntry(self::VALUE, $value);
    //         self::editData(self::$TBName, $con, $dataset -> get(), self::SESSION_ID, "session_" . $SessionID);
    //     }
    //     public static function Add($value){
    //         $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
    //         $SessionHandler = new MySessionHandler();
    //         $dataset = new Dataset();
    //         $dataset -> newEntry(self::SESSION_ID, $SessionHandler -> create_sid());
    //         $dataset -> newEntry(self::VALUE,       $value);
    //         $dataset -> TBName(self::$TBName);
    //         self::AddData($dataset, $con);
    //     }
    //     public static function Remove($SessionID = null){
    //         $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
    //         self::checkNull($SessionID, self::$SessionID);
    //         $dataset = new DataSet();
    //         $dataset -> newEntry(self::SESSION_ID, "session_" . $SessionID);
    //         $dataset -> TBName(self::$TBName);
    //         self::removeData($dataset, $con);
    //     }
    //   }
?>