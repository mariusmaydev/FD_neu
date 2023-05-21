<?php
    require_once 'hashtags.php';

    switch(Communication::getAccess()){
        case "ADD_TAG"              : hashtags::add($_POST["names"]); break;
        case "REMOVE_TAG"           : hashtags::remove($_POST["name"]); break;
        case "GET_TAG"              : hashtags::get($_POST["name"]); break;
        case "EDIT_TAG"             : hashtags::edit($_POST["name"]); break;
        case "EXIST_TAG"            : hashtags::get($_POST["name"]); break;
        default: print_r("METHOD_ERROR"); exit;
    }
?>