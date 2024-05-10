<?php

use Shopify\Auth\Session;

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/converter.php';
    require_once 'textArchive.php';

    Class Text {
        public static function getCompressedID($UserID = null, $ProjectID = null){
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            if($ProjectID == null){
                $ProjectID = Sessions::get(Sessions::PROJECT_ID);
            }
            return $UserID . "_" . $ProjectID;
        }
        public static function add($data = null, $UserID = null, $projectID = null, $TextID = null, bool $print = true){
            if($data == null){
                $data = $_POST;
            }
            if($TextID == null){
                $TextID = StringTools::realUniqID();
            }
            $DataSet = new DataSet();
            $DataSet -> newEntry(TextDB::TEXT_ID,           $TextID);
            $DataSet -> newEntry(TextDB::TEXT_NAME,         $data[TextDB::TEXT_NAME]);
            $DataSet -> newEntry(TextDB::TEXT_VALUE,        $data[TextDB::TEXT_VALUE]);
            $DataSet -> newEntry(TextDB::TEXT_POS_X,        $data[TextDB::TEXT_POS_X]);
            $DataSet -> newEntry(TextDB::TEXT_POS_Y,        $data[TextDB::TEXT_POS_Y]);
            $DataSet -> newEntry(TextDB::TEXT_FRAME_HEIGHT, $data[TextDB::TEXT_FRAME_HEIGHT]);
            $DataSet -> newEntry(TextDB::TEXT_FRAME_WIDTH,  $data[TextDB::TEXT_FRAME_WIDTH]);
            $DataSet -> newEntry(TextDB::TEXT_ALIGN,        $data[TextDB::TEXT_ALIGN]);
            $DataSet -> newEntry(TextDB::TEXT_LINE_HEIGHT,  $data[TextDB::TEXT_LINE_HEIGHT]);
            $DataSet -> newEntry(TextDB::TEXT_ORIENTATION,  $data[TextDB::TEXT_ORIENTATION]);

            $DataSet -> newEntry(TextDB::FONT_FAMILY,       $data[TextDB::FONT_FAMILY]);
            $DataSet -> newEntry(TextDB::FONT_SIZE,         $data[TextDB::FONT_SIZE]);
            $DataSet -> newEntry(TextDB::FONT_WEIGHT,       $data[TextDB::FONT_WEIGHT]);
            $DataSet -> newEntry(TextDB::FONT_STYLE,        $data[TextDB::FONT_STYLE]);
            $DataSet -> newEntry(TextDB::FONT_ALIGN,        $data[TextDB::FONT_ALIGN]);
            $DataSet -> newEntry(TextDB::LINE_WIDTH,        $data[TextDB::LINE_WIDTH]);
            $DataSet -> TBName(self::getCompressedID($UserID, $projectID));
            TextDB::add($DataSet);
            Communication::sendBack($TextID, false, $print);
            return $TextID;
        }
        public static function get($TextID = null, $UserID = null, $ProjectID = null, bool $print = true){
            if($TextID == null){
                if(isset($_POST[TextDB::TEXT_ID]) && $_POST[TextDB::TEXT_ID] != null){
                    $TextID = $_POST[TextDB::TEXT_ID];
                }
            }
            $DataSet = new DataSet();
            if($TextID != null){
                $DataSet -> newKey(TextDB::TEXT_ID, $TextID);
            }
            $DataSet -> TBName(self::getCompressedID($UserID, $ProjectID));
            $TextData = TextDB::get($DataSet, DataBase::FORCE_ORDERED);
            $response = [];
            if($TextData != null && count($TextData)){
                for($i = 0; $i < count($TextData); $i++){
                    // getProjectImages($TextData[$i], Sessions::get(Sessions::USER_ID), Sessions::get(Sessions::PROJECT_ID), $TextData[$i][TextDB::IMAGE_ID]);
                    $response[$i] = $TextData[$i];
                    // $response[$i][TextDB::IMAGE_FILTER] = json_decode($TextData[$i][TextDB::IMAGE_FILTER]);
                }
            }
            Communication::sendBack($response, true, $print);
            return $response;
        }
        public static function new(){
            $TextID = StringTools::realUniqID();
            $DataSet = new DataSet();
            $DataSet -> newEntry(TextDB::TEXT_ID,           $TextID);
            $DataSet -> newEntry(TextDB::TEXT_NAME,         "neuer Text");
            $DataSet -> newEntry(TextDB::TEXT_VALUE,        "neuer Text");
            $DataSet -> newEntry(TextDB::TEXT_POS_X,        -1);
            $DataSet -> newEntry(TextDB::TEXT_POS_Y,        -1);
            $DataSet -> newEntry(TextDB::TEXT_FRAME_HEIGHT, -1);
            $DataSet -> newEntry(TextDB::TEXT_FRAME_WIDTH,  -1);
            $DataSet -> newEntry(TextDB::TEXT_ALIGN,        0);
            $DataSet -> newEntry(TextDB::TEXT_LINE_HEIGHT,  20);
            $DataSet -> newEntry(TextDB::TEXT_ORIENTATION,  "left");

            $DataSet -> newEntry(TextDB::FONT_FAMILY,       "O-Arial");
            $DataSet -> newEntry(TextDB::FONT_SIZE,         150);
            $DataSet -> newEntry(TextDB::FONT_WEIGHT,       100);
            $DataSet -> newEntry(TextDB::FONT_STYLE,        "normal");
            $DataSet -> newEntry(TextDB::FONT_ALIGN,        0);
            $DataSet -> newEntry(TextDB::LINE_WIDTH,        1);
            $DataSet -> TBName(self::getCompressedID());
            TextDB::add($DataSet);
            Text::get($TextID);
        }
        public static function saveTextImg(string|Imagick|GdImage $img, $TextID, $ProjectID, $UserID){
            $path = PATH_Project::get(PATH_Project::TEXT_N, $ProjectID, $UserID, $TextID);
            DataCreatePath($path);
            $path .= PATH_Project::getFileName(PATH_Project::TEXT, $TextID, ".png");
            if(gettype($img) == 'string'){
                file_put_contents($path, file_get_contents($img));
            } else {
                // file_put_contents($path, $img);
                if(Converter::isGD()){
                    imagepng($img, $path);
                } else {
                    $img -> writeImage($path);
                }
            }
            return str_replace($GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]), "", $path);
        }
        public static function getTextImg($TextID = null, $ProjectID = null, $UserID = null) : Imagick {
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            if($ProjectID == null){
                $ProjectID = Sessions::get(Sessions::PROJECT_ID);
            }
            $path = PATH_Project::get(PATH_Project::TEXT_N, $ProjectID, $UserID, $TextID);
            $path .= PATH_Project::getFileName(PATH_Project::TEXT, $TextID, ".png");
            $img = new Imagick();
            $img -> readImage($path);
            return $img;
        }
        public static function edit($Storage = null, bool $print = true){
            if($Storage == null){
                if(isset($_POST["Storage"])){
                    $Storage = $_POST["Storage"];
                } else {
                    Communication::sendBack(null, true, $print);
                    return null;
                }
            }
                // error_log(json_encode($Storage));
                if(count($Storage) > 0){
                    for($i = 0; $i < count($Storage); $i++){
                        $DataSet = new DataSet();
                        $TXT_DATA = $Storage[$i];
                        if($TXT_DATA[TextDB::TEXT_POS_X] == -1){
                            continue;
                        }
                        // if(isset($TXT_DATA[TextDB::TEXT_IMG])){
                        //     $image = new Imagick();
                        //     $image->readimageblob($TXT_DATA[TextDB::TEXT_IMG]);
                        //     self::saveTextImg($image, $TXT_DATA[TextDB::TEXT_ID], Sessions::get(Sessions::PROJECT_ID), Sessions::get(Sessions::USER_ID));
                        // }
                        $DataSet -> newKey(TextDB::TEXT_ID,             $TXT_DATA[TextDB::TEXT_ID]);
                        $DataSet -> newEntry(TextDB::TEXT_NAME,         $TXT_DATA[TextDB::TEXT_NAME]);
                        $DataSet -> newEntry(TextDB::TEXT_VALUE,        $TXT_DATA[TextDB::TEXT_VALUE]);
                        $DataSet -> newEntry(TextDB::TEXT_POS_X,        $TXT_DATA[TextDB::TEXT_POS_X]);
                        $DataSet -> newEntry(TextDB::TEXT_POS_Y,        $TXT_DATA[TextDB::TEXT_POS_Y]);
                        $DataSet -> newEntry(TextDB::TEXT_FRAME_WIDTH,  $TXT_DATA[TextDB::TEXT_FRAME_WIDTH]);
                        $DataSet -> newEntry(TextDB::TEXT_FRAME_HEIGHT, $TXT_DATA[TextDB::TEXT_FRAME_HEIGHT]);
                        $DataSet -> newEntry(TextDB::TEXT_ALIGN,        $TXT_DATA[TextDB::TEXT_ALIGN]);
                        $DataSet -> newEntry(TextDB::TEXT_LINE_HEIGHT,  $TXT_DATA[TextDB::TEXT_LINE_HEIGHT]);
                        $DataSet -> newEntry(TextDB::TEXT_ORIENTATION,  $TXT_DATA[TextDB::TEXT_ORIENTATION]);
            
                        $DataSet -> newEntry(TextDB::FONT_FAMILY,       $TXT_DATA[TextDB::FONT_FAMILY]);
                        $DataSet -> newEntry(TextDB::FONT_SIZE,         $TXT_DATA[TextDB::FONT_SIZE]);
                        $DataSet -> newEntry(TextDB::FONT_WEIGHT,       $TXT_DATA[TextDB::FONT_WEIGHT]);
                        $DataSet -> newEntry(TextDB::FONT_STYLE,        $TXT_DATA[TextDB::FONT_STYLE]);
                        $DataSet -> newEntry(TextDB::FONT_ALIGN,        $TXT_DATA[TextDB::FONT_ALIGN]);
                        $DataSet -> newEntry(TextDB::LINE_WIDTH,        $TXT_DATA[TextDB::LINE_WIDTH]);
                        $DataSet -> TBName(self::getCompressedID());
                        TextDB::Edit($DataSet);
                    }
                
                    Communication::sendBack(true, true, $print);
                    return true;
                } 
                Communication::sendBack(null, true, $print);
                return null;
            
        }
        public static function remove(){
            $DataSet = new DataSet();
            $DataSet -> newEntry(TextDB::TEXT_ID, $_POST[TextDB::TEXT_ID]);
            $DataSet -> TBName(self::getCompressedID());
            TextDB::remove($DataSet);
        }
        public static function copy($TextID){
            $data = self::get($TextID, Sessions::get(Sessions::USER_ID), Sessions::get(Sessions::PROJECT_ID), false);
            $text = $data[0];
                $NewTextID = StringTools::realUniqID();
                $DataSet = new DataSet();
                $DataSet -> newEntry(TextDB::TEXT_ID,                   $NewTextID);
                $DataSet -> newEntry(TextDB::TEXT_NAME,         $text[TextDB::TEXT_NAME]);
                $DataSet -> newEntry(TextDB::TEXT_VALUE,        $text[TextDB::TEXT_VALUE]);
                $DataSet -> newEntry(TextDB::TEXT_POS_X,        $text[TextDB::TEXT_POS_X]);
                $DataSet -> newEntry(TextDB::TEXT_POS_Y,        $text[TextDB::TEXT_POS_Y]);
                $DataSet -> newEntry(TextDB::TEXT_FRAME_HEIGHT, $text[TextDB::TEXT_FRAME_HEIGHT]);
                $DataSet -> newEntry(TextDB::TEXT_FRAME_WIDTH,  $text[TextDB::TEXT_FRAME_WIDTH]);
                $DataSet -> newEntry(TextDB::TEXT_ALIGN,        $text[TextDB::TEXT_ALIGN]);
                $DataSet -> newEntry(TextDB::TEXT_LINE_HEIGHT,  $text[TextDB::TEXT_LINE_HEIGHT]);
                $DataSet -> newEntry(TextDB::TEXT_ORIENTATION,  $text[TextDB::TEXT_ORIENTATION]);
    
                $DataSet -> newEntry(TextDB::FONT_FAMILY,       $text[TextDB::FONT_FAMILY]);
                $DataSet -> newEntry(TextDB::FONT_SIZE,         $text[TextDB::FONT_SIZE]);
                $DataSet -> newEntry(TextDB::FONT_WEIGHT,       $text[TextDB::FONT_WEIGHT]);
                $DataSet -> newEntry(TextDB::FONT_STYLE,        $text[TextDB::FONT_STYLE]);
                $DataSet -> newEntry(TextDB::FONT_ALIGN,        $text[TextDB::FONT_ALIGN]);
                $DataSet -> newEntry(TextDB::LINE_WIDTH,        $text[TextDB::LINE_WIDTH]);
                $DataSet -> TBName(self::getCompressedID(Sessions::get(Sessions::USER_ID), Sessions::get(Sessions::PROJECT_ID)));
                TextDB::add($DataSet);
            
            Communication::sendBack($NewTextID);
        }
        public static function copy2Archive($ProjectID, $UserID, $TextID = null){
            $data = self::get($TextID, $UserID, $ProjectID, false);
            foreach($data as $text){
                $DataSet = new DataSet();
                $DataSet -> newEntry(TextDB::TEXT_ID,           $text[TextDB::TEXT_ID]);
                $DataSet -> newEntry(TextArchiveDB::TEXT_NAME,         $text[TextDB::TEXT_NAME]);
                $DataSet -> newEntry(TextArchiveDB::TEXT_VALUE,        $text[TextDB::TEXT_VALUE]);
                $DataSet -> newEntry(TextArchiveDB::TEXT_POS_X,        $text[TextDB::TEXT_POS_X]);
                $DataSet -> newEntry(TextArchiveDB::TEXT_POS_Y,        $text[TextDB::TEXT_POS_Y]);
                $DataSet -> newEntry(TextArchiveDB::TEXT_FRAME_HEIGHT, $text[TextDB::TEXT_FRAME_HEIGHT]);
                $DataSet -> newEntry(TextArchiveDB::TEXT_FRAME_WIDTH,  $text[TextDB::TEXT_FRAME_WIDTH]);
                $DataSet -> newEntry(TextArchiveDB::TEXT_ALIGN,        $text[TextDB::TEXT_ALIGN]);
                $DataSet -> newEntry(TextArchiveDB::TEXT_LINE_HEIGHT,  $text[TextDB::TEXT_LINE_HEIGHT]);
                $DataSet -> newEntry(TextArchiveDB::TEXT_ORIENTATION,  $text[TextDB::TEXT_ORIENTATION]);
    
                $DataSet -> newEntry(TextArchiveDB::FONT_FAMILY,       $text[TextDB::FONT_FAMILY]);
                $DataSet -> newEntry(TextArchiveDB::FONT_SIZE,         $text[TextDB::FONT_SIZE]);
                $DataSet -> newEntry(TextArchiveDB::FONT_WEIGHT,       $text[TextDB::FONT_WEIGHT]);
                $DataSet -> newEntry(TextArchiveDB::FONT_STYLE,        $text[TextDB::FONT_STYLE]);
                $DataSet -> newEntry(TextArchiveDB::FONT_ALIGN,        $text[TextDB::FONT_ALIGN]);
                $DataSet -> newEntry(TextArchiveDB::LINE_WIDTH,        $text[TextDB::LINE_WIDTH]);
                $DataSet -> TBName(self::getCompressedID($UserID, $ProjectID));
                TextArchiveDB::add($DataSet);
            }
        }
    }

    class TextDB extends DataBase {
        public static $TBName     = "_";
        public static $DBName     = "converter_texts";
        public static $keyName;
        public static $key;
        const TEXT_ID               = "TextID";
        const TEXT_NAME             = "TextName";
        const TEXT_VALUE            = "TextValue";
        const TEXT_POS_X            = "TextPosX";
        const TEXT_POS_Y            = "TextPosY";
        const TEXT_ALIGN            = "TextAlign";
        const TEXT_LINE_HEIGHT      = "TextLineHeight";
        const TEXT_ORIENTATION      = "TextOrientation";

        const FONT_FAMILY           = "FontFamily";
        const FONT_SIZE             = "FontSize";
        const FONT_WEIGHT           = "FontWeight";
        const FONT_STYLE            = "FontStyle";
        const FONT_ALIGN            = "FontAlign";
        const LINE_WIDTH            = "LineWidth";

        const TEXT_IMG              = "TextImg";
        const TEXT_FRAME_WIDTH      = "FrameWidth";
        const TEXT_FRAME_HEIGHT     = "FrameHeight";
      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure($TBName){
          $dataset = new DataSet();
          $dataset -> newEntry(self::TEXT_ID,           "VARCHAR(40)");
          $dataset -> newEntry(self::TEXT_NAME,         "VARCHAR(40)");
          $dataset -> newEntry(self::TEXT_VALUE,        "VARCHAR(255)");
          $dataset -> newEntry(self::TEXT_POS_X,        "INTEGER(255)");
          $dataset -> newEntry(self::TEXT_POS_Y,        "INTEGER(255)");
          $dataset -> newEntry(self::TEXT_FRAME_WIDTH,  "INTEGER(255)");
          $dataset -> newEntry(self::TEXT_FRAME_HEIGHT, "INTEGER(255)");
          $dataset -> newEntry(self::TEXT_ALIGN,        "INTEGER(255)");
          $dataset -> newEntry(self::TEXT_LINE_HEIGHT,  "INTEGER(255)");

          $dataset -> newEntry(self::FONT_FAMILY,       "VARCHAR(255)");
          $dataset -> newEntry(self::FONT_SIZE,         "INTEGER(255)");
          $dataset -> newEntry(self::FONT_WEIGHT,       "INTEGER(255)");
          $dataset -> newEntry(self::FONT_STYLE,        "VARCHAR(255)");
          $dataset -> newEntry(self::FONT_ALIGN,        "INTEGER(255)");
          $dataset -> newEntry(self::TEXT_ORIENTATION,  "VARCHAR(255)");
          $dataset -> newEntry(self::LINE_WIDTH,        "INTEGER(255)");

          $dataset -> primaryKey(self::TEXT_ID);
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
        public static function removeTable(DataSet $DataSet){
            $TBName = self::$TBName . $DataSet -> TBName();
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure($TBName)));
            $DataSet -> TBName($TBName);
            self::dropTable($DataSet, $con);
        }
      }
?>