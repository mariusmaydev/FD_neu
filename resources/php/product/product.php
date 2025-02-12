<?php

use Splint\File\File_DeepScan;

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class Product {
        public static function getCurrentAmount($ProductName = null, $ProductID = null, bool $sendBack = true){
            $dataSet = new DataSet();
            if($ProductName != null){
                $dataSet -> newKey(ProductDB::PRODUCT_NAME, $ProductName);
                $dataSet -> newEntry(ProductDB::PRODUCT_AVAILABLE_AMOUNT);
                $res = ProductDB::get($dataSet);
                if($res != null){
                    Communication::sendBack($res[ProductDB::PRODUCT_AVAILABLE_AMOUNT], false, $sendBack);
                }
            } else if($ProductID != null){
                $dataSet -> newKey(ProductDB::PRODUCT_ID, $ProductID);
                $dataSet -> newEntry(ProductDB::PRODUCT_AVAILABLE_AMOUNT);
                $res = ProductDB::get($dataSet);
                if($res != null){
                    Communication::sendBack($res[ProductDB::PRODUCT_AVAILABLE_AMOUNT], false, $sendBack);
                }
            } else if(isset($_POST[ProductDB::PRODUCT_NAME])){
                $dataSet -> newKey(ProductDB::PRODUCT_NAME, $_POST[ProductDB::PRODUCT_NAME]);
                $dataSet -> newEntry(ProductDB::PRODUCT_AVAILABLE_AMOUNT);
                $res = ProductDB::get($dataSet);
                if($res != null){
                    Communication::sendBack($res[ProductDB::PRODUCT_AVAILABLE_AMOUNT], false, $sendBack);
                }
            } else if(isset($_POST[ProductDB::PRODUCT_ID])){
                $dataSet -> newKey(ProductDB::PRODUCT_ID, $_POST[ProductDB::PRODUCT_ID]);
                $dataSet -> newEntry(ProductDB::PRODUCT_AVAILABLE_AMOUNT);
                $res = ProductDB::get($dataSet);
                if($res != null){
                    Communication::sendBack($res[ProductDB::PRODUCT_AVAILABLE_AMOUNT], false, $sendBack);
                }
            }
            Communication::sendBack(false, true, $sendBack);
            return false;

        }
        public static function new(bool $sendBack = true){
            $productList = self::get(false, true, true, null, $_POST[ProductDB::PRODUCT_NAME]);
            if($productList != null){
                Communication::sendBack($productList, true, $sendBack);
                return;
            }
            $name               = $_POST[ProductDB::PRODUCT_NAME];
            $viewName           = $_POST[ProductDB::PRODUCT_VIEW_NAME];
            $ID                 = StringTools::realUniqID();
            $description        = $_POST[ProductDB::PRODUCT_DESCRIPTION];
            $price              = $_POST[ProductDB::PRODUCT_PRICE]; 
            $size               = json_encode($_POST[ProductDB::PRODUCT_SIZE]);
            $attrs              = json_encode($_POST[ProductDB::PRODUCT_ATTRS]);
            $colorName          = $_POST[ProductDB::PRODUCT_COLOR];
            $EPType             = $_POST[ProductDB::PRODUCT_EPTYPE];
            $AvailableAmount    = $_POST[ProductDB::PRODUCT_AVAILABLE_AMOUNT];

            $dataSet = new DataSet();
            $dataSet -> newEntry(ProductDB::PRODUCT_ID, $ID);
            $dataSet -> newEntry(ProductDB::PRODUCT_NAME, $name);
            $dataSet -> newEntry(ProductDB::PRODUCT_VIEW_NAME, $viewName);
            $dataSet -> newEntry(ProductDB::PRODUCT_PRICE, $price);
            $dataSet -> newEntry(ProductDB::PRODUCT_SIZE, $size);
            $dataSet -> newEntry(ProductDB::PRODUCT_ATTRS, $attrs);
            $dataSet -> newEntry(ProductDB::PRODUCT_COLOR, $colorName);
            $dataSet -> newEntry(ProductDB::PRODUCT_EPTYPE, $EPType);
            $dataSet -> newEntry(ProductDB::PRODUCT_DESCRIPTION, $description);
            $dataSet -> newEntry(ProductDB::PRODUCT_AVAILABLE_AMOUNT, $AvailableAmount);
            $dataSet -> newEntry(ProductDB::PRODUCT_SALES, 0);
            ProductDB::Add($dataSet);
            Communication::sendBack($ID, true, $sendBack);
        }
        public static function remove(bool $sendBack = true){
            $dataSet = new DataSet();
            $dataSet -> newEntry(ProductDB::PRODUCT_ID, $_POST[ProductDB::PRODUCT_ID]);
            ProductDB::remove($dataSet);

            $pathBase = PATHS::parsePath(PATH_Product::get($_POST[ProductDB::PRODUCT_ID]));
            DataRemove($_SERVER['DOCUMENT_ROOT'] . $pathBase);
            Communication::sendBack($_POST[ProductDB::PRODUCT_ID], true, $sendBack);
        }
        public static function removeImage(string $ProductID, string $imageID, bool $sendBack = true) {
            $pathBase = PATHS::parsePath( PATH_Product::get($ProductID));
            $pathFull = $_SERVER["DOCUMENT_ROOT"] . $pathBase . $imageID . ".png";
            DataRemove($pathFull);
            Communication::sendBack(true, true, $sendBack);
        }
        public static function changeAmount($ProductName, $amount, $sendBack = false) {
            $dataset = new DataSet();
            $dataset -> newKey(ProductDB::PRODUCT_NAME, $ProductName);
            $dataset -> newEntry(ProductDB::PRODUCT_AVAILABLE_AMOUNT);
            $res = ProductDB::get($dataset);
            $newAmount = $res[ProductDB::PRODUCT_AVAILABLE_AMOUNT] + $amount;
            
            $dataset1 = new DataSet();
            $dataset1 -> newKey(ProductDB::PRODUCT_NAME, $ProductName);
            $dataset1 -> newEntry(ProductDB::PRODUCT_AVAILABLE_AMOUNT, $newAmount);
            ProductDB::Edit($dataset1);
            Communication::sendBack(true, true, $sendBack);
        }
        public static function edit(bool $sendBack = true){
            $name               = $_POST[ProductDB::PRODUCT_NAME];
            $viewName           = $_POST[ProductDB::PRODUCT_VIEW_NAME];
            $ID                 = $_POST[ProductDB::PRODUCT_ID];
            $description        = $_POST[ProductDB::PRODUCT_DESCRIPTION];
            $price              = $_POST[ProductDB::PRODUCT_PRICE]; 
            $size               = json_encode($_POST[ProductDB::PRODUCT_SIZE]);
            $attrs              = json_encode($_POST[ProductDB::PRODUCT_ATTRS]);
            $colorName          = $_POST[ProductDB::PRODUCT_COLOR];
            $EPType             = $_POST[ProductDB::PRODUCT_EPTYPE];
            $AvailableAmount    = $_POST[ProductDB::PRODUCT_AVAILABLE_AMOUNT];

            $dataSet = new DataSet();
            $dataSet -> newKey(ProductDB::PRODUCT_ID, $ID);
            $dataSet -> newEntry(ProductDB::PRODUCT_NAME, $name);
            $dataSet -> newEntry(ProductDB::PRODUCT_VIEW_NAME, $viewName);
            $dataSet -> newEntry(ProductDB::PRODUCT_PRICE, $price);
            $dataSet -> newEntry(ProductDB::PRODUCT_SIZE, $size);
            $dataSet -> newEntry(ProductDB::PRODUCT_ATTRS, $attrs);
            $dataSet -> newEntry(ProductDB::PRODUCT_COLOR, $colorName);
            $dataSet -> newEntry(ProductDB::PRODUCT_EPTYPE, $EPType);
            $dataSet -> newEntry(ProductDB::PRODUCT_DESCRIPTION, $description);
            $dataSet -> newEntry(ProductDB::PRODUCT_AVAILABLE_AMOUNT, $AvailableAmount);
            $dataSet -> newEntry(ProductDB::PRODUCT_SALES, 0);
            ProductDB::Edit($dataSet);
            Communication::sendBack($ID, true, $sendBack);

        }
        public static function getData(){
            $dataSet = new DataSet();
            if(isset($_POST[ProductDB::PRODUCT_NAME])) {
                $dataSet -> newKey(ProductDB::PRODUCT_NAME, $_POST[ProductDB::PRODUCT_NAME]);
            } else {
                $dataSet -> newKey(ProductDB::PRODUCT_COLOR, $_POST[ProductDB::PRODUCT_COLOR]);
                $dataSet -> newKey(ProductDB::PRODUCT_EPTYPE, $_POST[ProductDB::PRODUCT_EPTYPE]);
            }
            $res = ProductDB::get($dataSet);
            $res[ProductDB::PRODUCT_SIZE] = json_decode($res[ProductDB::PRODUCT_SIZE]);
            $res[ProductDB::PRODUCT_ATTRS] = json_decode($res[ProductDB::PRODUCT_ATTRS]);
            
            $pathBase = PATHS::parsePath(PATH_Product::get($res[ProductDB::PRODUCT_ID]));
            $res["ImgPath"] = [];
            if(file_exists($_SERVER["DOCUMENT_ROOT"] . $pathBase)){
                $imgNames = File_DeepScan::scanDir($_SERVER["DOCUMENT_ROOT"] . $pathBase);
                foreach(array_values($imgNames)[0] as $name){
                    $res["ImgPath"][str_replace('.png','', $name)] = DOMAIN . $pathBase . $name;
                }
            }
            Communication::sendBack($res);
        }
        public static function get(bool $sendBack = true, bool $useParameters = false, bool $withImages = true, string $viewName = null, string $name = null, float $price = null, string $productID = null, $color = null, $EPType = null){
            $dataSet = new DataSet();
            if($useParameters){
                if($viewName != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_VIEW_NAME, $viewName);
                }
                if($name != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_NAME, $name);
                }
                if($price != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_PRICE, $price);
                }
                if($productID != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_ID, $productID);
                }
                if($color != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_COLOR, $color);
                }
                if($EPType != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_EPTYPE, $EPType);
                }
            } else {
                if(isset($_POST[ProductDB::PRODUCT_VIEW_NAME]) && $_POST[ProductDB::PRODUCT_VIEW_NAME] != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_VIEW_NAME, $_POST[ProductDB::PRODUCT_VIEW_NAME]);
                }
                if(isset($_POST[ProductDB::PRODUCT_NAME]) && $_POST[ProductDB::PRODUCT_NAME] != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_NAME, $_POST[ProductDB::PRODUCT_NAME]);
                }
                if(isset($_POST[ProductDB::PRODUCT_PRICE]) && $_POST[ProductDB::PRODUCT_PRICE] != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_PRICE, $_POST[ProductDB::PRODUCT_PRICE]);
                }
                if(isset($_POST[ProductDB::PRODUCT_ID]) && $_POST[ProductDB::PRODUCT_ID] != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_ID, $_POST[ProductDB::PRODUCT_ID]);
                }
                if(isset($_POST[ProductDB::PRODUCT_COLOR]) && $_POST[ProductDB::PRODUCT_COLOR] != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_COLOR, $_POST[ProductDB::PRODUCT_COLOR]);
                }
                if(isset($_POST[ProductDB::PRODUCT_EPTYPE]) && $_POST[ProductDB::PRODUCT_EPTYPE] != null){
                    $dataSet -> newKey(ProductDB::PRODUCT_EPTYPE, $_POST[ProductDB::PRODUCT_EPTYPE]);
                }
            }
            $response = ProductDB::get($dataSet, DataBase::FORCE_ORDERED);
            if($response != null && $withImages){
                foreach($response as $key => $product){
                    $pathBase = PATHS::parsePath(PATH_Product::get($product[ProductDB::PRODUCT_ID]));
                    $response[$key]["ImgPath"] = [];
                    if(file_exists($_SERVER["DOCUMENT_ROOT"] . $pathBase)){
                        $imgNames = File_DeepScan::scanDir($_SERVER["DOCUMENT_ROOT"] . $pathBase);
                        foreach(array_values($imgNames)[0] as $name){
                            $response[$key]["ImgPath"][str_replace('.png','', $name)] = DOMAIN . $pathBase . $name;
                        }
                    }
                    $response[$key][ProductDB::PRODUCT_SIZE] = json_decode($product[ProductDB::PRODUCT_SIZE]);
                    $response[$key][ProductDB::PRODUCT_ATTRS] = json_decode($product[ProductDB::PRODUCT_ATTRS]);
                }
            }
            Communication::sendBack($response, true, $sendBack);
            return $response;
        }
    }

    class ProductDB extends DataBase {
        public static $TBName     = "products";
        public static $DBName     = "products";
        public static $keyName;
        public static $key;
        const PRODUCT_ID                = "ID";
        const PRODUCT_NAME              = "name";
        const PRODUCT_VIEW_NAME         = "viewName";
        const PRODUCT_PRICE             = "price";
        const PRODUCT_DESCRIPTION       = "description";
        const CREATION_TIME             = "time";
        const PRODUCT_SIZE              = "size";
        const PRODUCT_ATTRS             = "attrs";
        const PRODUCT_COLOR             = "colorID";
        const PRODUCT_EPTYPE            = "EPType";
        const PRODUCT_SALES             = "sales";
        const PRODUCT_AVAILABLE_AMOUNT  = "AvailableAmount";
      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure($TBName){
          $dataset = new DataSet();
          $dataset -> newEntry(self::PRODUCT_ID,                "VARCHAR(40)");
          $dataset -> newEntry(self::PRODUCT_NAME,              "VARCHAR(40)");
          $dataset -> newEntry(self::PRODUCT_VIEW_NAME,         "VARCHAR(40)");
          $dataset -> newEntry(self::PRODUCT_PRICE,             "FLOAT(40)");
          $dataset -> newEntry(self::PRODUCT_DESCRIPTION,       "TEXT");
          $dataset -> newEntry(self::PRODUCT_SIZE,              "VARCHAR(255)");
          $dataset -> newEntry(self::PRODUCT_ATTRS,             "VARCHAR(255)");
          $dataset -> newEntry(self::PRODUCT_COLOR,             "VARCHAR(255)");
          $dataset -> newEntry(self::PRODUCT_EPTYPE,            "VARCHAR(255)");
          $dataset -> newEntry(self::PRODUCT_AVAILABLE_AMOUNT,  "INT(255)");
          $dataset -> newEntry(self::PRODUCT_SALES,             "VARCHAR(255)");
          $dataset -> newEntry(self::CREATION_TIME,             "DATETIME DEFAULT CURRENT_TIMESTAMP");
          $dataset -> primaryKey(self::PRODUCT_ID);
          $dataset -> TBName($TBName);
          return $dataset;
        }
        public static function get(DataSet $DataSet, $param = null){
            $TBName = self::$TBName . $DataSet -> TBName();
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure($TBName)));
            $DataSet -> TBName($TBName);
            return self::getData($DataSet, $con, $param);
        }
        public static function Edit(DataSet $DataSet){
            $TBName = self::$TBName . $DataSet -> TBName();
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure($TBName)));
            $DataSet -> TBName($TBName);
            self::editData($con, $DataSet);
        }
        public static function Add(DataSet $DataSet){
            $TBName = self::$TBName . $DataSet -> TBName();
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure($TBName)));
            $DataSet -> TBName($TBName);
            self::AddData($DataSet, $con);
        }
        public static function remove(DataSet $DataSet){
            $TBName = self::$TBName . $DataSet -> TBName();
            $con = self::accessDB(self::$DBName, self::generateSQL(self::getStructure($TBName)));
            $DataSet -> TBName($TBName);
            self::removeData($DataSet, $con);
        }
      }