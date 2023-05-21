<?php
    require_once 'Core.php';
    require_once 'createDeliveryNotePDF.php';
    //require_once '../../order/orderEdit.php';

    function newDeliveryNote($orderID, $data){
        global $accessToken;
        //print_r(json_decode($data));
        $data = json_decode($data);
        $data -> title          = "Lieferschein";
        $data -> introduction   = "Lieferschein zur Rechnung " . $orderID;
        $data -> archived       = false;
        $data = json_encode($data);
        $curl = curl_init();

        $options = [
            CURLOPT_RETURNTRANSFER  => true,
            CURLOPT_URL             => 'https://api.lexoffice.io/v1/delivery-notes',//?finalize=true
            CURLOPT_HTTPHEADER      => [
                'Authorization: Bearer ' . $accessToken,
                'Content-Type: application/json',
                'Accept: application/json'
            ],
            CURLOPT_POST            => true,
            CURLOPT_POSTFIELDS      => $data
        ];
        
        curl_setopt_array($curl, $options);
        $result = curl_exec($curl);
        
        if(curl_errno($curl)){
            error_log($curl);
        }
        curl_close($curl);
        $result = json_decode($result, true);
        $blob = createDeliveryNotePDF($result["id"]);
        editOrder($_POST["orderID"], null, null, null, null, base64_encode($blob));
    }

    function newDeliveryData($data){
        $deliveryData = json_decode($data);
        return $deliveryData;
    }

?>
