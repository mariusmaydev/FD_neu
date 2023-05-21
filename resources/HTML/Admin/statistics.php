<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Admin</title>
        <s-style pre src="A_statistics.css"></s-style>

<!-- <script src="../../../../Splint/lib/require.js"></script> -->
<!-- <script defer src="https://requirejs.org/docs/release/2.3.5/minified/require.js"></script> -->
    </head>
    <body id="Body_ADMIN_statistics">
        <s-part src="/js/ADMIN/assets/AdminNavigation.js"></s-part>

        <s-part pre src="/js/GLOBAL/Paths.js"></s-part>
        <s-part src="/js/ADMIN/assets/AdminTemplate.js"></s-part>
        <s-part src="/js/ADMIN/assets/AdminPaths.js"></s-part>
        <s-part src="/js/ADMIN/assets/AdminNavigation.js"></s-part>
        <s-part src="/js/ADMIN/assets/AdminChartTemplate.js"></s-part>
        <s-part src="/js/ADMIN/pages/ADMIN_statistics.js"></s-part>
        <s-part src="/js/Designs/CategoryHelper.js"></s-part>    

        <s-part src="/js/GLOBAL/Paths.js"></s-part>
        <s-part src="/js/3D/3DHelper.js"></s-part>
        <s-module src="/js/3D/modules/module_3D_init.js"></s-module>

        <s-part src="/js/manager/manager.js"></s-part>
        <s-part src="/js/assets/product/productHelper.js"></s-part>
        <s-loader src="/js/ADMIN/Eventhandler.js"></s-loader>


        <script src="../../../../Splint/js/Splint.js" onload="SPLINT.start()"></script>
    </body>
  <!-- <script src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"></script> -->
</html>