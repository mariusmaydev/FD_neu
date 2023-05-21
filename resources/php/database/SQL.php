<?php

    // $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    // require_once $rootpath.'/fd/resources/php/CORE.php';

    // class SQL {
    //     const SERVERNAME    = 'localhost';
    //     const USER          = 'root';
    //     const PASSWORD      = '';
    //     public function __construct(){

    //     }
    //     public static function connectToServer() : bool|mysqli {
    //         $con = new mysqli(self::SERVERNAME, self::USER, self::PASSWORD);
    //         if($con -> connect_error){
    //             return false;
    //         } else {
    //             return $con;
    //         }
    //     }
    //     public static function createDB(string $DBName, mysqli $con) : bool {
    //         $sql = "CREATE DATABASE IF NOT EXISTS $DBName";
    //         if ($con -> query($sql)) {
    //             $con -> select_db($DBName); 
    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }
    //     public static function removeDB(){

    //     }
    //     public static function createTable(){

    //     }
    //     public static function removeTable(){

    //     }

    // }

    // class SQL_Helper {
    //     public static function selectTB(string $TBName, mysqli $con) : mysqli_result|bool {
    //         $sql = "SELECT * FROM $TBName";
    //         $res = $con -> query($sql);
    //         return $res;
    //     }
    //     // public static function 
    // }