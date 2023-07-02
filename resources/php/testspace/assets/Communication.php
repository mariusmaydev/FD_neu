<?php namespace test;

require_once 'tools.php';

    class Communication {
        /**
         * returns any value back to js
         *
         * @param mixed $value
         * @param boolean $encode    true if value should be encoded to JSON
         * @param boolean $isActive  false if the caller function rturns any value before any response should send.
         * @return void
         */
        public static function sendBack(mixed $value, bool $encode = true, bool $isActive = true) : void {
            if(!$isActive){
                return;
            }
            if($encode){
                if(!Tools::isJSON($value)){
                    $value = json_encode(($value));
                }
            }
            print_r($value);
        }
        /**
         * returns the CallPHP access key
         *
         * @return null|string
         */
        public static function getAccess() : null|string {
            $headers = getallheaders();
            if(isset($headers['X-SPLINT-ACCESS_KEY'])){
                return $headers['X-SPLINT-ACCESS_KEY'];
            } else if(isset($_POST['METHOD'])){
                return $_POST['METHOD'];
            } else {
                return null;
            }
        }
    }