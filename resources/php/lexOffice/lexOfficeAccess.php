<?php
    require_once 'lexOffice.php';
    
    switch(Communication::getAccess()){
        case "NEW_INVOICE"              : lexOffice::newInvoice($_POST["data"], $_POST["OrderID"]); break;
        case "NEW_DELIVERY_NOTE"        : lexOffice::newDeliveryNote($_POST["data"], $_POST["OrderID"]); break;
        default: print_r("METHOD_ERROR"); exit;
    }