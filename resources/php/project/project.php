<?php

// use Stripe\BillingPortal\Session;

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/php/converter/converter.php';
    require_once $rootpath.'/fd/resources/php/converter/converterCore.php';
    require_once $rootpath.'/fd/resources/php/converter/text/text.php';
    require_once $rootpath.'/fd/resources/php/converter/image/image.php';
    require_once $rootpath.'/fd/resources/php/project/projectArchive.php';



    class Project {
        /**
         * !test
         * 
         * @param [type] $Storage
         * @param boolean $editThumbnail
         * @return void
         */
        static function edit($Storage = null, bool $editThumbnail = true){
            if($Storage == null){
                return;
            }
            $DataSet = new DataSet();
            if($Storage[ProjectDB::STATE] != null){
                $DataSet -> newEntry(ProjectDB::STATE, $Storage[ProjectDB::STATE]);
            } 
            $DataSet -> newEntry(ProjectDB::EPTYPE, $Storage[ProjectDB::EPTYPE]);
            $DataSet -> newEntry(ProjectDB::PRODUCT, $Storage[ProjectDB::PRODUCT]);
            $DataSet -> newEntry(ProjectDB::SQUARE, json_encode($Storage[ProjectDB::SQUARE]));
            $DataSet -> newKey(ProjectDB::PROJECT_ID, $Storage[ProjectDB::PROJECT_ID]);
            if(Sessions::get(Sessions::ADMIN) == true){
                $DataSet -> TBName(Sessions::ADMIN);
            } else {
                $DataSet -> TBName(Sessions::get(Sessions::USER_ID));
            }
            AccessDB::edit(ProjectDB::getStruct(), $DataSet);
            if($editThumbnail){
                self::editImages(Sessions::get(Sessions::USER_ID), $Storage[ProjectDB::PROJECT_ID], $Storage["Thumbnail"]);
            }
            // Communication::sendBack(null);
        }
        static function removeFromDesign(array|null $hashtags, array|null $categories, $ProjectID = null, $UserID = null, $print = true) : void {
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            $DataSet = new DataSet();
            $DataSet -> newEntry(ProjectDB::DESIGN);
            $DataSet -> newKey(ProjectDB::PROJECT_ID, $ProjectID);
            $DataSet -> TBName($UserID);
            $res = AccessDB::get(ProjectDB::getStruct(), $DataSet, DataBase::DENY_ORDERED);
            $res = json_decode($res[ProjectDB::DESIGN], true);

            // $res -> Tags = array_intersect($res -> Tags, $hashtags);
            // $res -> Categories = array_intersect($res -> Categories, $categories);
            // $ProjectData = AccessDB::get(ProjectDB::getStruct(), $DataSet);
            // $DataSet = new DataSet();
            // $DataSet -> newEntry()
            if($hashtags != null){
                foreach($hashtags as $tag){
                    if (in_array($tag, $res["Tags"])){
                        unset($res["Tags"][array_search($tag, $res["Tags"])]);
                    }
                }
            }
            if($categories != null){
                foreach($categories as $category){
                    if (in_array($category, $res["Categories"])){
                        unset($res["Categories"][array_search($category, $res["Categories"])]);
                    }
                }
            }
            
            $DataSet = new DataSet();
            $DataSet -> newEntry(ProjectDB::DESIGN, json_encode($res));
            $DataSet -> newKey(ProjectDB::PROJECT_ID, $ProjectID);
            $DataSet -> TBName($UserID);
            AccessDB::edit(ProjectDB::getStruct(), $DataSet);
            Communication::sendBack($res);
        }
        static function addToDesign(array|null $hashtags, array|null $categories, $ProjectID = null, $UserID = null, $print = true) : void {
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            $DataSet = new DataSet();
            $DataSet -> newEntry(ProjectDB::DESIGN);
            $DataSet -> newKey(ProjectDB::PROJECT_ID, $ProjectID);
            $DataSet -> TBName($UserID);
            $res = AccessDB::get(ProjectDB::getStruct(), $DataSet, DataBase::DENY_ORDERED);
            $res = json_decode($res[ProjectDB::DESIGN], true);
            if($hashtags != null){
                $res["Tags"] = array_merge($res["Tags"], $hashtags);
                $res["Tags"] = array_unique($res["Tags"]);
            }
            if($categories != null){
                $res["Categories"] = array_merge($res["Categories"], $categories);
                $res["Categories"] = array_unique($res["Categories"]);
            }

            $DataSet = new DataSet();
            $DataSet -> newEntry(ProjectDB::DESIGN, json_encode($res));
            $DataSet -> newKey(ProjectDB::PROJECT_ID, $ProjectID);
            $DataSet -> TBName($UserID);
            AccessDB::edit(ProjectDB::getStruct(), $DataSet);
            Communication::sendBack($res);
        }
        static function changeState(){
            $DataSet = new DataSet();
            $DataSet -> newEntry(ProjectDB::STATE, $_POST[ProjectDB::STATE]);
            $DataSet -> newKey(ProjectDB::PROJECT_ID, $_POST[ProjectDB::PROJECT_ID]);
            if(Sessions::get(Sessions::ADMIN) == true){
                $DataSet -> TBName(Sessions::ADMIN);
            } else {
                $DataSet -> TBName(Sessions::get(Sessions::USER_ID));
            }
            AccessDB::edit(ProjectDB::getStruct(), $DataSet);
        }
        static function editImages($UserID, $ProjectID, $thumbnail = null, $FullNC = null, $SVG = null){
            $PATH = new PATH_Project($UserID, $ProjectID);
            if($thumbnail != null){                
                DataEdit($PATH -> get(PATH_Project::NONE), $PATH -> getFileName(PATH_Project::THUMBNAIL), base64_to_png($thumbnail));
              }
              if($FullNC != null){
                DataEdit($PATH -> get(PATH_Project::NONE), $PATH -> getFileName(PATH_Project::NC), $FullNC);
              }
              if($SVG != null){
                DataEdit($PATH -> get(PATH_Project::NONE), $PATH -> getFileName(PATH_Project::SVG), $SVG);
              }
        }
        static function copyToUser($projectID, $UserID = null, bool $print = true){
            
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }

        }
        static function copy($projectID, $UserID = null, $NewProjectID = null, $FromUserID = null, bool $print = true){
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            if($FromUserID == null){
                $FromUserID = $UserID;
            }
            
            $ProjectData = self::get($projectID, $FromUserID, false);
            $NewProjectID = self::new($ProjectData[ProjectDB::PROJECT_NAME], $ProjectData[ProjectDB::PRODUCT], $UserID, $NewProjectID, false);
            $ProjectData[ProjectDB::PROJECT_ID] = $NewProjectID;
            $ProjectData[ProjectDB::STATE] = ProjectDB::STATE_NORMAL;
            self::edit($ProjectData, false);

            $imageData = Image::get(null, $projectID, $FromUserID, false);
            foreach($imageData as $img){
                $img[ImageDB::IMAGE_FILTER] = json_encode(json_encode(json_decode(json_encode($img[ImageDB::IMAGE_FILTER]), true)));
                Image::add($img, $img[ImageDB::IMAGE_ID], $NewProjectID, $UserID);
                $response = [];
                getProjectImages($response, $FromUserID, $projectID, $img[ImageDB::IMAGE_ID]);
                saveSingleProjectImage($img[ImageDB::IMAGE_ID], PATH_Project::IMG_SCALE, $response[ImageDB::IMAGE_SCALE], $UserID, $NewProjectID);
                saveSingleProjectImage($img[ImageDB::IMAGE_ID], PATH_Project::IMG_VIEW, $response[ImageDB::IMAGE_VIEW], $UserID, $NewProjectID);
            }

            $PATH = new PATH_Project(Sessions::get(Sessions::USER_ID), $NewProjectID);
            Path::copyFile($GLOBALS['SSL1'].($_SERVER["DOCUMENT_ROOT"]).$ProjectData["Thumbnail"], $PATH -> get(PATH_Project::NONE, $NewProjectID, $UserID). $PATH -> getFileName(PATH_Project::THUMBNAIL));
            
            $textData = Text::get(null, $FromUserID, $projectID, false);
            foreach($textData as $text){
                Text::add($text, $UserID, $NewProjectID, $text[TextDB::TEXT_ID], false);
                $textImg = Text::getTextImg($text[TextDB::TEXT_ID], $projectID, $FromUserID);
                Text::saveTextImg($textImg, $text[TextDB::TEXT_ID], $NewProjectID, $UserID);
            }
            Communication::sendBack($NewProjectID, false, $print);
            return $NewProjectID;
        }
        static function new($projectName, $Product, $UserID = null, $NewProjectID = null, $setSessions = true, $Original = false){
            $Design = new stdClass();
            $Design -> Tags = [];
            $Design -> Categories = [];
            $Design = json_encode($Design, true);

            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            $ProjectID = StringTools::realUniqID();
            if($NewProjectID != null){
                $ProjectID = $NewProjectID;
            }
            $State = ProjectDB::STATE_NORMAL;
            $DataSet = new DataSet();
            if(Sessions::get(Sessions::ADMIN) == true){
                $DataSet -> TBName(Sessions::ADMIN);
                $State = ProjectDB::STATE_ADMIN;
            } else {
                $DataSet -> TBName($UserID);
            }
            
            $DataSet -> newEntry(ProjectDB::PROJECT_ID,     $ProjectID);
            $DataSet -> newEntry(ProjectDB::PROJECT_NAME,   $projectName);
            $DataSet -> newEntry(ProjectDB::STATE,          $State);
            $DataSet -> newEntry(ProjectDB::EPTYPE,         "GOLD");
            $DataSet -> newEntry(ProjectDB::PRODUCT,        $Product);
            $DataSet -> newEntry(ProjectDB::ORIGINAL,       $Original);
            $DataSet -> newEntry(ProjectDB::DESIGN,         $Design);
            $obj = new stdClass();
            $obj -> width   = "";
            $obj -> height  = "";
            $DataSet -> newEntry(ProjectDB::SQUARE,         json_encode($obj));
            AccessDB::add(ProjectDB::getStruct(), $DataSet);

            if($setSessions){
                Sessions::set(Sessions::PROJECT_ID, $ProjectID);
                Sessions::set(Sessions::PROJECT_NAME, $projectName);
            }
            return $ProjectID;
        }
        static function remove($ProjectID){
            $project = self::get($ProjectID);
            if($project[ProjectDB::STATE] != "ADMIN"){
                $DataSet = new DataSet();
                $DataSet -> newEntry(ProjectDB::PROJECT_ID, $ProjectID);
                $DataSet -> TBName(Sessions::get(Sessions::USER_ID));
                AccessDB::remove(ProjectDB::getStruct(), $DataSet);
                DataRemove(PATH_Project::get(PATH_Project::NONE, $ProjectID, Sessions::get(Sessions::USER_ID)));

                $DataSet = new DataSet();
                $DataSet -> TBName(Text::getCompressedID(Sessions::get(Sessions::USER_ID), $ProjectID));
                TextDB::removeTable($DataSet);

                $DataSet = new DataSet();
                $DataSet -> TBName(Text::getCompressedID(Sessions::get(Sessions::USER_ID), $ProjectID));
                ImageDB::removeTable($DataSet);
            } else {
                $DataSet = new DataSet();
                $DataSet -> newEntry(ProjectDB::PROJECT_ID, $ProjectID);
                $DataSet -> TBName('admin');
                AccessDB::remove(ProjectDB::getStruct(), $DataSet);
                DataRemove(PATH_Project::get(PATH_Project::NONE, $ProjectID, 'ADMIN'));

                $DataSet = new DataSet();
                $DataSet -> TBName(Text::getCompressedID('ADMIN', $ProjectID));
                TextDB::removeTable($DataSet);

                $DataSet = new DataSet();
                $DataSet -> TBName(Text::getCompressedID('ADMIN', $ProjectID));
                ImageDB::removeTable($DataSet);

            }
        }
        static function getAll($UserID = null, $State = null, bool $print = true){
            if($UserID == null){
                $UserID = Sessions::get(Sessions::USER_ID);
            }
            $DataSet = new DataSet();
            $DataSet -> TBName(strtolower($UserID));
            if($State != null){
                $DataSet -> newKey(ProjectDB::STATE, $State);
            }
            $ProjectData = AccessDB::get(ProjectDB::getStruct(), $DataSet, DataBase::FORCE_ORDERED);
            if($ProjectData != null){
                foreach($ProjectData as $key => $project){
                    $ProjectData[$key][ProjectDB::SQUARE] = json_decode($project[ProjectDB::SQUARE]);
                    $ProjectData[$key][ProjectDB::DESIGN] = json_decode($project[ProjectDB::DESIGN], true);
                    $ProjectData[$key] = array_merge($ProjectData[$key], self::getImages($project[ProjectDB::PROJECT_ID]));
                    $PATH = new PATH_Project($UserID, $project[ProjectDB::PROJECT_ID]);
                    $ProjectData[$key]["Thumbnail"]   = Paths::parsePath($PATH -> get(PATH_Project::NONE). $PATH -> getFileName(PATH_Project::THUMBNAIL));
                }
            }

            Communication::sendBack($ProjectData, true, $print);
            return $ProjectData;
        }
        static function getAllAdmin($isOriginal = false, bool $print = true){
            $UserID = "ADMIN";
            $DataSet = new DataSet();
            if($isOriginal == 'true'){
                $DataSet -> newKey(ProjectDB::ORIGINAL, $isOriginal);
            } else if($isOriginal == 'false'){
                $DataSet -> newKey(ProjectDB::ORIGINAL, $isOriginal);
            }
            $DataSet -> TBName(strtolower($UserID));
            $ProjectData = AccessDB::get(ProjectDB::getStruct(), $DataSet, DataBase::FORCE_ORDERED);
            
            if($ProjectData != null){
                foreach($ProjectData as $key => $project){
                    $ProjectData[$key][ProjectDB::SQUARE] = json_decode($project[ProjectDB::SQUARE]);
                    $ProjectData[$key][ProjectDB::DESIGN] = json_decode($project[ProjectDB::DESIGN], true);
                    $ProjectData[$key] = array_merge($ProjectData[$key], self::getImages($project[ProjectDB::PROJECT_ID]));
                    $PATH = new PATH_Project($UserID, $project[ProjectDB::PROJECT_ID]);
                    $ProjectData[$key]["Thumbnail"]   = Paths::parsePath($PATH -> get(PATH_Project::NONE). $PATH -> getFileName(PATH_Project::THUMBNAIL));
                }
            }

            Communication::sendBack($ProjectData, true, $print);
            return $ProjectData;
        }
        static function get($ProjectID = null, $UserID = null, bool $print = true){

            if($UserID == null){
                if(Sessions::get(Sessions::ADMIN) == true){
                    $UserID = Sessions::ADMIN;
                } else {
                    $UserID = Sessions::get(Sessions::USER_ID);
                }
            }
            if($ProjectID == null){
                $ProjectID = Sessions::get(Sessions::PROJECT_ID);
            }
            $DataSet = new DataSet();
            $DataSet -> newKey(ProjectDB::PROJECT_ID, $ProjectID);
            $DataSet -> TBName($UserID);
            $ProjectData = AccessDB::get(ProjectDB::getStruct(), $DataSet);
            if($ProjectData == null || $ProjectData == ""){
                Communication::sendBack($ProjectID, true, $print);
                return false;
            }
            $response = $ProjectData;
            $response[ProjectDB::SQUARE] = json_decode($ProjectData[ProjectDB::SQUARE]);
            $response[ProjectDB::DESIGN] = json_decode($ProjectData[ProjectDB::DESIGN], true);
            // $response = array_merge($response, self::getImages($ProjectData[ProjectDB::PROJECT_ID]));

            $PATH = new PATH_Project($UserID, $ProjectID);
            $response["Thumbnail"]   = Paths::parsePath($PATH -> get(PATH_Project::THUMBNAIL));

            Communication::sendBack($response, true, $print);
            return $response;
        }
        static function getImages($ProjectID){
            $PATH = new PATH_Project(Sessions::get(Sessions::USER_ID), $ProjectID);
            $response = [];
            $response["FullNC"]      = DataGet($PATH -> get(PATH_Project::NC));
            $response["SVG"]         = DataGet($PATH -> get(PATH_Project::SVG));
            $response["Thumbnail"]   = DataGet($PATH -> get(PATH_Project::THUMBNAIL));
            return $response;
        }
        public static function copy2Archive($ProjectID, $UserID){
            $data = self::get($ProjectID, $UserID, false);
            $DataSet = new DataSet();
            $DataSet -> newEntry(ProjectArchiveDB::PROJECT_ID,     $ProjectID);
            $DataSet -> newEntry(ProjectArchiveDB::PROJECT_NAME,   $data[ProjectDB::PROJECT_NAME]);
            $DataSet -> newEntry(ProjectArchiveDB::STATE,          ProjectDB::STATE_NORMAL);
            $DataSet -> newEntry(ProjectArchiveDB::EPTYPE,         $data[ProjectDB::EPTYPE]);
            $DataSet -> newEntry(ProjectArchiveDB::ORIGINAL,       $data[ProjectDB::ORIGINAL]);
            $DataSet -> newEntry(ProjectArchiveDB::PRODUCT,        $data[ProjectDB::PRODUCT]);
            $DataSet -> newEntry(ProjectArchiveDB::SQUARE,         json_encode($data[ProjectDB::SQUARE]));
            $DataSet -> newEntry(ProjectArchiveDB::FIRST_TIME,     $data[ProjectDB::FIRST_TIME]);
            $DataSet -> newEntry(ProjectArchiveDB::LAST_TIME,      $data[ProjectDB::LAST_TIME]);
            $DataSet -> TBName($UserID);
            AccessDB::add(ProjectArchiveDB::getStruct(), $DataSet);
        }
    }

    class ProjectDB extends DataBase {
        public static $TBName     = "projects_";
        public static $DBName     = "projects";
        public static $keyName;
        public static $key;
        
        const IS_ADMIN              = "IS_ADMIN";
        const PROJECT_ID            = "ProjectID";
        const PROJECT_NAME          = "ProjectName";
        const EPTYPE                = "EPType";
        const SQUARE                = "Square";
        const FIRST_TIME            = "First_Time";
        const LAST_TIME             = "Last_Time";
        const PRODUCT               = "Product";
        const ORIGINAL              = "Original";
        const DESIGN                = "Design";
        const STATE                 = "State";
            const STATE_NORMAL          = "NORMAL";
            const STATE_CART            = "CART";
            const STATE_ORDER           = "ORDER";
            const STATE_ADMIN           = "ADMIN";

        const LIGHTER_WIDTH         = 38;
        const LIGHTER_HEIGHT        = 57.5;
        const SCALE                 = 61.29;

        public static function getStruct(){
            $DS2 = new DataSet();
            $DS2 -> newEntry(ProjectDB::PROJECT_ID,    "VARCHAR(40)");
            $DS2 -> newEntry(ProjectDB::PROJECT_NAME,  "VARCHAR(40)");
            $DS2 -> newEntry(ProjectDB::STATE,         "VARCHAR(40)"); 
            $DS2 -> newEntry(ProjectDB::EPTYPE,        "VARCHAR(255)");
            $DS2 -> newEntry(ProjectDB::PRODUCT,       "VARCHAR(40)");
            $DS2 -> newEntry(ProjectDB::ORIGINAL,      "VARCHAR(40)");
            $DS2 -> newEntry(ProjectDB::DESIGN,        "TEXT");
            $DS2 -> newEntry(ProjectDB::SQUARE,        "TEXT");
            $DS2 -> newEntry(ProjectDB::FIRST_TIME,    "DATETIME DEFAULT CURRENT_TIMESTAMP");
            $DS2 -> newEntry(ProjectDB::LAST_TIME,     "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
            $DS2 -> primaryKey(ProjectDB::PROJECT_ID);
            $DS2 -> TBName("projects_");
            $DS2 -> DBName("projects");
            return $DS2;
        }
      }


?>