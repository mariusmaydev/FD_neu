<?php

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once 'UploadCore.php';
    require_once '../converter/image/filter/filterCore.php';
    require_once '../converter/converter.php';
    require_once '../converter/image/image.php';
    require_once '../userdata/userdata.php';
    require_once '../product/product.php';
    require_once '../project/project.php';

    class Upload {
        public static function Thumbnail(){

            $data        = file_get_contents('php://input');
            
            $PATH = new PATH_Project(Sessions::get(Sessions::USER_ID), Sessions::get(Sessions::PROJECT_ID));    
                DataEdit($PATH -> get(PATH_Project::NONE), $PATH -> getFileName(PATH_Project::THUMBNAIL), $data);
                $h = file_get_contents($PATH -> get(PATH_Project::NONE) . $PATH -> getFileName(PATH_Project::THUMBNAIL), 'r+');
                // new BinaryImage($h);
                // DataEdit(realpath($_SERVER["DOCUMENT_ROOT"]) . "/fd/data/3Dmodels/Lighter/test", "test.blob", $data);

            Communication::sendBack(true);
        }
        public static function Product_img(){
            $imgID              = Image::newID();
            $UploadFiles        = $_FILES['file']['tmp_name'];
            $BoxX               = getimagesize($UploadFiles);

            // $response = [];
            // $Filter = Image::newFilterDataSet();
            // $response[0] = UploadImage($UploadFiles, $BoxX[0], json_decode(json_encode($Filter), true));

            // Debugger::log($response);
            // Communication::sendBack($response);
            $UploadFiles        = file_get_contents($_FILES['file']['tmp_name']);
            
            $path = PATH_Product::get($_POST[ProductDB::PRODUCT_ID]);
            Communication::sendBack($path);
            // exit();
            DataEdit($path, PATH_Product::getFileName($imgID), $UploadFiles);

            Communication::sendBack($UploadFiles);
        }
        public static function Unsplash_img(){
            $url = str_replace("blob:", "",$_POST["link"]);
            $imgID = Image::newID();

            $img = ImagickHelper::getImageFromURL($url);

            $BoxX = ProjectDB::LIGHTER_WIDTH * ProjectDB::SCALE;
           
            $Filter = Image::newFilterDataSet();
            $response = [];
            $response[0] = UploadImage($img, $BoxX, json_decode(json_encode($Filter), true));
        
            $response[0][ImageDB::IMAGE_SCALE_PATH]     = saveSingleProjectImage($imgID, PATH_Project::IMG_SCALE, $response[0][ImageDB::IMAGE_SCALE]);
            $response[0][ImageDB::IMAGE_VIEW_PATH]      = saveSingleProjectImage($imgID, PATH_Project::IMG_VIEW, $response[0][ImageDB::IMAGE_VIEW]);
        
            userdata_functions::addImage($response[0]);
            // userdata_functions::removeImage("632614ae523c3");
        
        
            $dataset = new DataSet();
            $dataset -> newEntry(ImageDB::IMAGE_ID,         $imgID);
            $dataset -> TBName(Image::getCompressedID());
            ImageDB::Add($dataset);
        
            $response[0][ImageDB::IMAGE_ID]     = $imgID;
            $response[0][ImageDB::IMAGE_ALIGN]  = 0;
            $response[0][ImageDB::IMAGE_FILTER] = $Filter;
            $response[0][ImageDB::IMAGE_NAME]   = "neues Bild";
            $response[0][ImageDB::IMAGE_CROP]   = false;
            print_r(json_encode($response));
        }
        public static function Converter_img(){
            $imgID              = Image::newID();
            $UploadFiles        = $_FILES['file']['tmp_name'];
            $BoxX               = ProjectDB::LIGHTER_WIDTH * ProjectDB::SCALE;//$_POST["LighterWidth"];
            
            $response = [];
            $Filter = Image::newFilterDataSet();
            $response[0] = UploadImage($UploadFiles, $BoxX, json_decode(json_encode($Filter), true));
        
        
            // foreach($response[0][ImageDB::IMAGE_SCALE] as $img){
                
            // }
            $response[0][ImageDB::IMAGE_SCALE_PATH]     = saveSingleProjectImage($imgID, PATH_Project::IMG_SCALE, $response[0][ImageDB::IMAGE_SCALE]);
            $response[0][ImageDB::IMAGE_VIEW_PATH]      = saveSingleProjectImage($imgID, PATH_Project::IMG_VIEW, $response[0][ImageDB::IMAGE_VIEW]);
        
            // userdata_functions::addImage($response[0]);
            // userdata_functions::removeImage("632614ae523c3");
        
        
            $dataset = new DataSet();
            $dataset -> newEntry(ImageDB::IMAGE_ID,         $imgID);
            $dataset -> TBName(Image::getCompressedID());
            ImageDB::Add($dataset);
        
            $response[0][ImageDB::IMAGE_ID]     = $imgID;
            $response[0][ImageDB::IMAGE_ALIGN]  = 0;
            $response[0][ImageDB::IMAGE_FILTER] = $Filter;
            $response[0][ImageDB::IMAGE_NAME]   = "neues Bild";
            $response[0][ImageDB::IMAGE_CROP]   = false;
            // Image::add();
            print_r(json_encode($response));
        }
    }