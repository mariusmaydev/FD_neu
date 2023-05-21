<?php
    require_once 'DesignCore.php';
    
    $data           = $_POST["data"];
    $DesignName     = $data["DesignName"];        
    $UserID         = $data["UserID"];
    $ProjectID      = $data["ProjectID"];
    $Hashtags       = $data["Hashtags"];
    $DesignData     = $data["DesignData"];
    $Thumbnail      = $data["Thumbnail"];
    $Settings       = $data["Settings"];
    $DesignStatus   = $data["Status"];
    $DesignID      = uniqid();

    $con = accessDB_Designs($TBName_designs);

    $sql = "INSERT INTO $TBName_designs (
            DesignID,
            DesignName,
            UserID,
            ProjectID,
            Hashtags,
            DesignData,
            Settings,
            Thumbnail,
            DesignStatus
            ) VALUES (
            '$DesignID',
            '$DesignName',
            '$UserID',
            '$ProjectID',
            '$Hashtags',
            '$DesignData',
            '$Settings',
            '$Thumbnail',
            '$DesignStatus'
            )";
    $con -> query($sql);
    $con -> close();

    $path = PATH_DesignProject($DesignID);
    DataEdit($path['relPath'], $path['file']['data'], $DesignData);
    DataEdit($path['relPath'], $path['file']['thumbnail'], $Thumbnail);
    print_r($DesignID);
?>