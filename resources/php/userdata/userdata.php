<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/text/text.php';
    require_once $rootpath.'/fd/resources/php/converter/image/image.php';
    require_once $rootpath.'/fd/resources/php/project/project.php';
    require_once $rootpath.'/fd/resources/php/product/product.php';
    
    class shoppingCart{
        const PROJECT_DATA  = "PROJECT_DATA";
        const IMAGE_DATA    = "IMAGE_DATA";
        const TEXT_DATA     = "TEXT_DATA";

        public static function add($ProjectID, $amount, $UserID = null, $ProductName = null, $print = true){
            $amount = intval($amount);
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
                if(isset($_POST[UserDataDB::USER_ID]) && $_POST[UserDataDB::USER_ID] != null){
                    $UserID = $_POST[UserDataDB::USER_ID];
                }
            }
            if($ProductName == null){
                if(isset($_POST["ProductName"]) && $_POST["ProductName"] != null){
                    $ProductName = $_POST["ProductName"];
                } else {
                    $projectData = Project::get($ProjectID, $UserID, false);
                    $ProductName = $projectData["Product"];
                }
            }
            $cart = self::get($UserID, false);
            $cartData = [];
            if($cart != null){
                $cartData = $cart;
            }
            
            $item = new stdClass();
            $item -> ProductName = $ProductName;
            $item -> ProjectID = $ProjectID;
            $item -> amount = $amount;
            array_push($cartData, $item);
            $DataSet = new DataSet();
            $DataSet -> newEntry(UserDataDB::SHOPPINGCART, FileTools::JSON_encode_save($cartData));
            $DataSet -> newKey(UserDataDB::USER_ID, $UserID);

            UserDataDB::edit($DataSet);

            Product::changeAmount($ProductName, -$amount, false);

            Communication::sendBack($cartData, true, $print);
        }
        public static function get($UserID = null, bool $print = true){
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
                if(isset($_POST[UserDataDB::USER_ID]) && $_POST[UserDataDB::USER_ID] != null){
                    $UserID = $_POST[UserDataDB::USER_ID];
                }
            }
            if($UserID == null){
                Communication::sendBack(null, true, $print);
                return null;
            }
            $DataSet = new DataSet();
            $DataSet -> newEntry(UserDataDB::SHOPPINGCART);
            $DataSet -> newKey(UserDataDB::USER_ID, $UserID);

            $shoppingCart = null;
            if(UserDataDB::get($DataSet) != null) {
                $shoppingCart = FileTools::JSON_decode_save(UserDataDB::get($DataSet)[UserDataDB::SHOPPINGCART], true);
            }
            Communication::sendBack($shoppingCart, true, $print);
            return FileTools::JSON_decode_save($shoppingCart, true);
        }
        public static function changeItemAmount($ProjectID, $amount, $UserID = null, $print = true){
            $amount = intval($amount);
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
                if(isset($_POST[UserDataDB::USER_ID]) && $_POST[UserDataDB::USER_ID] != null){
                    $UserID = $_POST[UserDataDB::USER_ID];
                }
            }
            $cart = self::get($UserID, false);
            
            $flag = true;
            foreach($cart as $key => $value){
                if($value[ProjectDB::PROJECT_ID] == $ProjectID){
                    $flag = false;
                    Product::changeAmount($cart[$key]["ProductName"], -$amount, false);
                    $cart[$key]["amount"] += $amount;
                    if($cart[$key]["amount"] == 0){
                        self::removeItem($ProjectID, $UserID, false);
                    }
                    break;
                }
            }
            $projectData = Project::get($ProjectID, $UserID, false);
            if($flag && $amount > 0){
                $ob = new stdClass();
                $ob -> ProjectID = $ProjectID;
                $ob -> amount = $amount;
                
                $projectData = Project::get($ProjectID, $UserID, false);
                $ob -> ProductName = $projectData["Product"];
                array_push($cart, $ob);
            }
            $dataset1 = new DataSet();
            $dataset1 -> newKey(UserDataDB::USER_ID, $UserID);
            $dataset1 -> newEntry(UserDataDB::SHOPPINGCART, FileTools::JSON_encode_save($cart));
            UserDataDB::Edit($dataset1);
            Communication::sendBack($cart, true, $print);
            return FileTools::JSON_decode_save($cart, true);

        }
        public static function removeItem($ProjectID, $UserID = null, $print = true){
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
                if(isset($_POST[UserDataDB::USER_ID]) && $_POST[UserDataDB::USER_ID] != null){
                    $UserID = $_POST[UserDataDB::USER_ID];
                }
            }
            $cart = self::get($UserID, false);
            foreach($cart as $key => $value){
                if($value[ProjectDB::PROJECT_ID] == $ProjectID){
                    Product::changeAmount($cart[$key]["ProductName"], $cart[$key]["amount"], false);
                    array_splice($cart, $key, 1);
                    break;
                }
            }

            $dataset1 = new DataSet();
            $dataset1 -> newKey(UserDataDB::USER_ID, $UserID);
            $dataset1 -> newEntry(UserDataDB::SHOPPINGCART, FileTools::JSON_encode_save($cart));
            UserDataDB::Edit($dataset1);

            Project::remove($ProjectID, $UserID, false);

            Communication::sendBack($cart, true, $print);
            return FileTools::JSON_decode_save($cart, true);
        }
        public static function clear($UserID = null, $print = true){
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
                if(isset($_POST[UserDataDB::USER_ID]) && $_POST[UserDataDB::USER_ID] != null){
                    $UserID = $_POST[UserDataDB::USER_ID];
                }
            }
            $cart = self::get($UserID, false);

            $list = [];
            foreach($cart as $key => $value){
                if(!isset($list[$value["ProductName"]])){
                    $list[$value["ProductName"]] = $value["amount"];
                } else {
                    $list[$value["ProductName"]] += $value["amount"];
                }
            }
            foreach($list as $key => $val){
                Product::changeAmount($key, $val, false);
            }

            $dataset1 = new DataSet();
            $dataset1 -> newKey(UserDataDB::USER_ID, $UserID);
            $dataset1 -> newEntry(UserDataDB::SHOPPINGCART, FileTools::JSON_encode_save([]));
            UserDataDB::Edit($dataset1);

            userdata_functions::remove($UserID, false);
            Communication::sendBack(true, true, $print);
            return true;
        }
        /**
         * @deprecated version
         *
         * @return void
         */
        public static function copy(){
            $ProjectID = $_POST[ProjectDB::PROJECT_ID];

            $data = [];

            $DataSet = new DataSet();
            $DataSet -> TBName(Sessions::get(Sessions::USER_ID));
            $DataSet -> newKey(ProjectDB::PROJECT_ID, $ProjectID);
            $projectData = accessDB::get(ProjectDB::getStruct(), $DataSet);
            $projectData["Square"] = json_decode($projectData["Square"]);
            $data[self::PROJECT_DATA]   = $projectData;

            $DataSet = new DataSet();
            $DataSet -> TBName(Image::getCompressedID(null, $ProjectID));
            $ImageData = ImageDB::get($DataSet, DataBase::FORCE_ORDERED);
            foreach ($ImageData as $key => $data1){
                $ImageData[$key]["ImageFilter"] = json_decode($ImageData[$key]["ImageFilter"]);
            }
            $data[self::IMAGE_DATA]     = $ImageData;
            
            $DataSet = new DataSet();
            $DataSet -> TBName(Text::getCompressedID(null, $ProjectID));
            $TextData = TextDB::get($DataSet);
            $data[self::TEXT_DATA]      = $TextData;

            $cart = self::get(false);
            $cartObj = json_decode($cart[UserDataDB::SHOPPINGCART]);
            foreach($cartObj as $key => $item){
                if($item -> ProjectID == $ProjectID){
                    $cartObj[$key] -> DATA = $data;
                }
            }
            self::set(json_encode($cartObj));
            foreach($ImageData as $data){
                $pathObj = new Path(Path::USERS, Sessions::get(Sessions::USER_ID), Path::PROJECTS, $ProjectID, Path::IMAGES, "Image_View_" . $data[ImageDB::IMAGE_ID] . ".png");
                $pathObj1 = new Path(Path::USERS, Sessions::get(Sessions::USER_ID), Path::SHOPPING_CART, $ProjectID, "Image_View_" . $data[ImageDB::IMAGE_ID] . ".png");
                Path::copyFile($pathObj -> getPathAsString(), $pathObj1 -> getPathAsString());
            }
        }
    }

    class userdata_functions {
        public static function removeAccount($UserID = null){
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            $path = new Path(Path::USERS, $UserID);
            $path = $path -> getPathAsString();
            DataRemove($path, null);

            $DataSet = new DataSet();
            $DataSet -> newEntry(UserDataDB::USER_ID, $UserID);
            UserDataDB::delete($DataSet);

            $projects = Project::getAll($UserID, false);
            if($projects != null){
                foreach($projects as $Project){
                    $DataSet = new DataSet();
                    $DataSet -> TBName(Image::getCompressedID($UserID, $Project[ProjectDB::PROJECT_ID]));
                    ImageDB::removeTable($DataSet);

                    $DataSet = new DataSet();
                    $DataSet -> TBName(Text::getCompressedID($UserID, $Project[ProjectDB::PROJECT_ID]));
                    TextDB::removeTable($DataSet);
                }
            }

            $DataSet = new DataSet();
            $DataSet -> TBName($UserID);
            accessDB::removeTable(ProjectDB::getStruct(), $DataSet);

            $DataSet = new DataSet();
            $DataSet -> newEntry(login::USER_ID, $UserID);
            login::delete($DataSet);
        }
        public static function getAllUserData(bool $print = true){
            $dataset = new DataSet();
            $response = UserDataDB::get($dataset,DataBase::FORCE_ORDERED);

            Communication::sendBack($response, true, $print);
            return $response;
        }
        public static function getData(){
            $UserID = Sessions::get(Sessions::USER_ID);
            if(isset($_POST["mode"]) && $_POST["mode"] == "PRIVATE"){
                if(isset($_POST["ImageID"])){
                    print_r(json_encode(self::getImage($UserID, $_POST["ImageID"])));
                } else {
                    print_r(json_encode(self::getImage($UserID, null)));
                }
            } else {
                $dataset = new DataSet();
                $dataset -> newKey(UserDataDB::USER_ID, Sessions::get(Sessions::USER_ID));
                $response = UserDataDB::get($dataset);
                $response[UserDataDB::IMAGES]   = json_decode($response[UserDataDB::IMAGES]);
                $response[UserDataDB::USER_INFORMATION]   = json_decode($response[UserDataDB::USER_INFORMATION]);
                print_r(json_encode($response));
            }
        }
        public static function remove($UserID = null, $print = true) {
            if($UserID == null) {
                $UserID = $_POST["UserID"];
            }
            $DataSet = new DataSet();
            $DataSet -> TBName($UserID);
            AccessDB::removeTable(ProjectDB::getStruct(), $DataSet);

            $dataset = new DataSet();
            $dataset -> newEntry(UserDataDB::USER_ID, $UserID);
            $res = UserDataDB::Delete($dataset);
            DataRemove(PATH_Userdata::getBaseFile($UserID));



            Communication::sendBack($res, true, $print);
            return $res;
        }
        public static function removeImage($ImageID){
            DataRemove(PATH_Userdata::get(null, $ImageID, Sessions::get(Sessions::USER_ID)), PATH_Userdata::getFile());
            $dataset = new DataSet();
            $dataset -> newKey(UserDataDB::USER_ID, Sessions::get(Sessions::USER_ID));
            $dataset -> newEntry(UserDataDB::IMAGES);
            $Images = json_decode(UserDataDB::get($dataset, DataBase::DENY_ORDERED)["Images"]);

            for($i = 0; $i < count($Images); $i++){
                if($Images[$i]-> ImageID == $ImageID){
                    array_splice($Images, $i, 1);
                    break;
                }
            }
            $DataSet = new DataSet();
            $DataSet -> newEntry(UserDataDB::IMAGES, json_encode($Images));
            $DataSet -> newKey(UserDataDB::USER_ID, Sessions::get(Sessions::USER_ID));
            UserDataDB::Edit($DataSet);

        }
        public static function addImage($imgArray){
            Debugger::log($imgArray);
            $UserID     = Sessions::get(Sessions::USER_ID);
            $imgID = StringTools::realUniqID();
            $path = new PATH_Userdata($UserID, $imgID);
            DataEdit($path -> get(PATH_Userdata::IMG_SCALE), $path -> getFile(), $imgArray[ImageDB::IMAGE_SCALE]);
            DataEdit($path -> get(PATH_Userdata::IMG_VIEW), $path -> getFile(), $imgArray[ImageDB::IMAGE_VIEW]);
            
            $dataset = new DataSet();
            $dataset -> newKey(UserDataDB::USER_ID, Sessions::get(Sessions::USER_ID));
            $dataset -> newEntry(UserDataDB::IMAGES);
            Debugger::log(UserDataDB::get($dataset, DataBase::DENY_ORDERED));
            $Images = json_decode(UserDataDB::get($dataset, DataBase::DENY_ORDERED)["Images"]);

            $newData = [];
            $newData["ImageID"]     = $imgID;
            $newData["Date"]        = 10;
            $newData["ImageName"]   = "test";
            if($Images == null){
                $Images = [];
            }
            array_push($Images, $newData);

            $DataSet = new DataSet();
            $DataSet -> newEntry(UserDataDB::IMAGES, json_encode($Images));
            $DataSet -> newKey(UserDataDB::USER_ID, $UserID);
            
            UserDataDB::Edit($DataSet);
        }
        public static function getImage($UserID = null, $ImageID = null, bool $print = true){
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
                if(isset($_POST[UserDataDB::USER_ID]) && $_POST[UserDataDB::USER_ID] != null){
                    $UserID = $_POST[UserDataDB::USER_ID];
                }
            }
            if($ImageID == null){
                if(isset($_POST[ImageDB::IMAGE_ID]) && $_POST[ImageDB::IMAGE_ID] != null){
                    $ImageID = $_POST[ImageDB::IMAGE_ID];
                }
            }
            $response = [];
            $dataset = new DataSet();
            $dataset -> newKey(UserDataDB::USER_ID, $UserID);
            $dataset -> newEntry(UserDataDB::IMAGES);
            $Images = json_decode(UserDataDB::get($dataset, DataBase::DENY_ORDERED)["Images"]);
            if($Images == null || $Images == ""){
                $Images = array();  
            } else {
                $Images = json_decode($Images);
            }
            if($ImageID != null){
                $response = DataGet(PATH_Userdata::get(PATH_Userdata::IMG_SCALE, $ImageID, $UserID));
            } else {
                for($i = 0; $i < count($Images); $i++){
                    $Image = $Images[$i];
                    $response[$i][ImageDB::IMAGE_SCALE_PATH]    = PATHS::parsePath(PATH_Userdata::get(PATH_Userdata::IMG_SCALE, $Image -> ImageID, $UserID));
                    $response[$i][ImageDB::IMAGE_ID]            = $Image -> ImageID;
                    $response[$i]["Date"]                       = $Image -> Date;
                    $response[$i]["Hashtags"]                   = "";
                    $response[$i][ImageDB::IMAGE_NAME]          = $Image -> ImageName;
                }
            }
            Communication::sendBack($response, true, $print);
            return $response;
        }
        public static function addData($UserID = null){
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            $dataset = new DataSet();
            $dataset -> newEntry(UserDataDB::USER_ID,             $UserID);
            $dataset -> newEntry(UserDataDB::SPARKS,              "");
            $dataset -> newEntry(UserDataDB::SHOPPINGCART,        "");
            $dataset -> newEntry(UserDataDB::IMAGES,              "");
            $dataset -> newEntry(UserDataDB::USER_INFORMATION,    json_encode(""));
            UserDataDB::Add($dataset);
        }
        public static function editData($UserID = null){
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            $dataset = new DataSet();
            if(isset($_POST[UserDataDB::SPARKS])){
                $dataset -> newEntry(UserDataDB::SPARKS, $_POST["Sparks"]);
            }
            if(isset($_POST[UserDataDB::SHOPPINGCART])){
                $dataset -> newEntry(UserDataDB::SHOPPINGCART, $_POST["ShoppingCart"]);
            }
            if(isset($_POST[UserDataDB::IMAGES])){
                $dataset -> newEntry(UserDataDB::IMAGES, $_POST["Images"]);
            }
            if(isset($_POST[UserDataDB::USER_INFORMATION])){
                $dataset -> newEntry(UserDataDB::USER_INFORMATION, json_encode($_POST[UserDataDB::USER_INFORMATION]));
            }
            $dataset -> newKey(UserDataDB::USER_ID, $UserID);
            UserDataDB::Edit($dataset);
        }
    }

    class UserDataDB extends DataBase {
        public static $TBName     = "userdata";
        public static $DBName     = "userdata";
        public static $keyName;
        public static $key;
        const USER_ID                   = "UserID";
        const SPARKS                    = "Sparks";
        const SHOPPINGCART              = "ShoppingCart";
        // const SHOPPINGCART_FROM_GUEST   = "ShoppingCartFromGuest";
        const IMAGES                    = "Images";
        const USER_INFORMATION          = "userInformation";

      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure(){
          $dataset = new DataSet();
          $dataset -> newEntry(self::USER_ID,                   "VARCHAR(40)");
          $dataset -> newEntry(self::SPARKS,                    "VARCHAR(40)");
          $dataset -> newEntry(self::SHOPPINGCART,              "TEXT");
        //   $dataset -> newEntry(self::SHOPPINGCART_FROM_GUEST,   "TEXT");
          $dataset -> newEntry(self::IMAGES,                    "TEXT");
          $dataset -> newEntry(self::USER_INFORMATION,          "VARCHAR(255)");
          $dataset -> primaryKey(self::USER_ID);
          $dataset -> TBName(self::$TBName);
          return $dataset;
        }
        public static function get(DataSet $DataSet, $param = null){
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
            $DataSet -> TBName(self::$TBName);
            return self::getData($DataSet, $con, $param);
        }
        public static function Edit(DataSet $DataSet){
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
            $DataSet -> TBName(self::$TBName);
            self::editData($con, $DataSet);
        }
        public static function Add(DataSet $dataset){
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
            $dataset -> TBName(self::$TBName);
            self::AddData($dataset, $con);
        }
        public static function Delete(DataSet $dataset){
          $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure()));
          $dataset -> TBName(self::$TBName);
          self::removeData($dataset, $con);
        }
      }
?>