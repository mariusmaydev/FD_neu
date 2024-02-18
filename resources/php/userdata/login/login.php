<?php

// use Stripe\BillingPortal\Session;


    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/userdata/userdata.php';
    require_once $rootpath.'/fd/resources/php/security/security.php';

    class login_C {
        public static function nloginGuest(){
            $UserID = null;
            if(isset($_POST[login::USER_ID]) && $_POST[login::USER_ID] != null){
                $UserID = $_POST[login::USER_ID];
                if(!self::hasAccount($UserID)){
                    $UserID = self::newLogin();
                }
            } else if(Sessions::get(Sessions::USER_ID)){
                $UserID = Sessions::get(Sessions::USER_ID);
                if(!self::hasAccount($UserID)){
                    $UserID = self::newLogin();
                }
            } else {
                $UserID = self::newLogin();
            }
            Sessions::set(Sessions::USER_ID, $UserID);
            Sessions::set(Sessions::GUEST, true);
            Sessions::set(Sessions::LOGGEDIN, true);
            Sessions::set(Sessions::ADMIN, false);
            $DateTime = new DateTime();
            $dataset = new DataSet();
            $dataset -> newKey(login::USER_ID, $UserID);
            $dataset -> newEntry(login::TIME_LAST, $DateTime -> format('U'));
            login::Edit($dataset);
            Communication::sendBack(self::getData($UserID, false));

        }
        public static function hasAccount($UserID){
            $DataSet = new DataSet();
            $DataSet -> newKey(login::USER_ID, $UserID);
            $response = login::get($DataSet);
            if($response == null){
                return false;
            }
            return true;
        }
        
        public static function newLogin(){
            $UserID = StringTools::realUniqID();
            Sessions::set(Sessions::USER_ID,    $UserID);
            userdata_functions::addData();
            // Sessions::set(Sessions::USER_NAME,  $UserName);
            $DateTime = new DateTime();
            $dataset = new DataSet();
            $dataset -> newEntry(login::USER_ID,    $UserID);
            $dataset -> newEntry(login::TIME_JOIN,  $DateTime -> format('U'));
            $dataset -> newEntry(login::TIME_LAST,  $DateTime -> format('U'));
            login::Add($dataset);
            return $UserID;
        }
        public static function getData($UserID = null, $print = true){
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            if($UserID == null){
                print_r(json_encode(false));
            } else {
                $DataSet = new DataSet();
                $DataSet -> newKey(login::USER_ID, $UserID);
                $response = login::get($DataSet);
                Communication::sendBack($response, true, $print);
                return $response;
            }
        }
        public static function isLoggedIn(){
            if(Sessions::get(Sessions::LOGGEDIN) != null){
                Communication::sendBack(true);
            } else {
                Communication::sendBack(false);
            }
        }
    }
    class user_account {
        public static function remove($UserID){
            $DataSet = new DataSet();
            $DataSet -> newEntry(login::USER_ID, $UserID);
            login::Delete($DataSet);
            Communication::sendBack(true);
        }

        public static function copyProjectDataFromGuest($projectID){
            $NewProjectID = Project::copy($projectID, null, $projectID, null, false);
            Communication::sendBack($NewProjectID);
        }
    }

    Sessions::get();
?>