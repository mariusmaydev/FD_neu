<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/bootstrap.php';
    require_once $rootpath.'/fd/resources/php/userdata/userdata.php';
    require_once 'login.php';

    class login_Google {
        public static function redirect(){
            Debugg::log("google");
            global $provider;
            $_SESSION['oauth2state'] = $provider -> getState();

            $authorizationUrl = $provider -> getAuthorizationUrl();
            print_r($authorizationUrl);
        }
        public static function receiveData() {
            Debugg::log("google");
            global $provider;
            
            if(empty($_GET["state"])||(isset($_SESSION["oauth2state"]) && $_GET["state"] !== $_SESSION["oauth2state"])){
                if(isset($_SESSION["oauth2state"])){
                    unset($_SESSION["oauth2state"]);
                }
                die();
            }
        
            try {
                $accessToken = $provider -> getAccessToken(
                    'authorization_code',
                    [
                        'code' => $_GET['code']
                    ]
                );
                $values = $accessToken-> getValues();
                $jwt = $values['id_token'];
                $userData = file_get_contents("https://oauth2.googleapis.com/tokeninfo?id_token=" . $jwt);
                $userData = json_decode($userData, true);
                // self::login($userData);
            } catch(Exception $e){
        
            }
        }
        // public static function login($userData){     
        //     Debugg::log("google");   
        //     $response = null;
        //     $dataset = new DataSet();
        //     $dataset -> newKey(login::EMAIL, $userData['email']);
        //     $response = login::get($dataset);
        //     if($response != null){
        //         Sessions::set(Sessions::USER_ID, $response[login::USER_ID]);
        //         Sessions::set(Sessions::GUEST, false);
        //     } else {
        //         // addGoogleAccount($userData['given_name'], $userData['email']);
        //         userdata_functions::addData();
        //     }
        // }
    }