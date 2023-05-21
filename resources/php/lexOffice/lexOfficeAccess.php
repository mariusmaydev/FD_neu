<?php
    require_once 'lexOffice.php';

    switch($_POST["METHOD"]){
        case "NEW_CONTACT"              : lexOffice::newContact($_POST[OrderDB::ITEMS], $_POST[OrderDB::ADDRESS], $_POST[OrderDB::USER_ID]); break;
        case "EDIT_CONTACT"             : lexOffice::editContact($_POST[OrderDB::ITEMS] , $_POST[OrderDB::ORDER_ID]); break;
        case "NEW_INVOICE"              : lexOffice::newInvoice($_POST["data"], $_POST["OrderID"]); break;
        case "NEW_DELIVERY_NOTE"        : lexOffice::newDeliveryNote($_POST["data"], $_POST["OrderID"]); break;
        default: print_r("METHOD_ERROR"); exit;
    }