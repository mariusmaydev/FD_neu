
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Funkendesign-Converter</title>
        <meta charset="ISO-8859-1" />
        <s-style style src="index.css"></s-style>
        <!-- Google tag (gtag.js) -->
    <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=G-LHPT2ZS9X2"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-LHPT2ZS9X2');
    </script>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TDN8PTS');</script>
    -->
    <!-- End Google Tag Manager -->
    </head>
    <body id="IndexBODY">
        <!-- Google Tag Manager (noscript) -->
        <!-- <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TDN8PTS"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript> -->
        <!-- End Google Tag Manager (noscript) -->
        <div class="NavigationBar" id="NavigationBar" ></div>

        <script src="../../../../Splint/lib/touchEmulator/touch-emulator.js"></script>
        <!-- <script> TouchEmulator();</script> -->
            <!-- <script defer src = "projects_test.js"></script> -->
                    <s-part first src="/js/GLOBAL/Paths.js"></s-part>
        <s-part src="/js/GLOBAL/global_Helper.js"></s-part>
        <s-part src="/js/assets/functionsShoppingCart.js"></s-part>

        <s-part src="/js/manager/"></s-part>
        <s-part src="/js/3D/Element3D.js"></s-part>
        <s-module src="/js/3D/modules/module_3D_init.js"></s-module>
        
        <s-part src="/js/GLOBAL/global_Helper_elements.js"></s-part>
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