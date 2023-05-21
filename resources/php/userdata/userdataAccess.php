<?php
    require_once 'userdata.php';
    switch(Communication::getAccess()){
        case "ADD"                          : userdata_functions::addData(); break;
        case "REMOVE"                       : userdata_functions::removeImage($_POST[ImageDB::IMAGE_ID]); break;
        case "EDIT"                         : userdata_functions::editData(); break;
        case "GET_IMAGE"                    : userdata_functions::getImage(Sessions::get(Sessions::USER_ID)); break;
        case "GET"                          : userdata_functions::getData(); break;
        // case "GET_FROM_SESSION"             : userdata_sessions::get(); break;
        case "SHOPPINGCART_ADD"             : shoppingCart::add($_POST["item"]); break;
        case "SHOPPINGCART_SET"             : shoppingCart::set(); break;
        case "SHOPPINGCART_GET"             : shoppingCart::get(); break;
        case "SHOPPINGCART_COPY_PROJECT"    : shoppingCart::copy(); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>