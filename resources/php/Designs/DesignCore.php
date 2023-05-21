<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';

function accessDB_Designs($TBName_designs)
{
    global $DBName_designs;

    $con = connectToServer();

    createDBifNotExist($DBName_designs, $con);

    $sql = "CREATE TABLE IF NOT EXISTS $TBName_designs (
            DesignID            VARCHAR(40),
            DesignName          VARCHAR(255),
            UserID              VARCHAR(255),
            ProjectID           VARCHAR(255),
            Hashtags            VARCHAR(255),
            DesignData          LONGTEXT,
            Settings            VARCHAR(255),
            Thumbnail           LONGBLOB,
            DesignStatus        VARCHAR(255),
            PRIMARY KEY (DesignID)
            )";
    $con -> query($sql);

    return $con;
    }

    function compareAndCheckArray($array1, $array2){
      if($array1 == null){
        return true;
      }
      if($array2 == null){
        return false;
      }
        for($i = 0; $i < count($array1); $i++){
          if(!in_array($array1[$i], $array2)){
            return false;
          }
        }
        return true;
      }

    // function searchFreeIndex($UserID, $ProjectID){
    //     global $TBName_image;
    //     $TBName = $TBName_image."_".GenerateCompressedID($ProjectID, $UserID);

    //     $con = accessDB_images($TBName);

    //     $res = selectTB($con, $TBName);
    //     if ($res -> num_rows > 0) {
    //         while ($i = $res -> fetch_assoc()) {
    //             if($i["ImagePosX"] == -1){
    //                 return $i["ImageID"];
    //             }
    //         }
    //     }
    // }

?>