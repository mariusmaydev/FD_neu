<?php
    
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/image/image.php'; 
    require_once $rootpath.'/fd/resources/php/converter/text/text.php'; 
    require_once $rootpath.'/fd/resources/php/project/project.php';

    class DSController {
        public static function saveAll(){
            if(isset($_POST["img"])){
                Image::edit($_POST["img"], false);
            }
            if(isset($_POST["txt"])){
                Text::edit($_POST["txt"], false);
            }
            Project::edit($_POST["project"]);
            Communication::sendBack(true);
        }
        public static function getAll(){
            $res = new stdClass();
            $res -> img = Image::get(null, null, null, false);
            $res -> txt = Text::get(null, null, null, false);
            $res -> project = Project::get(null, null, false);
            Communication::sendBack($res);
        }
    }