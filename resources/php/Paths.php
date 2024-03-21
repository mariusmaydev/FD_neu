<?php
    $folder = "fd";
    $SSL    = $_SERVER["REQUEST_SCHEME"];
    $SSL1   = "";
    $GLOBALS["SSL"]     = $_SERVER["REQUEST_SCHEME"];
    $GLOBALS["SSL1"]    = "";
    $GLOBALS["folder"]  = "fd";
    // $GLOBALS = array(
    //     'SSL1' => "",
    //     'SSL' => $_SERVER["REQUEST_SCHEME"],
    //     'folder' => "fd"
    // );

    class PATHS {
        protected static $GLOBALS;
        protected static $base;

        public function __construct(){
            global $GLOBALS;
            self::$GLOBALS      = $GLOBALS;
            self::$base         = $GLOBALS['SSL1'].$_SERVER["DOCUMENT_ROOT"];
        }

        protected static function checkNull(&$function_var, $construct_var){
            if($function_var == null){
                $function_var = $construct_var;
            }
            return $function_var;
        }   
        protected static function returnIf($value, $flag){
            if($flag == true){
                return $value;
            }
            return "";
        }   
        protected static function init(){
            global $GLOBALS;
            self::$GLOBALS      = $GLOBALS;
            self::$base         = $GLOBALS['SSL1'] . $_SERVER["DOCUMENT_ROOT"];
        }
        public static function buildPath(string ...$files) : string {
            $output = '';
            foreach($files as $piece){
                $output .= $piece . "/";
            }
            return $output;
        }
        public static function parsePath(string $path) : string {
            return str_replace($GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]), "", $path);
        }
    }

    class PATH_Design extends PATHS {
        protected static $imgID;
        public static $FileName;

        const IMG_SCALE         = "Image_Scale";
        const IMG_VIEW          = "Image_View";

        public function __construct($imgID = null){
            global $GLOBALS;
            self::$imgID        = $imgID;
            self::$GLOBALS      = $GLOBALS;
            self::$base         = $GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]);
        }
        public static function getFile(){
            return self::$FileName;
        }
        public static function get($type = null, $DesignID = null){
            self::init();
            // self::checkNull($imgID, self::$imgID);
            self::$FileName = self::returnIf($type . ".blob", $type != null);
            return self::buildPath(self::$base, $GLOBALS['folder'], "data", "designs",  "designs", $DesignID) . self::$FileName;
        }
    }

    class PATH_Product extends PATHS {
        protected static $type;
        public static $FileName;

        public function __construct(){
            global $GLOBALS;
            self::$GLOBALS      = $GLOBALS;
            self::$base         = $GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]);
        }
        public static function getFileName($imgID = null, string $ext = ".png"){
            if($imgID != null){
                return $imgID . $ext;
            }
            return null;
        }
        public static function getFile(){
            return self::$FileName;
        }
        public static function get(string $productID, $imgID = null, string $ext = ""){
            self::init();
            self::$FileName = self::getFileName($imgID, $ext);
            return self::buildPath(self::$base, $GLOBALS['folder'], "data", "products" , $productID) . self::$FileName;
        }
    }

    class PATH_Project extends PATHS {
        protected static $UserID;
        protected static $ProjectID;
        protected static $type;
        public static $FileName;
        private static $folder;
        const NONE              = "NONE";
        const SVG               = "SVG";
        const NC                = "FullNC";
        const FRAME             = "FrameNC";
        const THUMBNAIL         = "thumbnail";
        const IMG_SCALE         = "Image_Scale";
        const IMG_VIEW          = "Image_View";
        const TEXT              = "Text"; 
        const TEXT_N            = "Text_N"; 

        public function __construct($UserID = null, $ProjectID = null){
            global $GLOBALS;
            self::$UserID       = $UserID;
            self::$ProjectID    = $ProjectID;
            self::$GLOBALS      = $GLOBALS;
            self::$base         = $GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]);
        }
        public static function getFileName($type, $arg = null, string $ext = ".binImg"){
            switch($type){
                case self::THUMBNAIL        : return "thumbnail.binImg";
                case self::TEXT             : return $type . "_" . $arg . $ext;
                case self::IMG_SCALE        : return $type . "_" . $arg . $ext;
                case self::IMG_VIEW         : return $type . "_" . $arg . $ext;
                case self::NC               : return "Full.nc";
                case self::FRAME            : return "Frame.nc";
                case self::SVG              : return "SVG.svg";
                default : return "";
            }
        }
        private static function folder($type){
            if($type == self::TEXT_N){
                return "texts/";
            } else if($type != self::THUMBNAIL && $type != self::NONE && $type != self::NC && $type != self::SVG&& $type != self::FRAME){
                return "images/";
            }
            return "";
        }
        public static function getFile(){
            return self::$FileName;
        }
        public static function get($type = null, $projectID = null, $userID = null, $imgID = null, string $ext = ".blob"){
            self::init();
            self::checkNull($userID, self::$UserID);
            self::checkNull($projectID, self::$ProjectID);

            self::$FileName = self::getFileName($type, $imgID, $ext);
            $f = self::buildPath(self::$base, $GLOBALS['folder'], "data", "Users",  $userID,  "projects", $projectID) . self::folder($type) . self::$FileName;
            return $f;
        }
    }

    class PATH_Userdata extends PATHS {
        protected static $UserID;
        protected static $ProjectID;
        protected static $imgID;
        public static $FileName;
        const IMG_SCALE         = "Image_Scale";
        const IMG_VIEW          = "Image_View";

        public function __construct($UserID = null, $imgID = null){
            global $GLOBALS;
            self::$imgID        = $imgID;
            self::$UserID       = $UserID;
            self::$GLOBALS      = $GLOBALS;
            self::$base         = $GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]);
        }
        public static function getFile(){
            return self::$FileName;
        }
        public static function get($type = null, $imgID = null, $userID = null){
            self::init();
            self::checkNull($userID, self::$UserID);
            self::checkNull($imgID, self::$imgID);
            self::$FileName = self::returnIf($type . ".png", $type != null);
            return self::buildPath(self::$base, $GLOBALS['folder'], "data", "Users",  $userID, "images", $imgID) . self::returnIf(self::$FileName, self::$UserID == null);
        }
    }

    class PATH_Design_Image extends PATHS {
        protected static $imgID;
        public static $FileName;
        const IMG_SCALE         = "Image_Scale";
        const IMG_VIEW          = "Image_View";

        public function __construct($imgID = null){
            global $GLOBALS;
            self::$imgID        = $imgID;
            self::$GLOBALS      = $GLOBALS;
            self::$base         = $GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]);
        }
        public static function getFile(){
            return self::$FileName;
        }
        public static function get($type = null, $imgID = null){
            self::init();
            self::checkNull($imgID, self::$imgID);
            self::$FileName = self::returnIf($type . ".png", $type != null);
            return self::buildPath(self::$base, $GLOBALS['folder'], "data", "designs", "images", $imgID) . self::returnIf(self::$FileName, self::$imgID == null);
        }
    }

    class PATH_HTML extends PATHS {
        protected static $baseHTML;
        protected static $Type;

        public function __construct(){
            global $GLOBALS;
            self::$GLOBALS      = $GLOBALS;
            self::$baseHTML     = $GLOBALS['SSL'] . '://' . $_SERVER['HTTP_HOST'];
        }
        protected static function init(){
            global $GLOBALS;
            self::$GLOBALS      = $GLOBALS;
            self::$baseHTML     = $GLOBALS['SSL'] . '://' . $_SERVER['HTTP_HOST'];
        }
        public static function buildPathJS(string ...$files){
            $output = self::buildPath(self::$baseHTML, $GLOBALS['folder'], 'resources', 'js');
            $flag = true;
            foreach($files as $piece){
                if ($flag) {
                    $output .= $piece;
                    $flag = false;
                    continue;
                }
                $output .= "/" . $piece;
            }
            return $output;
        }
        public static function get(string ...$type){ 
            self::init();
            return self::buildPathJS(...$type) ;//. "?v=1.0";
        }
        public static function getFolder(string ...$type){ 
            self::init();
            return self::buildPath($GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]), $GLOBALS['folder'], 'resources', 'js', ...$type);
        }
        public static function getModules(string ...$type){      
            self::init();       
            $output = self::buildPath(self::$baseHTML, $GLOBALS['folder'], 'node_modules');
            $flag = true;
            foreach($type as $piece){
                if ($flag) {
                    $output .= $piece;
                    $flag = false;
                    continue;
                }
                $output .= "/" . $piece;
            }
            return $output;
        }
    }

    class PATH_CSS extends PATHS {
        protected static $baseCSS;
        protected static $Type;

        public function __construct(){
            global $GLOBALS;
            self::$GLOBALS      = $GLOBALS;
            self::$baseCSS     = $GLOBALS['SSL'] . '://' . $_SERVER['HTTP_HOST'];
        }
        protected static function init(){
            global $GLOBALS;
            self::$GLOBALS      = $GLOBALS;
            self::$baseCSS     = $GLOBALS['SSL'] . '://' . $_SERVER['HTTP_HOST'];
        }
        protected static function buildPathCSS(string ...$files){
            $output = self::buildPath(self::$baseCSS, $GLOBALS['folder'], 'resources', 'css');
            $flag = true;
            foreach($files as $piece){
                if ($flag) {
                    $output .= $piece;
                    $flag = false;
                    continue;
                }
                $output .= "/" . $piece;
            }
            return $output;
        }
        public static function get(string ...$type){ 
            self::init();
            return self::buildPathCSS(...$type) . "?v=" . rand();

        }
    }
    