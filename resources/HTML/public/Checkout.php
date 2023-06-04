<?php
        header("Access-Control-Allow-Origin: http://localhost:8012");
    require '../HTML_Core.php';
?>
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Checkout</title>
        <meta charset="ISO-8859-1"/>
        <s-style src="checkout.css"></s-style>
        <script src='https://www.paypal.com/sdk/js?client-id=AcY69ITexNWNGhhjCZTpjHIyM-KiqjWbTaACjMNj5SLRvXd8fMKysveevIZ4fffuBXEevk5Jf_LDw0nw&components=buttons,payment-fields,marks,funding-eligibility&enable-funding=giropay&currency=EUR'></script>
    <?php 

        // IMPLEMENT_PayPal();
    ?>

    </head>
    <body id="CheckoutBODY">
        <div div class="NavigationBar" id="NavigationBar"></div>
    <!-- <div id="s-particleDiv"></div> -->
        <!-- <div class="NavigationBar" id="NavigationBar" onload="NavigationBar()"></div> -->
        <!-- <div id="GooglePayContainer"></div> -->

        <s-part src="/js/Pages/pagesHelper.js"></s-part>
        <s-part src="/js/manager/manager.js"></s-part>
        <s-part src="/js/3D/Element3D.js"></s-part>
        <s-module src="/js/3D/modules/module_3D_init.js"></s-module>

        <s-part pre src="/js/GLOBAL/Paths.js"></s-part>
        <s-part pre src="/js/GLOBAL/global_Helper.js"></s-part>
        <s-part src="/js/GLOBAL/global_Helper_elements.js"></s-part>
        <s-part src="/js/GLOBAL/UserData.js"></s-part>

        <s-part src="/js/Login/LoginHelper.js"></s-part>
        <s-part src="/js/assets/functionsShoppingCart.js"></s-part>
        <s-part src="/js/3D/3DHelper.js"></s-part>
        <s-part src="/js/3D/commonJS/drawDOMElement_3D.js"></s-part>
        <s-part src="/js/Pages/pagesHelper.js"></s-part>
        <s-part src="/js/Pages/cart/"></s-part>
        <s-part src="/js/assets/functionsProduct.js"></s-part>
        <s-part src="/js/assets/functionsCouponCode.js"></s-part>
        <s-part src="/js/assets/product/productHelper.js"></s-part>
        <s-part src="/js/Projects/Projects.js"></s-part>
        <s-part src="/js/lexOffice/"></s-part>
        <s-part src="/js/Converter/ConverterHelper.js"></s-part>
        <s-part src="/js/Projects/ProjectsHelper.js"></s-part>
        <s-part src="/js/Orders/Order.js"></s-part>
        <s-part src="/js/Orders/Order.js"></s-part>
        <s-part src="/js/Orders/Order.js"></s-part>
        <s-part src="/js/Payment/Paypal.js"></s-part>
        <s-part src="/js/Checkout/"></s-part>
        <s-part src="/js/Checkout/"></s-part>

        <s-part src="/js/NavigationBar.js"></s-part>
        <s-loader src="/js/Eventhandler.js"></s-loader>
        <script async type="text/javascript" src="../../../../Splint/js/Splint.js" onload="SPLINT.start()"></script>
    </body>
</html>