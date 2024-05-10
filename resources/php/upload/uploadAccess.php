<?php
    require_once 'upload.php';
    

    switch(Communication::getAccess()){
        case "CONVERTER_IMG"    : Upload::Converter_img(); break;
        case "UNSPLASH_IMG"     : Upload::Unsplash_img(); break;
        case "PRODUCT_IMG"      : Upload::Product_img(); break;
        case "TEXT_IMG"         : Upload::Text_img(); break;
        case "THUMBNAIL"        : Upload::Thumbnail(); break;
        default: Communication::sendBack("METHOD_ERROR"); exit;
    }
?>