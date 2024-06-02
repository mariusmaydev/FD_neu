
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Enflame</title>
        <meta charset="ISO-8859-1" />
        <s-style style src="dataProtection.css"></s-style>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

    </head> 
    <body id="DataProtectionBODY">

        <div class="NavigationBar" id="NavigationBar" ></div>
        

        <s-part src="/js/manager/manager.js"></s-part>
        <s-module src="/js/3D/modules/module_3D_init.js"></s-module>
        
        <s-part pre src="/js/GLOBAL/Paths.js"></s-part>
        <s-part src="/js/assets/UserData.js"></s-part>

        <s-part src="/js/Login/LoginHelper.js"></s-part>
        <s-part src="/js/assets/functionsShoppingCart.js"></s-part>
        <s-part src="/js/3D/3DHelper.js"></s-part>
        <s-part first src="/js/Pages/pagesTemplate.js"></s-part>
        <s-part src="/js/Pages/DataProtection.js"></s-part>
        <s-part src="/js/Projects/Projects.js"></s-part>
        <s-part src="/js/Helper/ProjectsHelper.js"></s-part>

        <s-part first src="/js/Pages/NavigationBar/NavigationBarHelper.js"></s-part>
        <s-part src="/js/Pages/NavigationBar/NavigationBar.js"></s-part>
        <s-part src="/js/Footer.js"></s-part>

        <s-loader src="/js/Eventhandler.js"></s-loader>

    </body>
        <script type="text/javascript" src="../../../../Splint/js/Splint.js" onload="SPLINT.start()"></script>
</html>