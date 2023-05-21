<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once$rootpath.'/fd/PHPMailer/src/Exception.php';
    require_once$rootpath.'/fd/PHPMailer/src/PHPMailer.php';
    require_once$rootpath.'/fd/PHPMailer/src/SMTP.php';
    //Import PHPMailer classes into the global namespace
    //These must be at the top of your script, not inside a function

    //Load Composer's autoloader
    //require_once'vendor/autoload.php';

    //Create an instance; passing `true` enables exceptions
    
    // function sendMail($recipient, $UserName, $Subject, $Content){
    //     $mail = new PHPMailer(true);
    //     try {
    //         //Server settings
    //         $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
    //         $mail->isSMTP();                                            //Send using SMTP
    //         $mail->Host       = 'smtp.strato.de';                     //Set the SMTP server to send through
    //         $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    //         $mail->Username   = 'm.may@funken-design.com';                     //SMTP username
    //         $mail->Password   = 'MariusNickColin';                               //SMTP password
    //         $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    //         $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    //         $mail->CharSet    = 'UTF-8';
    //         $mail->Encoding   = 'base64';

    //         //Recipients
    //         $mail->setFrom('m.may@funken-design.com', 'Mailmann');
    //         $mail->addAddress('Marius006@gmx.de', $UserName);     //Add a recipient
    //         $mail->addAddress('ellen@example.com');               //Name is optional
    //         $mail->addReplyTo('info@example.com', 'Information');
    //         $mail->addCC('cc@example.com');
    //         $mail->addBCC('bcc@example.com');
    //         $mail->setLanguage('de', '../../PHPMailer/language/');

    //         //Attachments
    //         //$mail->addAttachment('../../EMailData/test-dateien/colorschememapping.xml');         //Add attachments
    //         //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //         //Content
    //         $mail->isHTML(true);                                  //Set email format to HTML
    //         $mail->Subject = $Subject;
    //         $mail->Body    = $Content;
    //         $mail->AltBody = 'Fehler: BodyALt';

    //         $mail->send();
    //     } catch (Exception $e) {
    //         echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    //     }
    // }
?>