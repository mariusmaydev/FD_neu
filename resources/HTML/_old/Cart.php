
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Enflame</title>
        <meta charset="ISO-8859-1"/>
        <s-style style src="cart.css"></s-style>

        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    </head>
    <body id="CartBODY">
        <div class="NavigationBar" id="NavigationBar"></div>

        
        <s-part first src="/js/GLOBAL/Paths.js"></s-part>
        <s-part first src="/js/assets/functionsShoppingCart.js"></s-part>

        <s-part src="/js/manager/manager.js"></s-part>
        <s-module src="/js/3D/modules/module_3D_init.js"></s-module>

        <s-part first src="/js/Pages/pagesTemplate.js"></s-part>
        <s-part src="/js/assets/UserData.js"></s-part>

        <s-part src="/js/Login/LoginHelper.js"></s-part>

        <s-part src="/js/3D/3DHelper.js"></s-part>
        <s-part src="/js/Pages/cart/cart.js"></s-part>
        <s-part src="/js/Pages/cart/cartList.js"></s-part>
        <s-part src="/js/Pages/cart/cartRight.js"></s-part>
        <s-part src="/js/assets/product/"></s-part>
        <s-part src="/js/assets/functionsCouponCode.js"></s-part>
        <s-part src="/js/Projects/Projects.js"></s-part>
        <s-part src="/js/Helper/ProjectsHelper.js"></s-part>
        <s-part src="/js/Projects/ProjectList/Details/ProjectDetailsHelper.js"></s-part>
        <s-part src="/js/Projects/ProjectList/Details/ProjectDetailsDesktop.js"></s-part>
        <s-part src="/js/Projects/ProjectList/Details/ProjectDetailsMobile.js"></s-part>
        <s-part src="/js/Projects/ProjectList/ProjectDetails.js"></s-part>

        <s-part first src="/js/Pages/NavigationBar/NavigationBarHelper.js"></s-part>
        <s-part src="/js/Pages/NavigationBar/NavigationBar.js"></s-part>
        <s-part src="/js/Footer.js"></s-part>
        <s-loader src="/js/Eventhandler.js"></s-loader>

        <script type="text/javascript" src="../../../../Splint/js/Splint.js" onload="SPLINT.start()"></script>
    </body>
</html>