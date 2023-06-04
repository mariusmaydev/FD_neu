<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/order/orderArchive.php';
    require_once $rootpath.'/fd/resources/php/converter/image/image.php';
    require_once $rootpath.'/fd/resources/php/converter/text/text.php';
    require_once $rootpath.'/fd/resources/php/project/project.php';
    require_once $rootpath.'/fd/resources/php/lexOffice/lexOffice.php';

    class order {
        public static function new($data, $address, $userID){
            $orderID = StringTools::realUniqID();
            $DataSet = new DataSet();
            $DataSet -> newEntry(OrderDB::ORDER_ID, $orderID);
            $DataSet -> newEntry(OrderDB::USER_ID,  $userID);
            $DataSet -> newEntry(OrderDB::ITEMS,    json_encode($data));
            $DataSet -> newEntry(OrderDB::ADDRESS,  json_encode($address));
            $DataSet -> newEntry(OrderDB::STATE,    OrderDB::STATE_OPEN);
            OrderDB::Add($DataSet);
            // lexOffice::newInvoice($data, $address, $orderID, $userID);
            Communication::sendBack($orderID, false);
            return $orderID;
        }
        public static function setState(string $OrderID, $state){
            $DataSet = new DataSet();
            $DataSet -> newKey(OrderDB::ORDER_ID,   $OrderID);
            $DataSet -> newEntry(OrderDB::STATE,    $state);
            OrderDB::edit($DataSet);
        }
        public static function remove(string $orderID){
            $DataSet = new DataSet();
            $DataSet -> newEntry(OrderDB::ORDER_ID, $orderID);
            OrderDB::Delete($DataSet);
        }
        public static function edit($orderID, $data = null){
            $DataSet = new DataSet();
            $DataSet -> newKey(OrderDB::ORDER_ID, $orderID);
            if($data != null){
                $DataSet -> newEntry(OrderDB::ITEMS,    json_encode($data));
            }
            OrderDB::Edit($DataSet);
            //Communication::sendBack($orderID, false);
            //return $orderID;
        }
        public static function get(string|null $orderID = null, $UserID = null, bool $sendBack = true){
            $DataSet = new DataSet();	
            if($orderID != null){
                $DataSet -> newKey(OrderDB::ORDER_ID, $orderID);
            }
            if($UserID != null){
                $DataSet -> newKey(OrderDB::USER_ID, $UserID);
            }
            $response = OrderDB::get($DataSet, DataBase::FORCE_ORDERED);
            if($response != null){
                foreach($response as $key => $val){
                    $response[$key]["Path_PDF"] = Paths::parsePath(PATHS::buildPath($GLOBALS['SSL1'] . ($_SERVER["DOCUMENT_ROOT"]), $GLOBALS['folder'], "data", "Orders", $orderID));
                }
            }
            Communication::sendBack($response, true, $sendBack);
            return $response;
        }
        public static function createZIP($OrderID, $address){
            //$orderData = self::get($OrderID, null, false);
            $csv = new DHLcsv_S($address);
            Communication::sendBack($csv -> get(), false);
            //PATH_Project::get(PATH_Project::NC, $ProjectData[ProjectDB::PROJECT_ID], $UserID);
        }
        public static function finish($data, $address, $userID, $orderID){
            $DataSet = new DataSet();
            $DataSet -> newEntry(OrderArchiveDB::ORDER_ID, $orderID);
            $DataSet -> newEntry(OrderArchiveDB::USER_ID,  $userID);
            $DataSet -> newEntry(OrderArchiveDB::ITEMS,    json_encode($data));
            $DataSet -> newEntry(OrderArchiveDB::ADDRESS,  json_encode($address));
            $DataSet -> newEntry(OrderArchiveDB::STATE,    OrderArchiveDB::STATE_OPEN);
            OrderArchiveDB::Add($DataSet);
            // self::remove($orderID);
            foreach($data as $item){
                Debugger::log($item);
                Image::copy2Archive($item['ProjectID'], $userID);
                Text::copy2Archive($item['ProjectID'], $userID);
                Project::copy2Archive($item['ProjectID'], $userID);

                $PATH = new PATH_Project($userID, $item['ProjectID']);
                FileTools::copyDirectory($PATH -> get(PATH_Project::NONE), str_replace("Users", "Archive/Orders/" . $orderID , $PATH -> get(PATH_Project::NONE)));
                
                $PATH2 = PATHS::buildPath($GLOBALS['SSL1'] . ($_SERVER["DOCUMENT_ROOT"]), $GLOBALS['folder'], "data", "Orders").$orderID;
                FileTools::copyDirectory($PATH2, str_replace("Orders", "Archive/Orders/", $PATH2));
                FileTools::DataRemove($PATH2);

                // Project::remove($item['ProjectID']);
            }
            //Communication::sendBack($orderID, false);
            //return $orderID;
        }
        public static function saveInvoicePDF($blob, $orderID){
            $path = PATHS::buildPath($GLOBALS['SSL1'] . ($_SERVER["DOCUMENT_ROOT"]), $GLOBALS['folder'], "data", "Orders", $orderID);
            Data::edit($path, "Invoice.pdf", $blob);     
        }
        public static function saveDeliveryNotePDF($blob, $orderID){
            $path = PATHS::buildPath($GLOBALS['SSL1'] . ($_SERVER["DOCUMENT_ROOT"]), $GLOBALS['folder'], "data", "Orders", $orderID);
            Data::edit($path, "DeliveryNote.pdf", $blob);     
        }
    }
    
    class OrderDB extends DataBase {
        public static $TBName     = "orders";
        public static $DBName     = "orders";
        public static $keyName;
        public static $key;
        const ORDER_ID          = "OrderID";
        const USER_ID           = "UserID";
        const TIME              = "Time";
        const ITEMS             = "Items";
        const ADDRESS           = "Address";
        const STATE             = "State";
            const STATE_OPEN        = "OPEN";
            const STATE_CLOSED      = "CLOSED";
      
        public function __construct($key = null, $keyName = null){
            self::$key      = $key;
            self::$keyName  = $keyName;
        }
        private static function getStructure(){
          $dataset = new DataSet();
          $dataset -> newEntry(self::ORDER_ID,              "VARCHAR(40) UNIQUE");
          $dataset -> newEntry(self::USER_ID,               "VARCHAR(40)");
          $dataset -> newEntry(self::TIME,                  "DATETIME DEFAULT CURRENT_TIMESTAMP");
          $dataset -> newEntry(self::ITEMS,                 "TEXT");
          $dataset -> newEntry(self::ADDRESS,               "TEXT");
          $dataset -> newEntry(self::STATE,                 "VARCHAR(255)");
          $dataset -> primaryKey(self::ORDER_ID);
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