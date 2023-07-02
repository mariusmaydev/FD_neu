<?php namespace test;

    require_once 'testspace.php';
    switch(Communication::getAccess()){
        case "GET_PATH"        : test::test($_POST["PATH"], $_POST["EXT"]); break;
        default: Communication::sendBack("METHOD_ERROR"); exit;
    }