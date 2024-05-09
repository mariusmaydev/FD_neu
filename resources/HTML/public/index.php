
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Enflame</title>
        <meta charset="ISO-8859-1" />
        <s-style style src="index.css"></s-style>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <!-- <meta name="HandheldFriendly" content="true" /> -->
        <!-- <meta name="viewport" content="width=device-width, height=device-height, initial-scale=10, minimum-scale=0.2, maximum-scale=0.4"/> -->
<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-LHPT2ZS9X2"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){
            dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-LHPT2ZS9X2');
            console.dir(window)
    </script>

    </head>
    <body id="IndexBODY">
        <div class="NavigationBar" id="NavigationBar" ></div>
        <!-- <script src="//cdnjs.cloudflare.com/ajax/libs/velocity/2.0.6/velocity.min.js"></script> -->
        <!-- <script src="../../../../Splint/js/Utils/TouchEmulator.js"></script> -->
            <!-- <script defer src = "projects_test.js"></script> -->

        <s-part first src="/js/GLOBAL/Paths.js"></s-part>
        <s-part src="/js/assets/functionsShoppingCart.js"></s-part>

        <s-module src="/js/3D/modules/module_3D_init.js"></s-module>
        
        <s-part src="/js/assets/UserData.js"></s-part>

        <s-part src="/js/Login/LoginHelper.js"></s-part>
        <s-part src="/js/3D/3DHelper.js"></s-part>
        <s-part first src="/js/Pages/pagesTemplate.js"></s-part>
        <s-part src="/js/Pages/index/index.js"></s-part>
        <s-part src="/js/Pages/index/overlay.js"></s-part>
        <s-part src="/js/Projects/Projects.js"></s-part>
        <s-part src="/js/Helper/ProjectsHelper.js"></s-part>

        <s-part first src="/js/Pages/NavigationBar/NavigationBarHelper.js"></s-part>
        <s-part src="/js/Pages/NavigationBar/NavigationBar.js"></s-part>
        <s-part src="/js/Footer.js"></s-part>
        <s-part src="/js/manager/manager.js"></s-part>
        <s-loader src="/js/Eventhandler.js"></s-loader>
        <script async src="../../../../Splint/js/Splint.js" onload="SPLINT.start()"></script>
    </body>
</html>