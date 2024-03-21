<?php
    require_once 'converter.php';
    require_once 'DSController.php';
    
    switch(Communication::getAccess()){
        case "FILTER"                        : Converter::filter(); break;
        case "FLIP"                          : Converter::flip(); break;
        case "CREATE"                        : Converter::create($_POST[Converter::USER_ID], $_POST[Converter::PROJECT_ID]); break;
        case "CREATE_LITHOPHANE"             : Converter::createLithopane(); break;
        case "SAVE.ALL"                      : DSController::saveAll(); break;
        case "GET.ALL"                       : DSController::getAll(); break;
        case "GEN_FRAME"                     : Converter::genFrame($_POST[Converter::USER_ID], $_POST[Converter::PROJECT_ID]); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>