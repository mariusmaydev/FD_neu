<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    // include $rootpath . '/Splint/php/autoloader.php';

    // Debugg::log("ok");
    // include $rootpath.'/fd/resources/php/CORE.php';
    include $rootpath.'/Splint/Splint.php';
 
    // class Scripts {
    //     public static function bindBase(){
    //         FileBinder::bind('js', 'GLOBAL', 'Paths.js');
    //         Splint::bindJS();
    //         LibraryBinder::loadThreeJS();
    //         APILinks::bind_jQuery();
    //         FileBinder::bindModule('js', '3D', 'modules', 'module_3D_init.js');
    //         FileBinder::bind('js', 'GLOBAL', 'global_Helper.js');
    //         FileBinder::bind('js', 'GLOBAL', 'global_Helper_elements.js');
    //         FileBinder::bind('js', 'GLOBAL', 'UserData.js');
    //         FileBinder::bind('js', 'Login', 'LoginHelper.js');
    //         // FileBinder::bind('js', 'Pages', 'profile', 'profileHelper.js');
    //         FileBinder::bind('js', 'assets', 'functionsShoppingCart.js');
    //         // FileBinder::bind('js', 'Login', 'Google.js');
    //         // FileBinder::bindLink("https://accounts.google.com/gsi/client");
    //     }
    //     public static function bindExecuter(){
    //         FileBinder::bind('js', 'NavigationBar.js');
    //         FileBinder::bind('js', 'Eventhandler.js');
    //     }
    //     public static function bindModules($modules){
    //         Scripts::bindBase();
    //         $modules();
    //         Scripts::bindExecuter();
    //     }
    // }

    // class Styles {
    //     public static function bindBase(){
    //         // FileBinder::bind('css', 'Output', 'icons.css');
    //         APILinks::bind_GoolgeIcons();
    //         Splint::bindCSS();
    //     }
    //     public static function bindStyles($modules){
    //         Styles::bindBase();
    //         $modules();
    //     }
    // }//https://www.paypal.com/sdk/js?client-id=AcY69ITexNWNGhhjCZTpjHIyM-KiqjWbTaACjMNj5SLRvXd8fMKysveevIZ4fffuBXEevk5Jf_LDw0nw&components=buttons,payment-fields,marks,funding-eligibility&enable-funding=giropay&currency=EUR

    // function IMPLEMENT_PayPal(){
    //     $client_ID = "AcY69ITexNWNGhhjCZTpjHIyM-KiqjWbTaACjMNj5SLRvXd8fMKysveevIZ4fffuBXEevk5Jf_LDw0nw";
    //     // echo "<script src='https://www.paypal.com/sdk/js?client-id=" . $client_ID . "&enable-funding=venmo&currency=EUR' data-sdk-integration-source='button-factory'></script>";
    //     echo "<script src='https://www.paypal.com/sdk/js?client-id=" . $client_ID . "&components=buttons,payment-fields,marks,funding-eligibility&enable-funding=giropay&currency=EUR'></script>";
    // }

    // function PaypalMeta(){
    //     echo "<meta http-equiv='X-UA-Compatible' content='IE=edge' />";
    //     //mobileRendering
    //     echo "<meta name='viewport' content='width=device-width, initial-scale=1'>";
    // }
?>