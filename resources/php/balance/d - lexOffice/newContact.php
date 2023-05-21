<?php
    require_once 'Core.php';

    $curl = curl_init();

    $options = [
        CURLOPT_RETURNTRANSFER  => true,
        CURLOPT_URL             => 'https://api.lexoffice.io/v1/contacts',
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

    print_r(json_decode($result, true));
?>