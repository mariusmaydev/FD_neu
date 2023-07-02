<?php namespace test;

    class Tools {
        public static function isJSON($data) {
            if (!empty($data)) {
                if(is_string($data) && is_array(json_decode($data, true))){
                    return true;
                }
            }
            return false;
        }
    }