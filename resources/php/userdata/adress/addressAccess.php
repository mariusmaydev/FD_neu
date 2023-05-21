<?php
    require_once 'address.php';

    switch(Communication::getAccess()){
        case "ADD"                      : Address::add(); break;
        case "REMOVE"                   : Address::remove(); break;
        case "GET"                      : Address::get(); break;
        case "EDIT"                     : Address::edit(); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>