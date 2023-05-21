<?php
    require_once 'sendMail.php'; 
    $recipient  = $_POST["recipient"];
    $UserName   = $_POST["UserName"];
    $UserID     = $_POST["UserID"];
    $Code       = $_POST["Code"];
    $Subject    = "Passwort zurücksetzen";
    $Content    = "Passwort zurücksetzen<br><br>Dein Code: ".$Code."<br><a href='http://localhost/fd/resources/HTML/public/login/ResetPassword.php?Code=".$Code."&UserID=".$UserID."'>Verifizierungslink</a>"; 
    sendMail($recipient, $UserName, $Subject, $Content);
?>