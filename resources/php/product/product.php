<?php

use GuzzleHttp\Psr7\Response;

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

    class Product {
        public static function new(){
            $name           = $_POST[ProductDB::PRODUCT_NAME];
            $viewName       = $_POST[ProductDB::PRODUCT_VIEW_NAME];
            $ID             = StringTools::realUniqID();
            $description    = $_POST[ProductDB::PRODUCT_DESCRIPTION];
            $price          = $_POST[ProductDB::PRODUCT_PRICE]; 
            $size           = json_encode($_POST[ProductDB::PRODUCT_SIZE]);
            $attrs          = json_encode($_POST[ProductDB::PRODUCT_ATTRS]);

            $dataSet = new DataSet();
            $dataSet -> newEntry(ProductDB::PRODUCT_ID, $ID);
            $dataSet -> newEntry(ProductDB::PRODUCT_NAME, $name);
            $dataSet -> newEntry(ProductDB::PRODUCT_VIEW_NAME, $viewName);
            $dataSet -> newEntry(ProductDB::PRODUCT_PRICE, $price);
            $dataSet -> newEntry(ProductDB::PRODUCT_SIZE, $size);
            $dataSet -> newEntry(ProductDB::PRODUCT_ATTRS, $attrs);
            $dataSet -> newEntry(ProductDB::PRODUCT_DESCRIPTION, $description);
            ProductDB::Add($dataSet);
            print_r($ID);
        }
        public static function remove(){
            $dataSet = new DataSet();
            $dataSet -> newEntry(ProductDB::PRODUCT_ID, $_POST[ProductDB::PRODUCT_ID]);
            ProductDB::remove($dataSet);
        }
        public static function edit(){

        }
        public static function getData(){
            $dataSet = new DataSet();
            $dataSet -> newKey(ProductDB::PRODUCT_NAME, $_POST[ProductDB::PRODUCT_NAME]);
            $res = ProductDB::get($dataSet);
            $res[ProductDB::PRODUCT_SIZE] = json_decode($res[ProductDB::PRODUCT_SIZE]);
            $res[ProductDB::PRODUCT_ATTRS] = json_decode($res[ProductDB::PRODUCT_ATTRS]);
            Communication::sendBack($res);
        }
        public static function get(){
            $dataSet = new DataSet();
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
            $response = ProductDB::get($dataSet, DataBase::FORCE_ORDERED);
            if($response != null){
                foreach($response as $key => $product){
                    $response[$key]["ImgPath"] = PATHS::parsePath(PATH_Product::get($product[ProductDB::PRODUCT_ID]));
                    $response[$key][ProductDB::PRODUCT_SIZE] = json_decode($product[ProductDB::PRODUCT_SIZE]);
                    $response[$key][ProductDB::PRODUCT_ATTRS] = json_decode($product[ProductDB::PRODUCT_ATTRS]);
                }
            }
            Communication::sendBack($response);
        }
    }

    class ProductDB extends DataBase {
        public static $TBName     = "products";
        public static $DBName     = "products";
        public static $keyName;
        public static $key;
        
        const PRODUCT_ID            = "ID";
        const PRODUCT_NAME          = "name";
        const PRODUCT_VIEW_NAME     = "viewName";
        const PRODUCT_PRICE         = "price";
        const PRODUCT_DESCRIPTION   = "description";
        const CREATION_TIME         = "time";
        const PRODUCT_SIZE          = "size";
        const PRODUCT_ATTRS         = "attrs";
      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure($TBName){
          $dataset = new DataSet();
          $dataset -> newEntry(self::PRODUCT_ID,            "VARCHAR(40)");
          $dataset -> newEntry(self::PRODUCT_NAME,          "VARCHAR(40)");
          $dataset -> newEntry(self::PRODUCT_VIEW_NAME,     "VARCHAR(40)");
          $dataset -> newEntry(self::PRODUCT_PRICE,         "FLOAT(40)");
          $dataset -> newEntry(self::PRODUCT_DESCRIPTION,   "TEXT");
          $dataset -> newEntry(self::PRODUCT_SIZE,          "VARCHAR(255)");
          $dataset -> newEntry(self::PRODUCT_ATTRS,         "VARCHAR(255)");
          $dataset -> newEntry(self::CREATION_TIME,         "DATETIME DEFAULT CURRENT_TIMESTAMP");
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