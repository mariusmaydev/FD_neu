<?php
    require_once 'login.php';
    
    switch(Communication::getAccess()){
        case "REMOVE_ACCOUNT"           : user_account::remove($_POST[login::USER_ID]); break;
        case "GET_DATA"                 : login_C::getData($_POST[login::USER_ID]); break;
        case "LOGIN"                    : login_C::nloginGuest(); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>