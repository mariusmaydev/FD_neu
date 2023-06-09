<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/text/text.php';
    require_once $rootpath.'/fd/resources/php/converter/image/image.php';
    require_once $rootpath.'/fd/resources/php/project/project.php';

    class shoppingCart{
        const PROJECT_DATA  = "PROJECT_DATA";
        const IMAGE_DATA    = "IMAGE_DATA";
        const TEXT_DATA     = "TEXT_DATA";

        public static function add($item){
            if(self::get(false)[UserDataDB::SHOPPINGCART] == null){
                $cartData = [];
            } else {
                $cartData = json_decode(self::get(false)[UserDataDB::SHOPPINGCART], true);
            }
            
            array_push($cartData, $item);
            self::set(json_encode($cartData));
        }
        public static function get(bool $print = true){
            $UserID = Sessions::get(Sessions::USER_ID);
            if($UserID == null){
                Communication::sendBack(false, true, $print);
                return null;
            }
            $DataSet = new DataSet();
            $DataSet -> newEntry(UserDataDB::SHOPPINGCART);
            $DataSet -> newEntry(UserDataDB::SHOPPINGCART_FROM_GUEST);
            $DataSet -> newKey(UserDataDB::USER_ID, $UserID);
            $shoppingCart = UserDataDB::get($DataSet);
            if($print){
                Communication::sendBack($shoppingCart);
            } else {
                return $shoppingCart;
            }
        }
        public static function set($data = null, $type = UserDataDB::SHOPPINGCART){
            if($data == null){
                $data = $_POST[UserDataDB::SHOPPINGCART];
            }
            $UserID = Sessions::get(Sessions::USER_ID);
            $DataSet = new DataSet();
            $DataSet -> newEntry($type, $data);
            $DataSet -> newKey(UserDataDB::USER_ID, $UserID);
            Debugg::log($DataSet);
            UserDataDB::edit($DataSet);
        }
        public static function copyFromGuest($UserID){
            $Guest_UserID = Sessions::get(Sessions::USER_ID);
            $Dataset = new Dataset();
            $Dataset -> newEntry(UserDataDB::SHOPPINGCART);
            $Dataset -> newKey(UserDataDB::USER_ID, $Guest_UserID);
            $response = UserDataDB::get($Dataset);
            if($response != null){
                $DataSet = new DataSet();
                $DataSet -> newEntry(UserDataDB::SHOPPINGCART_FROM_GUEST, ($response[UserDataDB::SHOPPINGCART]));
                $DataSet -> newKey(UserDataDB::USER_ID, $UserID);
                UserDataDB::edit($DataSet);
            }
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
            $UserID     = Sessions::get(Sessions::USER_ID);
            $imgID = StringTools::realUniqID();
            $path = new PATH_Userdata($UserID, $imgID);
            DataEdit($path -> get(PATH_Userdata::IMG_SCALE), $path -> getFile(), $imgArray[ImageDB::IMAGE_SCALE]);
            DataEdit($path -> get(PATH_Userdata::IMG_VIEW), $path -> getFile(), $imgArray[ImageDB::IMAGE_VIEW]);
            
            $dataset = new DataSet();
            $dataset -> newKey(UserDataDB::USER_ID, Sessions::get(Sessions::USER_ID));
            $dataset -> newEntry(UserDataDB::IMAGES);
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
        public static function getImage($UserID, $ImageID = null){
            $response = [];
            $dataset = new DataSet();
            $dataset -> newKey(UserDataDB::USER_ID, Sessions::get(Sessions::USER_ID));
            $dataset -> newEntry(UserDataDB::IMAGES);
            $Images = json_decode(UserDataDB::get($dataset, DataBase::DENY_ORDERED)["Images"]);
            if($Images == null || $Images == ""){
                $Images = array();  
            } else {
                // $Images = json_decode($Images);
            }
            if($ImageID != null){
                $response = DataGet(PATH_Userdata::get(PATH_Userdata::IMG_SCALE, $ImageID, $UserID));
            } else {
                for($i = 0; $i < count($Images); $i++){
                    $Image = $Images[$i];
                    $response[$i][ImageDB::IMAGE_SCALE_PATH] = PATHS::parsePath(PATH_Userdata::get(PATH_Userdata::IMG_SCALE, $Image -> ImageID, $UserID));
                    $response[$i][ImageDB::IMAGE_ID]    = $Image -> ImageID;
                    $response[$i]["Date"]       = $Image -> Date;
                    $response[$i]["Hashtags"]   = "";
                    $response[$i][ImageDB::IMAGE_NAME]  = $Image -> ImageName;
                }
            }
            print_r(json_encode($response));
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
        const SHOPPINGCART_FROM_GUEST   = "ShoppingCartFromGuest";
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
          $dataset -> newEntry(self::SHOPPINGCART_FROM_GUEST,   "TEXT");
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