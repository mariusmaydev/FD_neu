<?php
    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once$rootpath.'/fd/resources/php/CORE.php';

    function accessDB_balance($TBName_balance){
        global $DBName_balance;

        $con = connectToServer();
        
        createDBifNotExist($DBName_balance, $con);
        
        $sql = "CREATE TABLE IF NOT EXISTS $TBName_balance (
            _Name       INDEX VARCHAR(40),
            _Amount     INTEGER(255),
            _Value      FLOAT(40),
            _DateTime   INDEX INTEGER(20),
            _Comment    TEXT(40),
            PRIMARY KEY (_DateTime)
            )";
        $con -> query($sql);

        return $con;
    }
?>