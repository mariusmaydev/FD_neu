
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Enflame</title>
        <meta charset="ISO-8859-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, interactive-widget=resizes-content" />
        <!-- <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> -->
<!-- <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet"> -->
        <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" /> -->
        <s-style src="fontfaces.css"></s-style>
        <!-- <s-style src="imageMenu.css"></s-style> -->
        <s-style src="converter.css"></s-style>
        <!-- <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> -->

    </head>
    
    <body id="ConverterBODY">
               
        <!-- <div id="CustomCursorEle" style='position:absolute;z-index:3; pointer-events:none;user-select:none;'> -->
        <!-- <img id='CustomCursor' src='https://img.icons8.com/ios-glyphs/90/000000/resize-horizontal.png' width='25' height='25' style='position:absolute;z-index:3; pointer-events:none;user-select:none;visibility: hidden'/> -->
        <!-- </div> -->
        <div class="NavigationBar" id="NavigationBar"></div> 

        <!-- <script src="https://cdn.rawgit.com/hammerjs/touchemulator/0.0.2/touch-emulator.js",a.body.appendChild(b)}(document);"></script> 
        <script> TouchEmulator();</script> -->
        <s-part first src="/js/GLOBAL/Paths.js"></s-part>

        <s-part src="/js/manager/manager.js"></s-part>
        <s-part src="/js/Pages/pagesTemplate.js"></s-part>
        <s-part src="/js/Login/LoginHelper.js"></s-part>
        <s-part src="/js/assets/functionsShoppingCart.js"></s-part>
        <s-module src="/js/3D/modules/module_3D_init.js"></s-module>
        <s-part src="/js/3D/3DHelper.js"></s-part>
        <s-part src="/js/Projects/Projects.js"></s-part>
        <s-part src="/js/Helper/ProjectsHelper.js"></s-part>
        <s-part first src="/js/Converter/DataStorage/C_Image.js"></s-part>
        <s-part first src="/js/Converter/DataStorage/C_Text.js"></s-part>
        <s-part first src="/js/Converter/DataStorage/DSImage.js"></s-part>
        <s-part first src="/js/Converter/DataStorage/DSText.js"></s-part>
        <s-part first src="/js/Converter/DataStorage/DSProject.js"></s-part>
        <s-part src="/js/assets/functionsProduct.js"></s-part>
        <s-part src="/js/assets/product/productHelper.js"></s-part>
        <s-part src="/js/Projects/ProjectList/ProjectDetails.js"></s-part>
        <s-part src="/js/Projects/ProjectList/Details/ProjectDetailsHelper.js"></s-part>
        <s-part src="/js/Projects/ProjectList/Details/ProjectDetailsDesktop.js"></s-part>
        <s-part src="/js/Projects/ProjectList/Details/ProjectDetailsMobile.js"></s-part>
        <s-part src="/js/Converter/Converter.js"></s-part>
        <s-part src="/js/Designs/"></s-part>
        <s-part src="/js/Converter/Converter_LeftBar.js"></s-part>
        <s-part src="/js/Converter/"></s-part>

        <s-part src="/js/Converter/renderer/ConverterEvents.js"></s-part>
        <s-part src="/js/Converter/renderer/handler/ConverterMouseHandler.js"></s-part>
        <s-part src="/js/Converter/renderer/handler/ConverterTouchHandler.js"></s-part>

        <s-part src="/js/Converter/ConverterCloseButtons.js"></s-part>

        <s-part src="/js/Converter/toolBar/"></s-part>
        
        <s-part src="/js/Converter/drawElements/drawDesktop.js"></s-part>
        <s-part src="/js/Converter/drawElements/drawMobile.js"></s-part>
        <s-part src="/js/Designs/CategoryHelper.js"></s-part>

        
        <s-part first src="/js/Pages/NavigationBar/NavigationBarHelper.js"></s-part>
        <s-part src="/js/Pages/NavigationBar/NavigationBar.js"></s-part>
        <s-part src="/js/Footer.js"></s-part>
        <s-loader src="/js/Eventhandler.js"></s-loader>

        
        <script async type="text/javascript" src="../../../../Splint/js/Splint.js" onload="SPLINT.start()"></script>

    </body>  
</html>