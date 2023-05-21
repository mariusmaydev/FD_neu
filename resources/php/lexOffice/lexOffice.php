<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/order/order.php';
    require_once $rootpath.'/fd/resources/php/lexOffice/lexOfficeHelper.php';


    class lexOffice {
        public static function newContact(){

        }
        public static function editContact(){

        }
        public static function newInvoice($data, $orderID){
            $res = lexOffice_Helper::call("v1/invoices?finalize=true", $data);
            order::saveInvoicePDF(self::getInvoicePDF($res["id"]), $orderID);
        }
        private static function getInvoicePDF($InvoiceID){
            $res = lexOffice_Helper::call("v1/invoices/" . $InvoiceID . "/document", null, false);
            return lexOffice_Helper::getFile($res["documentFileId"]);
        }
        public static function newDeliveryNote($data, $orderID){
            $data["title"]          = "Lieferschein";
            $data["introduction"]   = "Lieferschein zur Rechnung " . $orderID;
            $data["archived"]       = false;
            $res = lexOffice_Helper::call("v1/delivery-notes", $data);
            order::saveDeliveryNotePDF(self::getDeliveryNotePDF($res["id"]), $orderID);
        }
        private static function getDeliveryNotePDF($DeliveryNoteID){
            $res = lexOffice_Helper::call("v1/delivery-notes/" . $DeliveryNoteID . "/document", null, false);
            return lexOffice_Helper::getFile($res["documentFileId"]);
        }
    }
