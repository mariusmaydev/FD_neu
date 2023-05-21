<?php
    require_once 'Core.php';
    require_once 'newDeliveryNote.php';
    require_once 'createInvoicePDF.php';
    require_once '../../order/orderEdit.php';
    $curl = curl_init();

    $options = [
        CURLOPT_RETURNTRANSFER  => true,
        CURLOPT_URL             => 'https://api.lexoffice.io/v1/invoices?finalize=true',//?finalize=true
        CURLOPT_HTTPHEADER      => [
            'Authorization: Bearer ' . $accessToken,
            'Content-Type: application/json',
            'Accept: application/json'
        ],
        CURLOPT_POST            => true,
        CURLOPT_POSTFIELDS      => $_POST["data"]
    ];
    
    curl_setopt_array($curl, $options);
    $result = curl_exec($curl);
    
    if(curl_errno($curl)){
        error_log($curl);
    }
    curl_close($curl);
    $result = json_decode($result, true);
    $blob = createInvoicePDF($result["id"]);
    editOrder($_POST["orderID"], null, null, null, base64_encode($blob), null);
    newDeliveryNote($_POST["orderID"], $_POST["data"]);
?>