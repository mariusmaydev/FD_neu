<?php

require_once 'config.php';
?>

<!DOCTYPE html>
<html lang="en-US">
    <head>
        <title>PaypalTest</title>
        <meta charset="utf-8">

        <link
            rel="stylesheet"
            type="text/css"
            href="https://www.paypalobjects.com/webstatic/en_US/developer/docs/css/cardfields.css"
        />
        <script src="https://www.paypal.com/sdk/js?components=card-fields&client-id=<?php echo PAYPAL_SANDBOX?PAYPAL_SANDBOX_CLIENT_ID:PAYPAL_PROD_CLIENT_ID; ?>">
    
        </script>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <h1>Paypal Advanced Checkout</h1>
        <div class="panel">
    <div class="overlay hidden"><div class="overlay-content"><img src="loading.gif" alt="Processing..."/></div></div>


            <div class="panel-heading">
                <h3 class="panel-title">Charge <?php echo '$'.$itemPrice; ?> with Paypal </h3>
                
                <p><b>Item Name:</b> <?php echo $itemName; ?></p>
                <p><b>Price:</b> <?php echo '$'.$itemPrice.' '.$currency; ?></p>
            </div>
            <div class="panel-body">
                <div id="paymentResponse" class="hidden"></div>

                <div id="checkout-form">
                    <div id="card-name-field-container">
                        <div class="test"></div>
                    </div>
                    <div id="card-number-field-container"></div>
                    <div id="card-expiry-field-container"></div>
                    <div id="card-cvv-field-container"></div>
                    <button id="card-field-submit-button" type="button">
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
        <script>
// Create the Card Fields Component and define callbacks
const cardStyle = {
    'input': {
        'font-size': '16px',
        'font-family': 'courier, monospace',
        'font-weight': 'lighter',
        'apperance': 'none',
        'opacity': '0'
    },
    '.invalid': {
        'border-color': 'purple',
    },
};
const cardField = paypal.CardFields({
    // style: cardStyle,
    createOrder: function (data) {
        setProcessing(true);
        var postData = {request_type: 'create_order', payment_source: data.paymentSource, a: "ok"};
        return fetch("paypal_checkout_init.php", {
            method: "POST",
            headers: {'Accept': 'application/json'},
            body: encodeFormData(postData)
        })
        .then((res) => {
            return res.json();
        })
        .then((result) => {
            setProcessing(false);
            if(result.status == 1){
                return result.data.id;
            }else{
                resultMessage(result.msg);
                return false;
            }
        });
    },
    onApprove: function (data) {
        setProcessing(true);

        const { orderID } = data;
        var postData = {request_type: 'capture_order', order_id: orderID};
        return fetch('paypal_checkout_init.php', {
            method: "POST",
            headers: {'Accept': 'application/json'},
            body: encodeFormData(postData)
        })
        .then((res) => {
            return res.json();
        })
        .then((result) => {
            // Redirect to success page
            if(result.status == 1){
                window.location.href = "payment-status.php?checkout_ref_id="+result.ref_id;
            }else{
                resultMessage(result.msg);
            }
            setProcessing(false);
        });
    },
    onError: function (error) {
        // Do something with the error from the SDK
    },
});

// Render each field after checking for eligibility
if (cardField.isEligible()) {
    const nameField = cardField.NameField();
    nameField.render("#card-name-field-container");

    const numberField = cardField.NumberField();
    numberField.render("#card-number-field-container");
    numberField.removeAttribute("placeholder");

    const cvvField = cardField.CVVField();
    cvvField.render("#card-cvv-field-container");

    const expiryField = cardField.ExpiryField();
    expiryField.render("#card-expiry-field-container");

    // Add click listener to submit button and call the submit function on the CardField component
    document
    .getElementById("card-field-submit-button")
    .addEventListener("click", () => {
        cardField.submit().then(() => {
            // submit successful
        })
        .catch((error) => {
            resultMessage(`Sorry, your transaction could not be processed... >>> ${error}`);
        });
    });
} else {
    // Hides card fields if the merchant isn't eligible
    document.querySelector("#checkout-form").style = "display: none";
}

const encodeFormData = (data) => {
    var form_data = new FormData();

    for ( var key in data ) {
        form_data.append(key, data[key]);
    }
    return form_data;   
}

// Show a loader on payment form processing
const setProcessing = (isProcessing) => {
    if (isProcessing) {
        document.querySelector(".overlay").classList.remove("hidden");
    } else {
        document.querySelector(".overlay").classList.add("hidden");
    }
}

// Display status message
const resultMessage = (msg_txt) => {
    const messageContainer = document.querySelector("#paymentResponse");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = result.msg;
    
    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageText.textContent = "";
    }, 5000);
}
</script>
    </body>

</html>