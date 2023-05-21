<?php
    require_once 'EMail.php';

    switch(Communication::getAccess()){
        case "ACCOUNT_VERIFICATION"     : accountVerification(); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>