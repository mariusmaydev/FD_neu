<?php
    require_once 'Core.php';

    function createDeliveryNotePDF($DeliveryNoteID){
        global $accessToken;
        $curl = curl_init();

        $options = [
        CURLOPT_RETURNTRANSFER  => true,
        CURLOPT_URL             => 'https://api.lexoffice.io/v1/delivery-notes/' . $DeliveryNoteID . '/document',
        //CURLOPT_URL             => 'https://api.lexoffice.io/v1/invoices/' . $DeliveryNoteID,
        CURLOPT_HTTPHEADER      => [
            'Authorization: Bearer ' . $accessToken,
            'Content-Type: application/json',
            'Accept: application/json'
        ],
        CURLOPT_POST            => false
        //CURLOPT_POSTFIELDS      => $_POST["data"]
        ];
        
        curl_setopt_array($curl, $options);
        $result = curl_exec($curl);
        
        if (curl_errno($curl)) {
            error_log($curl);
        }
        curl_close($curl);
        $result = json_decode($result, true);
        return getPDF($result["documentFileId"]);
    }

?>