<?php
    require_once 'project.php';

    switch(Communication::getAccess()){
        case "NEW"              : Project::new($_POST[ProjectDB::PROJECT_NAME], $_POST[ProjectDB::PRODUCT], $_POST[ProjectDB::COLOR], null, null, true, $_POST[ProjectDB::ORIGINAL]); break;
        case "REMOVE"           : Project::remove($_POST[ProjectDB::PROJECT_ID]); break;
        case "EDIT"             : Project::edit($_POST["Storage"]); break;
        case "GET"              : Project::get($_POST[ProjectDB::PROJECT_ID], $_POST[Converter::USER_ID]); break;
        case "GET_ALL"          : Project::getAll(null, $_POST["State"]); break;
        case "GET_ALL_ADMIN"    : Project::getAllAdmin($_POST[ProjectDB::ORIGINAL]); break;
        case "CHANGE_STATE"     : Project::changeState(); break;
        case "COPY"             : Project::copy($_POST[ProjectDB::PROJECT_ID], null, null, $_POST["FromUserID"]); break;
        case "GET_FROM_ARCHIVE" : ProjectArchive::get($_POST[ProjectArchiveDB::PROJECT_ID], $_POST[Converter::USER_ID], $_POST[OrderArchiveDB::ORDER_ID]); break;
        case "REMOVE_FROM_DESIGN"   : Project::removeFromDesign($_POST["Hashtags"], $_POST["Categories"], $_POST[ProjectDB::PROJECT_ID], $_POST[Converter::USER_ID]); break;
        case "ADD_TO_DESIGN"    : Project::addToDesign($_POST["Hashtags"], $_POST["Categories"], $_POST[ProjectDB::PROJECT_ID], $_POST[Converter::USER_ID]); break;

        default: Communication::sendBack("METHOD_ERROR"); exit;
    }
?>