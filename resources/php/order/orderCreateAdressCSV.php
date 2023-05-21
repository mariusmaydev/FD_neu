<?php
    require_once 'orderCore.php';
    require_once 'orderEdit.php';


    function createAddressCSV($OrderID){
        global $TBName_order;
        $invoice = null;
        $con = accessDB_orders($TBName_order);

        $res = selectTB($con, $TBName_order);
        $response = array();
        $sql = "SELECT * FROM $TBName_order WHERE OrderID = '$OrderID'";
        if ($res -> num_rows > 0) {
            while ($i = $res -> fetch_assoc()) {
                $response["shippingAddress"]      = $i["shippingAddress"];
                //$response["invoice"]       = $i["invoice"];
            }
            //print_r(json_encode($response));
        } else {
            //print_r(json_encode("empty"));
        }
        $con -> query($sql);
        $con -> close();

        $response = json_decode($response["shippingAddress"], true);
        $text = 'SEND_NAME1;SEND_NAME2;SEND_STREET;SEND_HOUSENUMBER;SEND_PLZ;SEND_CITY;SEND_COUNTRY;RECV_NAME1;RECV_NAME2;RECV_STREET;RECV_HOUSENUMBER;RECV_PLZ;RECV_CITY;RECV_COUNTRY;PRODUCT;COUPON;SEND_EMAIL' . "\r\n";
        $Absender           = "Funkendesign";
        $AB_Adressdetails   = "DHL Online Frankierung";
        $AB_Street          = "Wernsdorfer Straße";
        $AB_HouseNumber     = "27a";
        $AB_PLZ             = "09322";
        $AB_City            = "Penig";
        $AB_Country         = "DEU";

        $Empfaenger         = $response["FirstName"] . $response["LastName"];
        $EM_Adressdetails   = "-";
        $EM_Street          = $response["Street"];
        $EM_HouseNumber     = $response["HouseNumber"];
        $EM_PLZ             = $response["PLZ"];
        $EM_City            = $response["City"];
        if ($response["Country"] == 'Deutschland') {
            $EM_Country         = "DEU";
            $PacketType         = "PAECKS.DEU";
        } elseif ($response["Country"] == 'Österreich') {
            $EM_Country         = "AUT";
            $PacketType         = "PAECK.EU";
        }
        $Coupon             = "";
        $EMail              = "funkendesigninfo@gmail.com";

        $text .= $Absender .";". $AB_Adressdetails .";". $AB_Street .";". $AB_HouseNumber .";". $AB_PLZ .";". $AB_City .";". $AB_Country .";". $Empfaenger .";". $EM_Adressdetails .";". $EM_Street .";".
        $EM_HouseNumber .";". $EM_PLZ .";". $EM_City .";". $EM_Country .";". $PacketType .";". $Coupon .";". $EMail;
        
        $shippingCSV = iconv(mb_detect_encoding($text), 'Windows-1252//TRANSLIT', $text);
        //$response["CSV"] = $text_encoded;
        //print_r($shipping);
        editOrder($OrderID, null, $shippingCSV, null, null, null);
        //$fp = fopen(PATH_folderOrderAdressCSV($OrderID).'/sending_' . $OrderID . '.csv', 'w+');
        //fwrite($fp, $text_encoded);
        //fclose($fp);
    }
?>