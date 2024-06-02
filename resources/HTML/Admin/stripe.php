
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
    <div class="panel">
    <div class="overlay hidden"><div class="overlay-content"><img src="css/loading.gif" alt="Processing..."/></div></div>

    <div class="panel-heading">
        <h3 class="panel-title">Charge <?php echo '$'.$itemPrice; ?> with PayPal</h3>
        
        <!-- Product Info -->
        <p><b>Item Name:</b> <?php echo $itemName; ?></p>
        <p><b>Price:</b> <?php echo '$'.$itemPrice.' '.$currency; ?></p>
    </div>
    <div class="panel-body">
        <!-- Display status message -->
        <div id="paymentResponse" class="hidden"></div>
        
        <!-- Set up a container element for the button -->
        <div id="checkout-form">
            <div id="card-name-field-container"></div>
            <div id="card-number-field-container"></div>
            <div id="card-expiry-field-container"></div>
            <div id="card-cvv-field-container"></div>
            <button id="card-field-submit-button" type="button">
                Pay Now
            </button>
        </div>
    </div>
</div>
</body>
</html>
