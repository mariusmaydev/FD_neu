<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once '../converter/image/image.php';

    class designs {
        public static function new(){
            $DesignID = StringTools::realUniqID();
            $DataSet = new DataSet();
            $DataSet -> newEntry(DesignDB::DESIGN_ID,       $DesignID);
            $DataSet -> newEntry(DesignDB::DESIGN_DATA,     $_POST[DesignDB::DESIGN_DATA]);
            $DataSet -> newEntry(DesignDB::DESIGN_NAME,     $_POST[DesignDB::DESIGN_NAME]);
            if(isset($_POST[DesignDB::DESIGN_HASHTAGS])){
                $DataSet -> newEntry(DesignDB::DESIGN_HASHTAGS, $_POST[DesignDB::DESIGN_HASHTAGS]);
            }
            $DataSet -> newEntry(DesignDB::DESIGN_STATUS,   DesignDB::STATUS_NEW);
            DesignDB::add($DataSet);
            
            $PathProject = PATH_Project::get(null, Sessions::get(Sessions::PROJECT_ID), Sessions::get(Sessions::USER_ID));
            $PathDesign  = PATH_Design::get(null, $DesignID, null);

            $folderData = DataGetFolder($PathProject);
            foreach($folderData as $name){
                DataCreatePath($PathDesign);
                copy($PathProject . "/" . $name, $PathDesign . $name);
            }
            copy(PATH_Project::get(PATH_Project::THUMBNAIL, Sessions::get(Sessions::PROJECT_ID), Sessions::get(Sessions::USER_ID)), $PathDesign . "thumbnail.png");
            // $content = file_get_contents($PathDesign . "thumbnail.blob");
            // imagepng(imagecreatefromstring(base64_decode($content)), $PathDesign . "thumbnail.png");
            print_r($DesignID);
        }
        public static function get(){
            $DataSet = new DataSet();
            if(isset($_POST[DesignDB::DESIGN_ID])){
                $DataSet -> newKey(DesignDB::DESIGN_ID, $_POST[DesignDB::DESIGN_ID]);
            }
            $output = DesignDB::get($DataSet, DataBase::FORCE_ORDERED);
            if(isset($_POST["hashtags"])){
                $hashtags = $_POST["hashtags"];
                foreach($output as $e => $data){
                    $data = json_decode($data[DesignDB::DESIGN_HASHTAGS]);
                    if($data != null){
                        for($i = 0; $i < count($hashtags); $i++){
                            if(in_array($hashtags[$i], $data)){
                                break 2;
                            }
                        }
                        array_splice($output, $e, 1);
                    } else {
                        array_splice($output, $e, 1);
                    }
                }
            }
            if(isset($_POST["filter"]) && $_POST["filter"] != "ALL"){
                $filter = $_POST["filter"];
                if($output != null){
                    foreach($output as $e => $data){
                        if($filter != $data[DesignDB::DESIGN_STATUS]){
                            array_splice($output, $e, 1);
                        }
                    }
                }
            }
            // error_log(json_encode($output));
            if($output != null){
                foreach($output as $i => $data){
                    $path = PATH_Design::get(null, $output[$i][DesignDB::DESIGN_ID], null) . "thumbnail.png";
                    $output[$i]["PATH_thumbnail"] = str_replace($GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]), "", $path);
                }
            }
            print_r(json_encode($output));
        }
        public static function remove(){
            $DataSet = new DataSet();
            $DataSet -> newEntry(DesignDB::DESIGN_ID, $_POST[DesignDB::DESIGN_ID]);
            DesignDB::remove($DataSet);
        }
        public static function edit(){
            $data = $_POST["designObj"];
            $DataSet = new DataSet();
            $DataSet -> newEntry(DesignDB::DESIGN_DATA,     $data[DesignDB::DESIGN_DATA]);
            $DataSet -> newEntry(DesignDB::DESIGN_NAME,     $data[DesignDB::DESIGN_NAME]);
            $DataSet -> newEntry(DesignDB::DESIGN_HASHTAGS, $data[DesignDB::DESIGN_HASHTAGS]);
            $DataSet -> newEntry(DesignDB::DESIGN_STATUS,   $data[DesignDB::DESIGN_STATUS]);
            $DataSet -> newKey(DesignDB::DESIGN_ID,         $data[DesignDB::DESIGN_ID]);
            DesignDB::Edit($DataSet);
        }
    }

    class DesignDB extends DataBase {
        public static $TBName     = "designs";
        public static $DBName     = "designs";
        public static $keyName;
        public static $key;

        const STATUS_NEW        = "NEW";
        const STATUS_BLOCKED    = "BLOCKED";
        const STATUS_OPEN       = "OPEN";
        
        const DESIGN_ID         = "DesignID";
        const DESIGN_DATA       = "DesignData";
        const DESIGN_NAME       = "DesignName";
        const DESIGN_HASHTAGS   = "DesignHashtags";
        const DESIGN_STATUS     = "DesignStatus";
      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure(){
          $dataset = new DataSet();
          $dataset -> newEntry(self::DESIGN_ID,         "VARCHAR(40)");
          $dataset -> newEntry(self::DESIGN_NAME,       "VARCHAR(40)");
          $dataset -> newEntry(self::DESIGN_DATA,       "TEXT");
          $dataset -> newEntry(self::DESIGN_HASHTAGS,   "TEXT");
          $dataset -> newEntry(self::DESIGN_STATUS,     "VARCHAR(40)");
          $dataset -> primaryKey(self::DESIGN_ID);
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