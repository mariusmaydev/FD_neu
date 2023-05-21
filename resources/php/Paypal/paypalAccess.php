<?php

    require_once 'paypal.php';

    switch(Communication::getAccess()){
        case "CREATE_ORDER"      : paypal::createOrder(); break;
        case "CAPTURE_PAYMENT"   : paypal::capturePayment(); break;
        default: print_r("METHOD_ERROR"); exit;
    }