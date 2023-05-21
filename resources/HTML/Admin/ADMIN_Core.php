<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    include $rootpath.'/fd/resources/HTML/HTML_Core.php';
    // include $rootpath.'/Splint/Splint.php';

    class ADMIN_Scrips {
        public function __construct(){
            
        }
        public static function bindBase(){
            LibraryBinder::loadThreeJS();
            FileBinder::bind('js', 'GLOBAL', 'Paths.js');
            FileBinder::bindFolder('js', 'ADMIN', 'assets');
            Splint::bindJS();
            FileBinder::bindLink("https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js");
            // FileBinder::bind('js', 'GLOBAL', 'icons.js');
            FileBinder::bind('js', 'GLOBAL', 'global_Helper.js');
            FileBinder::bind('js', 'GLOBAL', 'global_Helper_elements.js');
        }
        public static function bindExecuter(){
            FileBinder::bind('js', 'ADMIN', 'Eventhandler.js');
        }
        public static function bindModules($modules){
            ADMIN_Scrips::bindBase();
            $modules();
            ADMIN_Scrips::bindExecuter();
        }
    }

    class ADMIN_Styles {
        public static function bindBase(){
            APILinks::bind_GoolgeIcons();
            FileBinder::bind('css', 'Output', 'fonts.css');
        }
        public static function bindStyles($modules){
            ADMIN_Styles::bindBase();
            $modules();
        }
    }
?>