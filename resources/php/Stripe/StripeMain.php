<?php
// require_once('../../../vendor/autoload.php');
$rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $rootpath.'/fd/resources/php/CORE.php';
require_once $rootpath.'/fd/resources/php/vendor/autoload.php';
 
use Omnipay\Omnipay;
 
$gateway = Omnipay::create('PayPal_Pro');
$gateway->setUsername("MariusMayTrading_api1.gmx.de");
$gateway->setPassword("HWNZ44JV34HRQQQU");
$gateway->setSignature("AxLfE5P0CZXQJuQum7kwzHpgk24NAPM964SpX2PBFjFOfIKlVKxTy22b");
$gateway->setTestMode(true); // here 'true' is for sandbox. Pass 'false' when go live
 
if (isset($_POST['submit'])) {
 
    $arr_expiry = explode("/", $_POST['expiry']);
 
    $formData = array(
        'firstName' => $_POST['first-name'],
        'lastName' => $_POST['last-name'],
        'number' => $_POST['number'],
        'expiryMonth' => trim($arr_expiry[0]),
        'expiryYear' => trim($arr_expiry[1]),
        'cvv' => $_POST['cvc']
    );
 
    try {
        // Send purchase request
        $response = $gateway->purchase([
                'amount' => $_POST['amount'],
                'currency' => 'USD',
                'card' => $formData
        ])->send();
 
        // Process response
        if ($response->isSuccessful()) {
 
            // Payment was successful
            echo "Payment is successful. Your Transaction ID is: ". $response->getTransactionReference();
 
        } else {
            // Payment failed
            print_r($response);
            echo "Payment failed. ". $response->getMessage();
        }
    } catch(Exception $e) {
        echo $e->getMessage();
    }
}
// $key_public = "pk_test_51Oj1TcCFoYzhepR8dQA91dPhw7IGJQtLbrsLCoxAvQPTrCZtIJPEvaIA867zPL3NCL8t6glG1Za8MJ2ABbKhS8XK00Ozs77LhH";
// $key_private = "sk_test_51Oj1TcCFoYzhepR8tg2ad3XERJwcH5UR1byzBQQZtjNvrvOjNN8i9hIkCkAPpfqtvrzSaBcelfNAOlYhX59TGL1T00Kn0ILGpK";
// \Stripe\Stripe::setApiKey($key_private);

// $checkout_session = \Stripe\Checkout\Session::create([
//     "mode" => "payment",
//     "success_url" => "http://localhost/fd/resources/HTML/Admin/stripeSuccess.php",
//     "line_items" => [
//         [
//             "quantity" => 1,
//             "price_data" => [
//                 "currency" => "usd",
//                 "unit_amount" => 2000,
//                 "product_data" => [
//                     "name" => "T-shirt"
//                 ]
//             ]
//         ]
//     ]
// ]);
// Communication::sendBack($checkout_session);