<?php
    require_once 'Core.php';

    function createInvoicePDF($InvoiceID){
        global $accessToken;
        $curl = curl_init();

        $options = [
        CURLOPT_RETURNTRANSFER  => true,
        CURLOPT_URL             => 'https://api.lexoffice.io/v1/invoices/' . $InvoiceID . '/document',
        //CURLOPT_URL             => 'https://api.lexoffice.io/v1/invoices/' . $InvoiceID,
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
        //error_log($result);
        return getPDF($result["documentFileId"]);
    }

    function getPDF($InvoiceID){
        global $accessToken;
        $curl = curl_init();

        $options = [
            CURLOPT_RETURNTRANSFER  => true,
            CURLOPT_URL             => 'https://api.lexoffice.io/v1/files/' . $InvoiceID . '',
            CURLOPT_HTTPHEADER      => [
                'Accept: */*',
                'Authorization: Bearer ' . $accessToken
            ],
            CURLOPT_HEADER          => true,
            CURLOPT_NOBODY          => false
        ];
        curl_setopt_array($curl, $options);
        $response = curl_exec($curl);
        $header = '';
        $body = '';
        if (curl_getinfo($curl, CURLINFO_HTTP_CODE) == '200') {
          $headerSize = curl_getinfo ($curl, CURLINFO_HEADER_SIZE); // header information size
          $header = substr($response, 0, $headerSize);
          $body = substr($response, $headerSize);
        }
        curl_close($curl);
        return $body;
    }
?>