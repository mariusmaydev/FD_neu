<?php
    require_once 'order.php';

    switch(Communication::getAccess()){
        case "NEW"              : order::new($_POST[OrderDB::ITEMS], $_POST[OrderDB::ADDRESS], $_POST[OrderDB::USER_ID]); break;
        case "EDIT"             : order::edit($_POST[OrderDB::ORDER_ID], $_POST[OrderDB::ITEMS]); break;
        case "REMOVE"           : order::remove($_POST[OrderDB::ORDER_ID]); break;
        case "GET"              : order::get($_POST[OrderDB::ORDER_ID], $_POST[OrderDB::USER_ID]); break;
        case "CREATE_ZIP"       : order::createZIP($_POST[OrderDB::ORDER_ID], $_POST[OrderDB::ADDRESS]); break;
        case "SET_STATE"        : order::setState($_POST[OrderDB::ORDER_ID], $_POST[OrderDB::STATE]); break;
        case "FINISH"           : order::finish($_POST[OrderDB::ITEMS], $_POST[OrderDB::ADDRESS], $_POST[OrderDB::USER_ID], $_POST[OrderDB::ORDER_ID]); break;
        case "GET_FROM_ARCHIVE" : OrderArchive::getOrder($_POST[OrderArchiveDB::ORDER_ID], $_POST[OrderArchiveDB::USER_ID]); break;
        default: print_r("METHOD_ERROR"); exit;
    }