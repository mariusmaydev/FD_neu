
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Enflame</title>
        <meta charset="ISO-8859-1" />
        <s-style style src="index.css"></s-style>
        <meta name="viewport" content="width=device-width, height=device-height, initial-scale=10, minimum-scale=0.2, maximum-scale=0.4"/>

    </head>
    <body id="IndexBODY">

        <div class="NavigationBar" id="NavigationBar" ></div>

        <!-- <script src="../../../../Splint/js/Utils/TouchEmulator.js"></script> -->
            <!-- <script defer src = "projects_test.js"></script> -->
                    <s-part first src="/js/GLOBAL/Paths.js"></s-part>
        <s-part src="/js/assets/functionsShoppingCart.js"></s-part>

        <s-part src="/js/manager/"></s-part>
        <s-module src="/js/3D/modules/module_3D_init.js"></s-module>
        
        <s-part src="/js/assets/UserData.js"></s-part>

        <s-part src="/js/Login/LoginHelper.js"></s-part>
        <s-part src="/js/3D/3DHelper.js"></s-part>
        <s-part src="/js/3D/commonJS/drawDOMElement_3D.js"></s-part>
        <s-part first src="/js/Pages/pagesHelper.js"></s-part>
        <s-part src="/js/Pages/index/index.js"></s-part>
        <s-part src="/js/Pages/index/overlay.js"></s-part>
        <s-part src="/js/Projects/Projects.js"></s-part>
        <s-part src="/js/Projects/ProjectsHelper.js"></s-part>

        <s-part src="/js/NavigationBar.js"></s-part>
        <s-part src="/js/Footer.js"></s-part>
        <s-loader src="/js/Eventhandler.js"></s-loader>
        <script async src="../../../../Splint/js/Splint.js" onload="SPLINT.start()"></script>
    </body>
</html>