<?php namespace test\File;

// use test;

    include_once 'PathObject.php';

    class File_DeepScan {
        public static $allFiles = [];
        public static function scanDir(string $dir = __DIR__) : string|array {
            self::$allFiles = [];
            return self::p_scanDir($dir);
        }
        /**
         * Undocumented function
         *
         * @param  string $dir path to dir
         * @return array of paths
         */
        private static function p_scanDir(string $dir = __DIR__) : string|array {
            self::$allFiles[$dir] = [];
          
            $directories = array_values(array_diff(scandir($dir), ['.', '..']));
            foreach($directories as $directory){
                if(is_dir("$dir\\$directory")){
                    foreach(self::p_scanDir("$dir\\$directory") as $key => $value) self::$allFiles[$key] = $value;
                } else{
                    self::$allFiles[$dir][] = "$directory";
                }
            }
            return self::$allFiles;
        }
        public static function searchFilesWithExtensions(array $fileMap, string ...$ext) : PathObject {
            $pathObject = new PathObject();
            foreach($fileMap as $key => $value){
                foreach ($value as $name) {
                    if(isset(pathinfo($name)["extension"]) && in_array(pathinfo($name)["extension"], $ext)){
                        $path = $key . '\\' . $name;
                        $pathObject -> push(str_replace('\\\\', '\\', $path));
                        // $res = pathinfo(str_replace('\\\\', '\\', $path));
                        // $res["path"] = $path;

                        // array_push($t, $res);
                    }
                }
            }
            return $pathObject;
        }
        public static function searchFile(array $fileMap, string $fileName){
            foreach($fileMap as $key => $value){
                foreach ($value as $name) {
                    if($name == $fileName){
                        $path = $key . '\\'. $name;
                        // include_once str_replace('\\\\', '\\', $path);
                        return str_replace('\\\\', '\\', $path);
                    }
                }
            }
            return false;
        }
        public static function search(array $fileMap, string $className){
            foreach($fileMap as $key => $value){
                foreach ($value as $fileName) {
                    if($fileName == $className . '.php'){
                        $path = $key . '\\'. $fileName;
                        include_once str_replace('\\\\', '\\', $path);
                        return true;
                    }
                }
            }
            return false;
        }

    }