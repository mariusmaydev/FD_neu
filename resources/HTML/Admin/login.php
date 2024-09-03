
<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Admin</title>
        <meta charset="ISO-8859-1" />
        <s-style src="A_login.css"></s-style>
        <meta name="robots" content="noindex"/>
        <meta name="robots" content="nofollow"/>
    </head>
    <body id="Body_ADMIN_login">

        <s-loader src="/js/ADMIN/Eventhandler.js"></s-loader>

        <s-part first src="/js/GLOBAL/Paths.js"></s-part>
        <s-part src="/js/GLOBAL/"></s-part>
        <s-part src="/js/3D/3DHelper.js"></s-part>
        <s-module src="/js/3D/modules/module_3D_init.js"></s-module>

        <s-part first src="/js/ADMIN/assets/AdminTemplate.js"></s-part>
        <s-part src="/js/ADMIN/assets/"></s-part>
        <!-- <s-part src="/js/manager/manager.js"></s-part> -->
        <s-part src="/js/ADMIN/pages/ADMIN_login.js"></s-part>

        <script type="text/javascript" src="../../../../Splint/js/Splint.js" onload="SPLINT.start()"></script>
    </body>
</html>