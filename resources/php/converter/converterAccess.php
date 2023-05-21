<?php
    require_once 'converter.php';

    switch(Communication::getAccess()){
        case "FILTER"                        : Converter::filter(); break;
        case "FLIP"                          : Converter::flip(); break;
        case "CREATE"                        : Converter::create($_POST[Converter::USER_ID], $_POST[Converter::PROJECT_ID]); break;
        case "CREATE_LITHOPHANE"             : Converter::createLithopane(); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>