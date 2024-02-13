<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <meta name="robots" content="noindex"/>
        <meta name="robots" content="nofollow"/>
    <title>Online Payments</title>
    <link rel="stylesheet" href="css/card.css">
</head>
<body>
    <form method="POST" action="charge.php">
        <div class="form-container">
            <div class="personal-information">
                <h1>Payment Information</h1>
            </div> <!-- end of personal-information -->
             
            <input id="column-left" type="text" name="first-name" placeholder="First Name" required="required" />
            <input id="column-right" type="text" name="last-name" placeholder="Surname" required="required" />
            <input id="input-field" type="text" name="number" placeholder="Card Number" required="required" />
            <input id="column-left" type="text" name="expiry" placeholder="MM / YY" required="required" />
            <input id="column-right" type="text" name="cvc" placeholder="CCV" required="required" />
 
            <div class="card-wrapper"></div>
 
            <input id="input-field" type="text" name="streetaddress" required="required" autocomplete="on" maxlength="45" placeholder="Streed Address" />
            <input id="column-left" type="text" name="city" required="required" autocomplete="on" maxlength="20" placeholder="City" />
            <input id="column-right" type="text" name="zipcode" required="required" autocomplete="on" pattern="[0-9]*" maxlength="5" placeholder="ZIP code" />
            <input id="input-field" type="email" name="email" required="required" autocomplete="on" maxlength="40" placeholder="Email" />
            <input id="input-field" type="text" name="amount" required="required" autocomplete="on" maxlength="40" placeholder="Amount" />
            <input id="input-button" name="submit" type="submit" value="Submit" />
 
        </div>
    </form>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js"></script>
    <script src="../../js/ADMIN/pages/jquery.card.js"></script>
    <script src="../../js/ADMIN/pages/ADMIN_stripe.js"></script>
</body>
</html>

<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Admin</title>
        <s-style pre src="A_stripe.css"></s-style>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
<!-- <script src="../../../../Splint/lib/require.js"></script> -->
    </head>
    <body id="Body_ADMIN_stripe">
    <!-- <script src="https://js.stripe.com/v3/"></script> -->
    
  <!-- <script src="../../js/ADMIN/testspace/stripe/stripeMain.js" defer></script> -->
  
        <s-part src="/js/ADMIN/assets/AdminNavigation.js"></s-part>

        <s-part first src="/js/GLOBAL/Paths.js"></s-part>
        <s-part src="/js/ADMIN/assets/"></s-part>
        <s-part src="/js/ADMIN/pages/ADMIN_stripe.js"></s-part>
        <s-part src="/js/Designs/CategoryHelper.js"></s-part>    

        <s-part first src="/js/ADMIN/assets/AdminTemplate.js"></s-part>
        <s-part src="/js/GLOBAL/Paths.js"></s-part>
        <s-part src="/js/3D/3DHelper.js"></s-part>
        <s-part src="/js/manager/"></s-part>
        <s-part src="/js/Orders/"></s-part>
        <s-module src="/js/3D/modules/module_3D_init.js"></s-module>

        <s-part src="/js/manager/manager.js"></s-part>
        <s-part src="/js/assets/product/productHelper.js"></s-part>
        <s-loader src="/js/ADMIN/Eventhandler.js"></s-loader>


        <script src="../../../../Splint/js/Splint.js" onload="SPLINT.start()"></script>
    </body>
</html>
<?php 
// $rootpath = realpath($_SERVER["DOCUMENT_ROOT"]);
// require_once $rootpath.'/fd/resources/php/Stripe/StripeMain.php';