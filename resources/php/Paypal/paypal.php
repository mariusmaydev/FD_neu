<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    define('PAYPAL_CLIENT_ID', 'AcY69ITexNWNGhhjCZTpjHIyM-KiqjWbTaACjMNj5SLRvXd8fMKysveevIZ4fffuBXEevk5Jf_LDw0nw');
    define('PAYPAL_SECRET', 'EGgwQhCkMb4LUsNjgEA8hvvBjgh6Vnad9L3doqqtdOjQ7v90AIk7hUQrr-Y6IyLkYMFb0kHdzCfPnWJ8');
    define('PAYPAL_BASE_URL', 'https://api.sandbox.paypal.com');

    class paypal {
        public static function createOrder(){
            $Storage = $_POST["Storage"];
            $shoppingCart = [];
            foreach($Storage["shoppingCart"] as $item){
                $obj = new stdClass();
                $obj -> amount  = $item["amount"];
                $obj -> price   = $item["price"];
                $obj -> name    = $item["ProductName"];

                array_push($shoppingCart, $obj);
            }
            $URL = new stdClass();
            $URL -> return_url = $Storage["return_url"];
            $URL -> cancel_url = $Storage["cancel_url"];
            print_r(paypalHelper::createOrder(paypalHelper::getAccessToken(), $shoppingCart, $Storage["shippingAddress"], $URL));       
        } 
        public static function capturePayment(){
            print_r(paypalHelper::capturePayment(paypalHelper::getAccessToken(), $_POST["orderID"], $_POST["token"]));
        }
    }
    class paypalHelper {
        public static function getAccessToken() : string {
            if(isset($_SESSION['payPalAccessToken']) && isset($_SESSION['payPalAccessTokenExpires']) && $_SESSION['payPalAccessTokenExpires'] > time()){
                return $_SESSION['payPalAccessToken'];
            }
            $curl = curl_init();
            $options = [
                CURLOPT_RETURNTRANSFER  => true,
                CURLOPT_URL             => PAYPAL_BASE_URL . '/v1/oauth2/token',
                CURLOPT_HTTPHEADER      => [
                    'Accept: application/json',
                    'Accept-Language: en_US',
                    ''
                ],
                CURLOPT_USERPWD         => PAYPAL_CLIENT_ID . ':' . PAYPAL_SECRET,
                CURLOPT_POST            => true,
                CURLOPT_POSTFIELDS      => 'grant_type=client_credentials'
            ];
            
            curl_setopt_array($curl, $options);
            $result = curl_exec($curl);
            if(curl_errno($curl)){
                error_log($curl);
            }
            curl_close($curl);
            $data           = json_decode($result, true);
            $accessToken    = $data['access_token'];
            $_SESSION['paypalAccessToken']          = $accessToken;
            $_SESSION['payPalAccessTokenExpires']   = time() + $data['expires_in'];
            return $accessToken;
        }
        public static function capturePayment($accessToken, $orderID, $token){
            $data = new stdClass();
            $data -> payment_source = new stdClass();
            $data -> payment_source -> token = new stdClass();
            $data -> payment_source -> token -> id = $token;
            $data -> payment_source -> token -> type = "BILLING_AGREEMENT";
    
            $dataString = json_encode($data);
    
            $curl = curl_init();
            $options = [
                CURLOPT_RETURNTRANSFER  => true,
                CURLOPT_URL             => PAYPAL_BASE_URL . '/v2/checkout/orders/' . $orderID . '/capture',
                CURLOPT_HTTPHEADER      => [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $accessToken
                ],
                CURLOPT_POST            => true,
                CURLOPT_POSTFIELDS      => $dataString
            ];
            
            curl_setopt_array($curl, $options);
            $result = curl_exec($curl);
            if(curl_errno($curl)){
                error_log($curl);
            }
            curl_close($curl);
    
            $data           = json_decode($result, true);
            print_r(var_dump($data));

        }
        public static function createOrder(string $accessToken, array $shoppingCart, $shippingAddress, stdClass $URL){
            $curl = curl_init();
            $shippingAddress = json_decode(json_encode($shippingAddress));
            $FirstName      = $shippingAddress -> FirstName;
            $LastName       = $shippingAddress -> LastName;
            $Title          = $shippingAddress -> Title;
            $Street         = $shippingAddress -> Street;
            $Country        = $shippingAddress -> Country;
            $PLZ            = $shippingAddress -> Postcode;
            $HouseNumber    = $shippingAddress -> HouseNumber;
            $City           = $shippingAddress -> City;

            $payer = new stdClass();
            $payer -> address = new stdClass();
            $payer -> address -> address_line_1  = $Street . " " . $HouseNumber;
            $payer -> address -> admin_area_2    = $City;
            $payer -> address -> postal_code     = $PLZ; 
            $payer -> address -> admin_area_1    = $Country; 
            $payer -> address -> country_code    = "DE";
            $payer -> name = new stdClass();
            // $payer -> name -> prefix        = $Title;
            $payer -> name -> given_name    = $Title ." " . $FirstName;
            $payer -> name -> last_name     = $LastName;

            $obj = new stdClass();
            $obj -> items = array();

            $totalValue     = 0;
            $items_total    = 0;
            $tax_total      = 0;
            foreach($shoppingCart as $product){
                $item = self::productToPaypalItem($product);
                $obj -> items[] = $item;
                $totalValue     += floatval($product -> price);
                $items_total    += $item -> unit_amount -> value;
                $tax_total      += $item -> tax -> value;
            }        
            $amountObj = new stdClass();
            $amountObj -> currency_code = "EUR";
            $amountObj -> breakdown = new stdClass();
            $amountObj -> breakdown -> item_total = new stdClass();
            $amountObj -> breakdown -> item_total -> value          = number_format($items_total, 2);
            $amountObj -> breakdown -> item_total -> currency_code  = "EUR";
            
            $amountObj -> breakdown -> tax_total = new stdClass();
            $amountObj -> breakdown -> tax_total -> value           = number_format($tax_total, 2);
            $amountObj -> breakdown -> tax_total -> currency_code   = "EUR";
            $amountObj -> value = number_format($totalValue, 2);

            $obj -> amount = $amountObj;
            $obj -> shipping = new stdClass();
            $obj -> shipping -> address = $payer -> address;

            $applicationContext = new stdClass();
            $applicationContext -> shipping_preference = "SET_PROVIDED_ADDRESS";
            $applicationContext -> return_url = strval($URL -> return_url);
            $applicationContext -> cancel_url = strval($URL -> cancel_url);
            // debugg($obj);
            $data = [
                "payer" => $payer,
                "application_context" => $applicationContext,
                "intent" => "CAPTURE",
                "purchase_units" => [
                    $obj
                ]
            ];

            $dataString = json_encode($data);

            $options = [
                CURLOPT_RETURNTRANSFER  => true,
                CURLOPT_URL             => PAYPAL_BASE_URL . '/v2/checkout/orders',
                CURLOPT_HTTPHEADER      => [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $accessToken
                ],
                CURLOPT_POST            => true,
                CURLOPT_POSTFIELDS      => $dataString
            ];
            
            curl_setopt_array($curl, $options);
            $result = curl_exec($curl);
            if(curl_errno($curl)){
                error_log($curl);
            }
            curl_close($curl);
            $data = json_decode($result, true);
            // debugg($data);
            if($data['status'] !== "CREATED"){
                return false;
            }

            $url = '';
            foreach($data['links'] as $link){
                if($link['rel'] !== "approve"){
                    continue;
                }
                $url = $link['href'];
            }
            $returnObj = new stdClass();
            $returnObj -> URL           = $url;
            $returnObj -> accessToken   = self::getAccessToken();
            $returnObj -> orderID       = $data['id'];
            return json_encode($returnObj);
        }
        public static function productToPaypalItem(stdClass $productData) : stdClass{
            $item = new stdClass();
            $item -> name                               = $productData -> name;
            $item -> unit_amount = new stdClass();
            $item -> unit_amount -> currency_code       = "EUR";
            $item -> unit_amount -> value               = number_format(floatval($productData -> price) - number_format($productData -> price * 0.19, 2), 2);
            $item -> tax = new stdClass();
            $item -> tax -> currency_code               = "EUR";
            $item -> tax -> value                       = number_format($productData -> price * 0.19, 2);
            $item -> quantity                           = $productData -> amount;
            $item -> category                           = 'PHYSICAL_GOODS';
            $item -> description                        = 'Funkendesign';
    
            return $item;
        }
    }
    // $METHOD = $_POST["METHOD"];
    // if($METHOD == "createOrder"){
    //     print_r(createOrder(getAccessToken(), $_POST["shoppingCart"], $_POST["shippingAddress"]));       
    // } else if($METHOD == "capturePayment"){
    //     print_r(capturePayment(getAccessToken(), $_POST["orderID"], $_POST["token"]));
    // }

    // function getAccessToken():string{
    //     if(isset($_SESSION['payPalAccessToken']) && isset($_SESSION['payPalAccessTokenExpires']) && $_SESSION['payPalAccessTokenExpires'] > time()){
    //         return $_SESSION['payPalAccessToken'];
    //     }
    //     $curl = curl_init();
    //     $options = [
    //         CURLOPT_RETURNTRANSFER  => true,
    //         CURLOPT_URL             => PAYPAL_BASE_URL . '/v1/oauth2/token',
    //         CURLOPT_HTTPHEADER      => [
    //             'Accept: application/json',
    //             'Accept-Language: en_US',
    //             ''
    //         ],
    //         CURLOPT_USERPWD         => PAYPAL_CLIENT_ID . ':' . PAYPAL_SECRET,
    //         CURLOPT_POST            => true,
    //         CURLOPT_POSTFIELDS      => 'grant_type=client_credentials'
    //     ];
        
    //     curl_setopt_array($curl, $options);
    //     $result = curl_exec($curl);
    //     if(curl_errno($curl)){
    //         error_log($curl);
    //     }
    //     curl_close($curl);
    //     $data           = json_decode($result, true);
    //     $accessToken    = $data['access_token'];
    //     $_SESSION['paypalAccessToken']          = $accessToken;
    //     $_SESSION['payPalAccessTokenExpires']   = time() + $data['expires_in'];
    //     return $accessToken;
    // }

    // function productToPaypalItem(array $productData):stdClass{
    //     $item = new stdClass();
    //     $item -> name                               = $productData["name"];
    //     $item -> unit_amount = new stdClass();
    //     $item -> unit_amount -> currency_code       = "EUR";
    //     $item -> unit_amount -> value               = number_format(floatval($productData["price"]) - number_format($productData["price"]*0.19, 2), 2);
    //     $item -> tax = new stdClass();
    //     $item -> tax -> currency_code               = "EUR";
    //     $item -> tax -> value                       = number_format($productData["price"]*0.19, 2);
    //     $item -> quantity                           = $productData["count"];
    //     $item -> category                           = 'PHYSICAL_GOODS';
    //     $item -> description                        = 'Funkendesign';

    //     return $item;
    // }

    // function createOrder(string $accessToken, /*array*/ $shoppingCart, $shippingAddress){
    //     $curl = curl_init();
    //     $shippingAddress = json_decode($shippingAddress);
    //     $FirstName      = $shippingAddress -> FirstName;
    //     $LastName       = $shippingAddress -> LastName;
    //     $Title          = $shippingAddress -> Title;
    //     $Street         = $shippingAddress -> Street;
    //     $Country        = $shippingAddress -> Country;
    //     $PLZ            = $shippingAddress -> PLZ;
    //     $HouseNumber    = $shippingAddress -> HouseNumber;
    //     $City           = $shippingAddress -> City;

    //     $payer = new stdClass();
    //     $payer -> address = new stdClass();
    //     $payer -> address -> address_line_1  = $Street . " " . $HouseNumber;
    //     $payer -> address -> admin_area_2    = $City;
    //     $payer -> address -> postal_code     = $PLZ; 
    //     $payer -> address -> admin_area_1    = $Country; 
    //     $payer -> address -> country_code    = "DE";
    //     $payer -> name = new stdClass();
    //     // $payer -> name -> prefix        = $Title;
    //     $payer -> name -> given_name    = $Title ." " . $FirstName;
    //     $payer -> name -> last_name     = $LastName;

    //     $obj = new stdClass();
    //     $obj -> items = array();

    //     $totalValue     = 0;
    //     $items_total    = 0;
    //     $tax_total      = 0;
    //     foreach($shoppingCart as $product){
    //         $item = productToPaypalItem($product);
    //         $obj -> items[] = $item;
    //         $totalValue     += floatval($product["price"]);
    //         $items_total    += $item -> unit_amount -> value;
    //         $tax_total      += $item -> tax -> value;
    //     }        
    //     $amountObj = new stdClass();
    //     $amountObj -> currency_code = "EUR";
    //     $amountObj -> breakdown = new stdClass();
    //     $amountObj -> breakdown -> item_total = new stdClass();
    //     $amountObj -> breakdown -> item_total -> value          = number_format($items_total, 2);
    //     $amountObj -> breakdown -> item_total -> currency_code  = "EUR";
        
    //     $amountObj -> breakdown -> tax_total = new stdClass();
    //     $amountObj -> breakdown -> tax_total -> value           = number_format($tax_total, 2);
    //     $amountObj -> breakdown -> tax_total -> currency_code   = "EUR";
    //     $amountObj -> value = number_format($totalValue, 2);

    //     $obj -> amount = $amountObj;
    //     $obj -> shipping = new stdClass();
    //     $obj -> shipping -> address = $payer -> address;

    //     $applicationContext = new stdClass();
    //     $applicationContext -> shipping_preference = "SET_PROVIDED_ADDRESS";
    //     $applicationContext -> return_url = strval($_POST["returnURL"]);
    //     $applicationContext -> cancel_url = strval($_POST["cancelURL"]);

    //     $data = [
    //         "payer" => $payer,
    //         "application_context" => $applicationContext,
    //         "intent" => "CAPTURE",
    //         "purchase_units" => [
    //             $obj
    //         ]
    //     ];

    //     $dataString = json_encode($data);

    //     $options = [
    //         CURLOPT_RETURNTRANSFER  => true,
    //         CURLOPT_URL             => PAYPAL_BASE_URL . '/v2/checkout/orders',
    //         CURLOPT_HTTPHEADER      => [
    //             'Content-Type: application/json',
    //             'Authorization: Bearer ' . $accessToken
    //         ],
    //         CURLOPT_POST            => true,
    //         CURLOPT_POSTFIELDS      => $dataString
    //     ];
        
    //     curl_setopt_array($curl, $options);
    //     $result = curl_exec($curl);
    //     if(curl_errno($curl)){
    //         error_log($curl);
    //     }
    //     curl_close($curl);
    //     $data = json_decode($result, true);
    //     print_r($data);
    //     if($data['status'] !== "CREATED"){
    //         return false;
    //     }

    //     $url = '';
    //     foreach($data['links'] as $link){
    //         if($link['rel'] !== "approve"){
    //             continue;
    //         }
    //         $url = $link['href'];
    //     }
    //     $returnObj = new stdClass();
    //     $returnObj -> URL           = $url;
    //     $returnObj -> accessToken   = getAccessToken();
    //     $returnObj -> orderID       = $data['id'];
    //     return json_encode($returnObj);
    // }

    // function capturePayment($accessToken, $orderID, $token){

    //     $data = new stdClass();
    //     $data -> payment_source = new stdClass();
    //     $data -> payment_source -> token = new stdClass();
    //     $data -> payment_source -> token -> id = $token;
    //     $data -> payment_source -> token -> type = "BILLING_AGREEMENT";

    //     $dataString = json_encode($data);

    //     $curl = curl_init();
    //     $options = [
    //         CURLOPT_RETURNTRANSFER  => true,
    //         CURLOPT_URL             => PAYPAL_BASE_URL . '/v2/checkout/orders/' . $orderID . '/capture',
    //         CURLOPT_HTTPHEADER      => [
    //             'Content-Type: application/json',
    //             'Authorization: Bearer ' . $accessToken
    //         ],
    //         CURLOPT_POST            => true,
    //         CURLOPT_POSTFIELDS      => $dataString
    //     ];
        
    //     curl_setopt_array($curl, $options);
    //     $result = curl_exec($curl);
    //     if(curl_errno($curl)){
    //         error_log($curl);
    //     }
    //     curl_close($curl);

    //     $data           = json_decode($result, true);
    //     print_r(var_dump($data));
    // };



?>