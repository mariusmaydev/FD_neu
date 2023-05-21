<?php
  require '../HTML_Core.php';
?>
<!DOCTYPE html>
<html lang="de">
  <head>
    <title>Funkendesign-Converter</title>
    <meta charset="ISO-8859-1"/>
    <?php 
      Styles::bindStyles(function(){
        // FileBinder::bind('css', 'designs', 'designs.css');
        // FileBinder::bind('css', 'profile', 'address.css');
        FileBinder::bind('css', 'Output', 'profile.css');
      });
    ?>
  </head>
    
  <body id="ProfileBODY">
    <div class="NavigationBar" id="NavigationBar" onload="NavigationBar()"></div>

  </body>
  
  <?php 
    Scripts::bindModules(function() {
      FileBinder::bindModule('js', '3D', 'module_3DHelper.js');
      FileBinder::bindModule('js', '3D', 'module_3D.js');
      FileBinder::bind('js', '3D', '3DHelper.js');
      FileBinder::bind('js', 'Designs', 'DesignMenu.js');
      FileBinder::bindFolder('js', 'Designs', 'ImageMenu');
      FileBinder::bindFolder('js', 'Designs', 'Hashtags');
      FileBinder::bind('js', 'assets', 'ShoppingCartFunctions.js');
      FileBinder::bind('js', 'Profile', 'AddressHelper.js');
      FileBinder::bind('js', 'Profile', 'Address.js');
      FileBinder::bind('js', 'Orders', 'Order.js');
      FileBinder::bindFolder('js', 'Projects');
      FileBinder::bind('js', 'Pages', 'pagesHelper.js');
      FileBinder::bind('js', 'Pages', 'profile', 'profile.js');
    });
  ?>

</html>