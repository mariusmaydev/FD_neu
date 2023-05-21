<?php
    require_once 'designs.php';

    switch($_POST["METHOD"]){
        case "GET"              : designs::get(); break;
        case "REMOVE"           : designs::remove(); break;
        case "NEW"              : designs::new(); break;
        case "EDIT"             : designs::edit(); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>