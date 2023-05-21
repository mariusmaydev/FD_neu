<?php
  require_once 'DesignCore.php';


    $con = accessDB_Designs($TBName_designs);

    $sql = "SELECT * FROM $TBName_designs";
    if (isset($_POST["Status"])) {
        $sql = "SELECT * FROM $TBName_designs WHERE DesignStatus = 'listed'";
    }
    $res = $con -> query($sql);
      
    $e = 0;
    $response = array();
    if($res -> num_rows > 0){
      while($i = $res -> fetch_assoc()){
        if(isset($_POST["requestedHashtags"]) && compareAndCheckArray(json_decode($_POST["requestedHashtags"]), json_decode($i["Hashtags"]))){
          $response[$e]["DesignID"]     = $i["DesignID"];
          $response[$e]["DesignName"]   = $i["DesignName"];
          $response[$e]["DesignData"]   = $i["DesignData"];
          $response[$e]["Thumbnail"]    = $i["Thumbnail"];
          $response[$e]["UserID"]       = $i["UserID"];
          $response[$e]["ProjectID"]    = $i["ProjectID"];
          $response[$e]["Hashtags"]     = $i["Hashtags"];
          $response[$e]["Settings"]     = $i["Settings"];
          $response[$e]["DesignStatus"] = $i["DesignStatus"];
          $e++;
        } else if(!isset($_POST["requestedHashtags"])){
          $response[$e]["DesignID"]     = $i["DesignID"];
          $response[$e]["DesignName"]   = $i["DesignName"];
          $response[$e]["DesignData"]   = $i["DesignData"];
          $response[$e]["Thumbnail"]    = $i["Thumbnail"];
          $response[$e]["UserID"]       = $i["UserID"];
          $response[$e]["ProjectID"]    = $i["ProjectID"];
          $response[$e]["Hashtags"]     = $i["Hashtags"];
          $response[$e]["Settings"]     = $i["Settings"];
          $response[$e]["DesignStatus"] = $i["DesignStatus"];
          $e++;
        }
      }
    }
    $con -> close();
    print_r(json_encode($response));
?>