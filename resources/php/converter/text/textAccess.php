<?php
    require_once 'text.php';

    switch(Communication::getAccess()){
        case "ADD"      : Text::add(); break;
        case "EDIT"     : Text::edit(); break;
        case "GET"      : Text::get(); break;
        case "NEW"      : Text::new(); break;
        case "REMOVE"   : Text::remove(); break;
        case "COPY"     : Text::copy($_POST[TextDB::TEXT_ID]); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>