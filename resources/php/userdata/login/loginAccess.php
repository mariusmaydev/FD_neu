<?php
    require_once 'login.php';
    require_once 'login_Admin.php';
    
    switch(Communication::getAccess()){
        case "REMOVE_ACCOUNT"           : user_account::remove($_POST[login::USER_ID]); break;
        case "GET_DATA"                 : login_C::getData($_POST[login::USER_ID]); break;
        case "GET_ALL_DATA"             : login_C::getAllData(); break;
        case "LOGIN"                    : login_C::nloginGuest(); break;
        case "ADMIN.LOGIN.CREATE"       : login_admin::create(); break;
        case "ADMIN.LOGIN.CHECK"        : login_admin::check($_POST[login_adminDB::USER_NAME], $_POST[login_adminDB::PASSWORD]); break;
        case "ADMIN.LOGIN.LOGIN"        : login_admin::login($_POST[login_adminDB::USER_NAME], $_POST[login_adminDB::PASSWORD]); break;
        case "ADMIN.LOGIN.LOGOUT"       : login_admin::logout(); break;
        case "ADMIN.LOGIN.GETALL"       : login_admin::getAll(); break;
        case "ADMIN.LOGIN.REMOVE"       : login_admin::remove($_POST[login_adminDB::USER_ID]); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>