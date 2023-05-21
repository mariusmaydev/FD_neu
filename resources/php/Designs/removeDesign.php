<?php
    require_once 'DesignCore.php';

    $DesignID             = $_POST["DesignID"];

    $con = accessDB_Designs($TBName_designs);
  
    $sql = "DELETE FROM $TBName_designs WHERE DesignID = '$DesignID'";
    $con -> query($sql);
    $con -> close();
?>