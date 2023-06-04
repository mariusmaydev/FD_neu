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
        public static function Product_img(){
            $imgID              = $_POST[ProductDB::PRODUCT_ID];
            $UploadFiles        = file_get_contents($_FILES['file']['tmp_name']);
            
            $path = PATH_Product::get(null);
            DataEdit($path, PATH_Product::getFileName($imgID), $UploadFiles);

            print_r($UploadFiles);
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