<?php
    // $l1 = microtime(true);
    require_once 'userdata.php';
    // $l2 = microtime(true);
    // file_put_contents(PATH_error_log_debugg, round(($l2 - $l1), 3).PHP_EOL, FILE_APPEND );
    // TIMER -> start();
    // TIMER -> print();
    // file_put_contents(PATH_error_log_debugg, ("start").PHP_EOL, FILE_APPEND );
    switch(Communication::getAccess()){
        case "ADD"                          : userdata_functions::addData(); break;
        case "REMOVE"                       : userdata_functions::remove(); break;
        case "REMOVE_IMAGE"                 : userdata_functions::removeImage($_POST[ImageDB::IMAGE_ID]); break;
        case "EDIT"                         : userdata_functions::editData(); break;
        case "GET_IMAGE"                    : userdata_functions::getImage(); break;
        case "GET"                          : userdata_functions::getData(); break;
        case "GET_ALL_USERIDATA"            : userdata_functions::getAllUserData(); break;
        case "CART_ADD"                     : shoppingCart::add($_POST[ProjectDB::PROJECT_ID], $_POST["amount"]); break;
        case "CART_GET"                     : shoppingCart::get(); break;
        case "SHOPPINGCART_CLEAR"           : shoppingCart::clear(); break;
        case "SHOPPINGCART_REMOVE_ITEM"     : shoppingCart::removeItem($_POST[ProjectDB::PROJECT_ID]); break;
        case "SHOPPINGCART_CHANGE_AMOUNT"   : shoppingCart::changeItemAmount($_POST[ProjectDB::PROJECT_ID], $_POST["amount"]); break;
        case "SHOPPINGCART_COPY_PROJECT"    : shoppingCart::copy(); break;
        default: print_r("METHOD_ERROR"); exit;
    }
    // $l3 = microtime(true);
    // file_put_contents(PATH_error_log_debugg, round(($l3 - $l1), 3).PHP_EOL, FILE_APPEND );
    // // TIMER -> end();
?>