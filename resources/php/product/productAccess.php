<?php

    require_once 'product.php';

    switch(Communication::getAccess()){
        case "NEW"              : Product::new(); break;
        case "REMOVE"           : Product::remove(); break;
        case "EDIT"             : Product::edit(); break;
        case "GET"              : Product::get(); break;
        case "GET_DATA"         : Product::getData(); break;
        case "REMOVE_IMG"       : Product::removeImage($_POST[ProductDB::PRODUCT_ID], $_POST["ImageID"]); break;
        default: print_r("METHOD_ERROR"); exit;
    }