<?php
    require_once 'database.php';

    switch(Communication::getAccess()){
        case "EXECUTE"          : \DataBase\DataBase_Access::execute($_POST[\DataBase\DataBase_access::COMMAND], $_POST[\DataBase\DataBase_access::DB_NAME]); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>