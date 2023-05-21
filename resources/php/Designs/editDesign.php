<?php

    require_once 'DesignCore.php';

    $ID             = $_POST["data"]["DesignID"];

    $con = accessDB_Designs($TBName_designs);

    if(ChangeEntry("Name", "DesignName", $TBName_designs)){
        print_r("Name changed");
    }
    if(ChangeEntry("Status", "DesignStatus", $TBName_designs)){
        print_r("Status changed");
    }
    if(ChangeEntry("Hashtags", "Hashtags", $TBName_designs)){
        print_r("Hashtags changed");
    }
    $con -> close();

    function ChangeEntry($POSTName, $EntryName, $TBName){
        global $ID;
        global $con;
        if(isset($_POST["data"][$POSTName])){
            $value  = $_POST["data"][$POSTName];
              $sql = "UPDATE $TBName SET 
              $EntryName 	= '$value'
            WHERE DesignID = '$ID'";
            
            $con -> query($sql);
            return true;
        } else {
            return false;
        }

    }
?>