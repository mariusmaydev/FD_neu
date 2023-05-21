<?php
    require_once 'imageDesign.php';

    switch($_POST["METHOD"]){
        case "ADD"                  : imageDesign::add(); break;
        case "UPLOAD"               : imageDesign::upload(); break;
        case "REMOVE"               : imageDesign::remove(); break;
        case "EDIT"                 : imageDesign::edit(); break;
        case "GET"                  : imageDesign::get(); break;
        case "COPY_TO_PROJECT"      : imageDesign::copyToProject(); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>