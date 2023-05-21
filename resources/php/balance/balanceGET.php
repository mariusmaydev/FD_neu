<?php
    require_once'balanceCORE.php';

    $response = array();
    $con = accessDB_balance($TBName_balance);

    if(isset($_POST["name"]) && $_POST["name"] != ""){
        $Name = $_POST["name"];
        $sql = "SELECT * FROM $TBName_balance WHERE _Name = '$Name'";
        $res = $con -> query($sql);

        if($res -> num_rows > 0){
            while($i = $res -> fetch_assoc()){
                $response["name"]       = $i["_Name"];
                $response["value"]      = $i["_Value"];
                $response["amount"]     = $i["_Amount"];
                $response["comment"]    = $i["_Comment"];
                $response["datetime"]   = $i["_DateTime"];
            }
        } else {
            print_r(json_encode(false));
        }
    } else if(isset($_POST["unix"]) && $_POST["unix"] != ""){
        $Unix = $_POST["unix"];
        $sql = "SELECT * FROM $TBName_balance WHERE _DateTime = '$Unix'";
        $res = $con -> query($sql);

        if($res -> num_rows > 0){
            while($i = $res -> fetch_assoc()){
                $response["name"]       = $i["_Name"];
                $response["value"]      = $i["_Value"];
                $response["amount"]     = $i["_Amount"];
                $response["comment"]    = $i["_Comment"];
                $response["datetime"]   = $i["_DateTime"];
            }
        } else {
            print_r(json_encode(false));
        }
    } else {
        $res = selectTB($con, $TBName_balance);
        if($res -> num_rows > 0){
          $e = 0;
          while($i = $res -> fetch_assoc()){
            $response["name".$e]       = $i["_Name"];
            $response["value".$e]      = $i["_Value"];
            $response["amount".$e]     = $i["_Amount"];
            $response["comment".$e]    = $i["_Comment"];
            $response["datetime".$e]   = $i["_DateTime"];
            $e++;
          }
        } else {
            print_r(json_encode(false));
        }
    }
    $con -> close();
    if($response != null){
        print_r(json_encode($response));
    }
?>