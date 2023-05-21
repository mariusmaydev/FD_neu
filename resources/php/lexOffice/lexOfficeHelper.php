<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/lexOffice/lexOffice.php';

    $accessToken = "l2h4Kz9C_zf8Hmvs9wBqlWXCJkU";

    class lexOffice_Helper {
        public static function getFile($documentFileID){
            global $accessToken;
            $curl = curl_init();
    
            $options = [
                CURLOPT_RETURNTRANSFER  => true,
                CURLOPT_URL             => 'https://api.lexoffice.io/v1/files/' . $documentFileID . '',
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
        public static function call(string $url, $data = null, $post = true){
            global $accessToken;
            $curl = curl_init();
            $options = [
                CURLOPT_RETURNTRANSFER  => true,
                CURLOPT_URL             => 'https://api.lexoffice.io/' . $url,//?finalize=true
                CURLOPT_HTTPHEADER      => [
                    'Authorization: Bearer ' . $accessToken,
                    'Content-Type: application/json',
                    'Accept: application/json'
                ],
                CURLOPT_POST            => $post
            ];
            
            curl_setopt_array($curl, $options);
            if($data != null){
                $data = json_encode($data);
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            }
            $result = curl_exec($curl);
            
            if(curl_errno($curl)){
                error_log($curl);
            }
            curl_close($curl);
            // return $result;
            return json_decode($result, true);
        }
    }
