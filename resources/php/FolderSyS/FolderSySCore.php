<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    $folder = "fd";
    $SSL1   = "";


    class zipHelper {
        public static function save(string $folder, string $target){
            // Get real path for our folder
            $rootPath = realpath($folder);

            // Initialize archive object
            $zip = new ZipArchive();
            $zip->open($target . '.3mf', ZipArchive::CREATE | ZipArchive::OVERWRITE);

            // Create recursive directory iterator
            /** @var SplFileInfo[] $files */
            $files = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($rootPath),
                RecursiveIteratorIterator::LEAVES_ONLY
            );

            foreach ($files as $name => $file){
                // Skip directories (they would be added automatically)
                if (!$file->isDir()){
                    // Get real and relative path for current file
                    $filePath = $file->getRealPath();
                    $relativePath = substr($filePath, strlen($rootPath) + 1);
                    $relativePath = str_replace('\\', '/', $relativePath);

                    // Add current file to archive
                    $zip->addFile($filePath, $relativePath);
                }
            }

            // Zip archive will be created only after closing object
            $zip->close();
        }
    }

    function DataCopy(string $pathDist, string $pathSrc) : bool {
        return copy($pathSrc, $pathDist);        
    }
    function DataCreatePath($path){
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
    }
    function DataEdit($path, $file, $content = null){
        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }
        if ($content != null) {
            $fp = fopen($path . "/" . $file, "w");
            fwrite($fp, $content);
            fclose($fp);
        }
    }
    // function DataEdit_context($path, $file, $content = null){
    //     $data = http_build_query($data);

    //     $context_options = array (
    //             'http' => array (
    //                 'method' => 'POST',
    //                 'header'=> "Content-type: application/x-www-form-urlencoded\r\n"
    //                     . "Content-Length: " . strlen($data) . "\r\n",
    //                 'content' => $data
    //                 )
    //             );

    //     $context = stream_context_create($context_options);
    //     $fp = fopen('https://url', 'r', false, $context);
    //     if (!file_exists($path)) {
    //         mkdir($path, 0777, true);
    //     }
    //     if ($content != null) {
    //         $fp = fopen($path . "/" . $file, "w");
    //         fwrite($fp, $content);
    //         fclose($fp);
    //     }
    // }



    function DataGet($path, $file = null){
        global $folder;
        global $SSL1;
        
        if($file == null){
            if(file_exists($path)){
                return file_get_contents($path);
            }
        } else {
            $fullPath = $SSL1.realpath($_SERVER["DOCUMENT_ROOT"]) . "/" .$folder . "/data/" . $path;
            if (file_exists($fullPath . "/" . $file)) {
                return file_get_contents($fullPath . "/" . $file);
            }
            if(file_exists($path . $file)){
                return file_get_contents($path . $file);
            }
        }

    }

    function DataRemove($path, $file = null){
        if($file == null){
            deleteDirectory($path);
            return;
        }
        if(file_exists($path . $file)){
            unlink($path . $file);
        }
        if(is_dir_empty($path)){
            mkdir($path);
        }
    }

    function is_dir_empty($dir) {
        if (!is_readable($dir)){
            return false;
        } else {
            return (count(scandir($dir)) == 2);
        }
    }

    function deleteDirectory($dir) {
        if (!file_exists($dir)) {
            return true;
        }
        if (!is_dir($dir)) {
            return unlink($dir);
        }
        foreach (scandir($dir) as $item) {
            if ($item == '.' || $item == '..') {
                continue;
            }
            if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
                return false;
            }
        }
        return rmdir($dir);
    }
?>