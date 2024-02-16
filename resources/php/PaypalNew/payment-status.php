<?php

    require_once 'config.php';

    require_once 'dbConnect.php';

    $payment_ref_id = $statusMsg = '';
    $status = 'error';

    if(!empty($_GET['checkout_ref_id'])){
        $payment_txn_id = base64_decode($_GET['checkout_ref_id']);
        
        $sqlQ = "SELECT id,order_id,transaction_id,paid_amount,paid_amount_currency,payment_source,payment_source_card_name,payment_source_card_last_digits,payment_source_card_expiry,payment_source_card_brand,payment_source_card_type,payment_status,created FROM transactions WHERE transaction_id = ?"; 
    
        $stmt = $db->prepare($sqlQ);  
        $stmt->bind_param("s", $payment_txn_id); 
        $stmt->execute(); 
        $stmt->store_result(); 
     
        if($stmt->num_rows > 0){ 
            // Get transaction details 
            $stmt->bind_result($payment_ref_id, $order_id, $transaction_id, $paid_amount, $paid_amount_currency, $payment_source, $payment_source_card_name, $payment_source_card_last_digits, $payment_source_card_expiry, $payment_source_card_brand, $payment_source_card_type, $payment_status, $created); 
            $stmt->fetch(); 
             
            $status = 'success'; 
            $statusMsg = 'Your Payment has been Successful!'; 
        } else { 
            $statusMsg = "Transaction has been failed!"; 
        } 
    } else { 
        header("Location: index.php"); 
        exit; 
    } 

?>
<!DOCTYPE html>
<html lang="en-US">
    <head>
        <title>complete</title>
        <meta charset="utf-8">

        <link href="style.css" rel="stylesheet">
    </head>
    <body>
        <div class="container">
            <div class="status">
                <?php if(!empty($payment_ref_id)){ ?>
                    <h1 class="<?php echo $status; ?>"><?php echo $statusMsg; ?></h1>
                    
                    <h4>Payment Information</h4>
                    <p><b>Reference Number:</b> <?php echo $payment_ref_id; ?></p>
                    <p><b>Order ID:</b> <?php echo $order_id; ?></p>
                    <p><b>Transaction ID:</b> <?php echo $transaction_id; ?></p>
                    <p><b>Paid Amount:</b> <?php echo $paid_amount.' '.$paid_amount_currency; ?></p>
                    <p><b>Payment Status:</b> <?php echo $payment_status; ?></p>
                    <p><b>Date:</b> <?php echo $created; ?></p>

                    <h4>Payment Source</h4>
                    <p><b>Method:</b> <?php echo strtoupper($payment_source); ?></p>
                    <p><b>Card Type:</b> <?php echo $payment_source_card_type; ?></p>
                    <p><b>Card Brand:</b> <?php echo $payment_source_card_brand; ?></p>
                    <p><b>Card Number:</b> <?php echo 'XXXX XXXX XXXX '.$payment_source_card_last_digits; ?></p>
                    <p><b>Card Expiry:</b> <?php echo $payment_source_card_expiry; ?></p>
                    <p><b>Card Holder Name:</b> <?php echo $payment_source_card_name; ?></p>
                    
                <?php }else{ ?>
                    <h1 class="error">Your Payment has been failed!</h1>
                    <p class="error"><?php echo $statusMsg; ?></p>
                <?php } ?>
            </div>
            <a href="index.php" class="btn-link">Back</a>
        </div>
    </body>
</html>