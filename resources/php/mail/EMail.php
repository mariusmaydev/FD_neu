<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\SMTP;

    $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
    require_once $rootpath.'/fd/resources/php/CORE.php';
    require_once $rootpath.'/fd/resources/lib/PHPMailer/src/Exception.php';
    require_once $rootpath.'/fd/resources/lib/PHPMailer/src/PHPMailer.php';
    require_once $rootpath.'/fd/resources/lib/PHPMailer/src/SMTP.php';
    
    function accountVerification(){
        $dataset = new DataSet();
        $dataset -> newKey(login::USER_ID, Sessions::get(Sessions::USER_ID));
        $data = login::get($dataset);

        $mail = new EMail_FD();
        $mail -> addAddress($data[login::EMAIL], $data[login::USER_NAME]);
        $mail -> Subject = "Bestätigung";
        $mail -> content = "<p style='color: red;'>" . $data[login::CODE] . "</p> <a href='http://localhost/fd/resources/HTML/public/login/Auth.php?#" . Sessions::get(Sessions::USER_ID) . "'>LINK</a>";
        $mail -> send();
        // sendMail($data[login::USER_NAME], $data[login::EMAIL], "Test", "<p style='color: red;'>" . $data[login::CODE] . "</p> <a href='http://localhost/fd/resources/HTML/public/login/Auth.php#" . Sessions::get(Sessions::USER_ID) . "'>LINK</a>");
        // print_r(json_encode($data));
    }

    class EMail_FD {
        const host              = 'smtp.strato.de';
        const port              = 465;
        const sendFrom_Email    = 'm.may@funken-design.com';
        const sendFrom_Name     = "Funkendesign";

        public $SMTP_username   = 'm.may@funken-design.com';
        public $SMTP_password   = 'MariusNickColin';
        public $Subject         = "Betreff";
        public $content         = "Inhalt";

        private $mail;
        public function __construct(){
            $this -> mail = new PHPMailer(true);
        }
        public function addAddress($Email, $UserName){
            $this -> mail -> addAddress($Email, $UserName);
        }
        public function send(){
            self::prepare();
            try {
                $this -> mail -> send();
            } catch(Exception $e){
                debugg("PHPMailer_error: " . $this -> mail-> ErrorInfo);
            }
        }
        private function prepare(){
            global $rootpath;
            $this -> mail -> SMTPDebug  = SMTP::DEBUG_SERVER;
            $this -> mail -> isSMTP();
            $this -> mail -> Host       = self::host;
            $this -> mail -> SMTPAuth   = true;                             
            $this -> mail -> Username   = $this -> SMTP_username;                     
            $this -> mail -> Password   = $this -> SMTP_password;                           
            $this -> mail -> SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            
            $this -> mail -> Port       = self::port;                                    
            $this -> mail -> CharSet    = 'UTF-8';
            $this -> mail -> Encoding   = 'base64';
            $this -> mail -> setFrom(self::sendFrom_Email, self::sendFrom_Name);
            $this -> mail -> setLanguage('de', $rootpath . '/fd/resources/lib/PHPMailer/language/');

            $this -> mail -> isHTML(true);
            $this -> mail -> Subject = $this -> Subject;
            $this -> mail -> Body = $this -> content;
            $this -> mail -> AltBody = 'Fehler: BodyALt';
        }

    }

    // function sendMail($UserName, $Email, $Subject, $Content){
    //     global $rootpath;
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
    //         $mail->addAddress($Email, $UserName);     //Add a recipient
    //         // $mail->addAddress('ellen@example.com');               //Name is optional
    //         $mail->addReplyTo('info@example.com', 'Information');
    //         // $mail->addCC('cc@example.com');
    //         // $mail->addBCC('bcc@example.com');
    //         $mail->setLanguage('de', $rootpath.'/fd/resources/lib/PHPMailer/language/');

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