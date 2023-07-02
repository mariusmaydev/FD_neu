<?php namespace test;

    use test\File\File_DeepScan;
    use test\File\PathObjectTypes;
    use test\File\PathObjectFormat;

    require_once './assets/File_DeepScan.php';
    require_once './assets/Communication.php';

    class test {
        public static function test(string $path, array $extensions = [], bool $print = true){
            $file1 = realpath($_SERVER["DOCUMENT_ROOT"] . $path);
            $fileMap = File_DeepScan::scanDir($file1);
            $PathObjExt = File_DeepScan::searchFilesWithExtensions($fileMap, ...$extensions);

            $res = $PathObjExt -> get(PathObjectTypes::FILE_NAME_TO_PATH_DETAILED, PathObjectFormat::WEB);
            Communication::sendBack($res, true, $print);
            return $res;
        }
    }