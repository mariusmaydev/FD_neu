<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class TextArchiveDB extends DataBase {
        public static $TBName     = "";
        public static $DBName     = "converter_texts_archive";
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
          $dataset -> newEntry(self::FONT_SIZE,         "VARCHAR(255)");
          $dataset -> newEntry(self::FONT_WEIGHT,       "VARCHAR(255)");
          $dataset -> newEntry(self::FONT_STYLE,        "VARCHAR(255)");
          $dataset -> newEntry(self::FONT_ALIGN,        "VARCHAR(255)");
          $dataset -> newEntry(self::TEXT_ORIENTATION,  "VARCHAR(255)");

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