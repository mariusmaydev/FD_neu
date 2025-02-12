
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Enflame</title>
        <meta charset="ISO-8859-1" />
        <s-style style src="imprint.css"></s-style>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

    </head> 
    <body id="ImprintBODY">
        <!-- <div id="CustomCursorEle" style='position:absolute;z-index:3; pointer-events:none;user-select:none;'></div> -->
        <img id='CustomCursor' src='https://img.icons8.com/ios-glyphs/90/000000/resize-horizontal.png' width='25' height='25' style='position:absolute;z-index:3; pointer-events:none;user-select:none;visibility: hidden'/>
        
        <div class="NavigationBar" id="NavigationBar" ></div>
        

        <!-- <s-part src="/js/manager/manager.js"></s-part> -->
        <s-module src="/js/3D/modules/module_3D_init.js"></s-module>
        
        <s-part pre src="/js/GLOBAL/Paths.js"></s-part>
        <s-part src="/js/assets/UserData.js"></s-part>

        <s-part src="/js/Login/LoginHelper.js"></s-part>
        <s-part src="/js/assets/functionsShoppingCart.js"></s-part>
        <s-part src="/js/3D/3DHelper.js"></s-part>
        <s-part first src="/js/Pages/pagesTemplate.js"></s-part>
        <s-part src="/js/Pages/imprint.js"></s-part>
        <s-part src="/js/Projects/Projects.js"></s-part>
        <s-part src="/js/Helper/ProjectsHelper.js"></s-part>

        <s-part first src="/js/Pages/NavigationBar/NavigationBarHelper.js"></s-part>
        <s-part src="/js/Pages/NavigationBar/NavigationBar.js"></s-part>
        <s-part src="/js/Footer.js"></s-part>

        <s-loader src="/js/Eventhandler.js"></s-loader>

    </body>
        <script type="text/javascript" src="../../../../Splint/js/Splint.js" onload="SPLINT.start()"></script>
</html>