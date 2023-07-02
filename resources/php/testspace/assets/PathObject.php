<?php namespace test\File;

    enum PathObjectFormat {
        /**
         * @return "http://localhost/your/path"
         */
        case WEB;
        /**
         * @return "C:\\xampp\\htdocs\\your\\path"
         */
        case LOCALE;
    }
    enum PathObjectTypes {
        /**
         * @example array(
         *      [0] = "path\to\file1.ext",
         *      [1] = "path\to\file2.ext",
         *      ...
         * )
         */
        case PATH_LIST;

        /**
         * @example array(
         *      [0] = array(
         *              ["dirname"]     => "path\to",
         *              ["basename"]    => "file1.ext",
         *              ["extension"]   => "ext",
         *              ["filename"]    => "file1",
         *              ["path"]        => "path\to\file1.ext",
         *          ),
         *      [1] = array(
         *              ["dirname"]     => "path\to",
         *              ["basename"]    => "file2.ext",
         *              ["extension"]   => "ext",
         *              ["filename"]    => "file2",
         *              ["path"]        => "path\to\file2.ext",
         *          ),
         *      ...
         * )
         */
        case PATH_LIST_DETAILED;

        /**
         * @example array(
         *      ["file1"] = "path\to\file1.ext",
         *      ["file2"] = "path\to\file2.ext",
         *      ...
         * )
         */
        case FILE_NAME_TO_PATH;

        /**
         * @example array(
         *      ["file1"] = array(
         *              ["dirname"]     => "path\to",
         *              ["basename"]    => "file1.ext",
         *              ["extension"]   => "ext",
         *              ["path"]        => "path\to\file1.ext",
         *          ),
         *      ["file2"] = array(
         *              ["dirname"]     => "path\to",
         *              ["basename"]    => "file2.ext",
         *              ["extension"]   => "ext",
         *              ["path"]        => "path\to\file2.ext",
         *          ),
         *      ...
         * )
         */
        case FILE_NAME_TO_PATH_DETAILED;
    }
    class PathObject {
        public $arr = [];
        public $type = PathObjectTypes::PATH_LIST;
        public function __construct(){}
        public function removeByExtension(string ...$ext) : void {
            foreach($this -> arr as $key => $value){
                if(in_array($value["extension"], $ext)){
                    unset($this -> arr[$key]);
                }
            }
        }
        public function removeByName(string $fileName) : void {
            foreach($this -> arr as $key => $value){
                if($value["fileName"] == $fileName){
                    unset($this -> arr[$key]);
                }
            }
        }
        public function push(string $path) : void {
            $path = str_replace('\\\\', '\\', $path);
            $res = pathinfo($path);
            $res["path"] = $path;
            array_push($this -> arr, $res); 
        }
        public function get(PathObjectTypes $type = PathObjectTypes::PATH_LIST, PathObjectFormat $format = PathObjectFormat::WEB) : array {
            $origin = $_SERVER['HTTP_ORIGIN'];
            switch($type){
                case PathObjectTypes::PATH_LIST : {
                    $res = [];
                    foreach($this -> arr as $key => $value){
                        if($format == PathObjectFormat::WEB){
                            $p = \str_replace("\\", "/", $value["path"]);
                            $p = \str_replace($_SERVER["DOCUMENT_ROOT"], $origin, $p["path"]);
                        }
                        \array_push($res, $p);
                    }
                    return $res;
                }; break;
                case PathObjectTypes::PATH_LIST_DETAILED : {
                    $res = [];
                    foreach($this -> arr as $key => $value){
                        $p = $value;
                        if($format == PathObjectFormat::WEB){
                            $p["path"] = \str_replace("\\", "/", $value["path"]);
                            $p["dirname"] = \str_replace("\\", "/", $value["dirname"]);
                            $p["path"] = \str_replace($_SERVER["DOCUMENT_ROOT"], $origin, $p["path"]);
                            $p["dirname"] = \str_replace($_SERVER["DOCUMENT_ROOT"], $origin, $p["dirname"]);
                        }
                        \array_push($res, $p);
                    }
                    return $res;
                }; break;
                case PathObjectTypes::FILE_NAME_TO_PATH : {
                    $res = [];
                    foreach($this -> arr as $key => $value){
                        if($format == PathObjectFormat::WEB){
                            $p = \str_replace("\\", "/", $value["path"]);
                            $p = \str_replace($_SERVER["DOCUMENT_ROOT"], $origin, $p["path"]);
                        }
                        $res[$value["filename"]] = $p;
                    }
                    return $res;
                }; break;
                case PathObjectTypes::FILE_NAME_TO_PATH_DETAILED : {
                    $res = [];
                    foreach($this -> arr as $key => $value){
                        $v = $value;
                        unset($v["filename"]);
                        if($format == PathObjectFormat::WEB){
                            $v["path"] = \str_replace("\\", "/", $value["path"]);
                            $v["dirname"] = \str_replace("\\", "/", $value["dirname"]);
                            $v["path"] = \str_replace($_SERVER["DOCUMENT_ROOT"], $origin, $v["path"]);
                            $v["dirname"] = \str_replace($_SERVER["DOCUMENT_ROOT"], $origin, $v["dirname"]);
                        }
                        $res[$value["filename"]] = $v;
                    }
                    return $res;
                }; break;

            }
        }
    }