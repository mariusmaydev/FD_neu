<?php

$rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $rootpath.'/fd/resources/php/CORE.php';
    include_once 'config.php';

    class PaypalCheckout {
        public $paypaylAuthAPI = PAYPAL_SANDBOX?'https://api-m.sandbox.paypal.com/v1/oauth2/token':'https://api-m.paypal.com/v1/oauth2/token';

        public $paypalAPI = PAYPAL_SANDBOX?'https://api-m.sandbox.paypal.com/v2/checkout':'https://api-m.paypal.com/v2/checkout';
        public $paypalClientID = PAYPAL_SANDBOX?PAYPAL_SANDBOX_CLIENT_ID:PAYPAL_PROD_CLIENT_ID;
        private $paypalSecret = PAYPAL_SANDBOX?PAYPAL_SANDBOX_CLIENT_SECRET:PAYPAL_PROD_CLIENT_SECRET;

        public function generateAccessToken() {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $this -> paypaylAuthAPI);
            curl_setopt($ch, CURLOPT_HEADER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERPWD, $this -> paypalClientID.":".$this -> paypalSecret);
            curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
            $auth_response = json_decode(curl_exec($ch));
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if($http_code != 200 && !empty($auth_response -> error)){
                throw new Exception('Failed to gen Access Token: '.$auth_response -> error." >>> ". $auth_response -> error_description);
            }

            if(!empty($auth_response)){
                return $auth_response -> access_token;
            } else {
                return false;
            }
        }
        public function createOrder($productInfo, $paymentSource){
            $accessToken = $this -> generateAccessToken();

            if(empty($accessToken)){
                return false;
            } else {
                $r = json_decode($productInfo);
                $postParams = array(
                    "intent" => "CAPTURE",
                    "purchase_units" => $r -> purchase_units
                );
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $this -> paypalAPI.'/orders/');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization:Bearer '.$accessToken));
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postParams));
                $api_resp = curl_exec($ch);
                $api_data = json_decode($api_resp, true);
                $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                if($http_code != 200 && $http_code != 201){
                    throw new Exception('Failed to create Order ('.$http_code.'): '.$api_resp);
                }

                return !empty($api_data) && ($http_code == 200 || $http_code == 201)?$api_data:false; 
            }
        }
        public function captureOrder($orderID){
            $accessToken = $this -> generateAccessToken();
            
            if(empty($accessToken)){
                return false;
            } else {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, $this -> paypalAPI.'/orders/'.$orderID.'/capture');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Authorization:Bearer '.$accessToken));
                curl_setopt($ch, CURLOPT_POST, true);
                $api_resp = curl_exec($ch);
                $api_data = json_decode($api_resp, true);
                $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
                
                if($http_code != 200 && $http_code != 201){
                    throw new Exception('Failed to create Order ('.$http_code.'): '.$api_resp);
                }

                return !empty($api_data) && ($http_code == 200 || $http_code == 201)?$api_data:false; 
            }
        }
    }


?>