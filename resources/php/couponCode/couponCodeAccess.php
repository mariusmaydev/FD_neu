<?php
    require_once 'couponCode.php';

    switch(Communication::getAccess()){
        case "CHECK"                : couponCode_functions::check(); break;
        case "ADD"                  : couponCode_functions::add($_POST["code"], $_POST["type"], $_POST["value"]); break;
        case "REMOVE"               : couponCode_functions::remove($_POST["code"]); break;
        case "GET"                  : couponCode_functions::get($_POST["code"], $_POST["type"]); break;
        default: Communication::sendBack("METHOD_ERROR"); exit;
    }
?>