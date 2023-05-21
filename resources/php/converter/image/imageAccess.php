<?php
    require_once 'image.php';
    switch(Communication::getAccess()){
        case "ADD"      : Image::add(); break;
        case "EDIT"     : Image::edit(); break;
        case "GET"      : Image::get($_POST[ImageDB::IMAGE_ID], $_POST[Converter::PROJECT_ID], $_POST[Converter::USER_ID]); break;
        case "REMOVE"   : Image::remove(); break;
        case "COPY"     : Image::copy(); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>