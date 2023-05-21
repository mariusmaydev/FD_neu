<?php
    require_once'balanceCORE.php';

    $Name       = $_POST["name"];
    $Amount     = $_POST["amount"];
    $Value      = $_POST["value"];
    $Comment    = $_POST["comment"];
    $DateTime   = $_POST["unix"];

    $con = accessDB_balance($TBName_balance);

    $sql = "INSERT INTO $TBName_balance (
            _Name,
            _Amount,
            _Value,
            _DateTime,
            _Comment
            ) VALUES (
            '$Name',
            '$Amount',
            '$Value',
            '$DateTime',
            '$Comment'
            )";

    $con -> query($sql);
    $con -> close();

    //print_r($ItemID);
?>