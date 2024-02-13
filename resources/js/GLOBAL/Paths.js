
const PATH = new Object();
//const domain    = "funken-design.com";
const domain    = location.host;//"192.168.178.44";
const folder    = "fd";
const php       = "php";
const SSL       = location.protocol;

// var GLOBALS = new Object();
// var globalUserID        = "";
// var globalProjectID     = "";
// var globalUserName      = "";
// var globalProjectName   = "";
//vars
Electropainting = new Object();
Electropainting.color = new Object();
Electropainting.color.actual            = "";
Electropainting.color.gold              = "Gold";
Electropainting.color.chrome            = "Chrome";
Electropainting.color.rgb = new Object();
Electropainting.color.rgb.gold          = "rgb(255, 215, 0)";
Electropainting.color.rgb.chrome        = "rgb(239, 248, 255)";

//php
PATH.php = new Object();

PATH.php.manager                        = SPLINT.projectRootPath + php + "/collector/collectorAccess.php";
PATH.php.address                        = SPLINT.projectRootPath + php + "/userdata/adress/addressAccess.php";

PATH.php.moonraker                      = SPLINT.projectRootPath + php + "/moonraker/moonrakerAccess.php";

PATH.php.project                        = SPLINT.projectRootPath + php + "/project/projectAccess.php";
PATH.php.text                           = SPLINT.projectRootPath + php + "/converter/text/textAccess.php";

PATH.php.product                        = SPLINT.projectRootPath + php + "/product/productAccess.php";

PATH.php.upload                         = SPLINT.projectRootPath + php + "/upload/UploadAccess.php";

PATH.php.order                          = SPLINT.projectRootPath + php + "/order/orderAccess.php";

PATH.php.login                          = SPLINT.projectRootPath + php + "/userdata/login/loginAccess.php";

PATH.php.logout                         = SPLINT.projectRootPath + php + "/login/logout.php";

PATH.php.designs = new Object();
PATH.php.designs.designs                = SPLINT.projectRootPath + php + "/Designs/designsAccess.php";

PATH.php.designs.image                  = SPLINT.projectRootPath + php + "/Designs/Images/imageDesignAccess.php";

PATH.php.hashtags                       = SPLINT.projectRootPath + php + "/Designs/Hashtags/hashtagsAccess.php";

PATH.php.userData                       = SPLINT.projectRootPath + php + "/userdata/userdataAccess.php";
PATH.php.stripe                         = SPLINT.projectRootPath + php + "/Stripe/StripeMain.php";

PATH.php.converter                      = SPLINT.projectRootPath + php + "/converter/converterAccess.php";
PATH.php.image                          = SPLINT.projectRootPath + php + "/converter/image/imageAccess.php";

PATH.php.email                          = SPLINT.projectRootPath + php + "/mail/EmailAccess.php";

PATH.php.codes = new Object();
PATH.php.codes.email                    = SPLINT.projectRootPath + php + "/mail/EmailAccess.php";
PATH.php.codes.coupon                   = SPLINT.projectRootPath + php + "/couponCode/couponCodeAccess.php";

// PATH.php.inventory = new Object();
// PATH.php.inventory.Item = new Object();
// PATH.php.inventory.Item.add             = SPLINT.projectRootPath + php + "/inventory/inventoryAddItem.php";
// PATH.php.inventory.Item.remove          = SPLINT.projectRootPath + php + "/inventory/inventoryRemoveItem.php";
// PATH.php.inventory.Item.get             = SPLINT.projectRootPath + php + "/inventory/inventoryGetItems.php";
// PATH.php.inventory.Item.edit            = SPLINT.projectRootPath + php + "/inventory/inventoryEditItem.php";

// PATH.php.balance = new Object();
// PATH.php.balance.add                    = SPLINT.projectRootPath + php + "/balance/balanceADD.php";
// PATH.php.balance.get                    = SPLINT.projectRootPath + php + "/balance/balanceGET.php";

PATH.php.paypal                         = SPLINT.projectRootPath + php + "/paypal/paypalAccess.php";
PATH.php.session                        = SPLINT.projectRootPath + php + "/security/sessionAccess.php";

//LexOffice
PATH.php.lexOffice                      = SPLINT.projectRootPath + php + "/lexOffice/lexOfficeAccess.php";

// PATH.php.time                           = SPLINT.projectRootPath + php + "/Time.php";

//location
PATH.location = new Object();
PATH.location.index                     = SPLINT.projectRootPath + "HTML/public/index.php";
PATH.location.imprint                   = SPLINT.projectRootPath + "HTML/public/imprint.php";
PATH.location.sending                   = SPLINT.projectRootPath + "HTML/public/sending.php";
PATH.location.converter                 = SPLINT.projectRootPath + "HTML/public/Converter.php";
PATH.location.converterStart            = SPLINT.projectRootPath + "HTML/public/ConverterStart.php";               
PATH.location.payment                   = SPLINT.projectRootPath + "HTML/public/Payment.php";
PATH.location.cart                      = SPLINT.projectRootPath + "HTML/public/Cart.php";
PATH.location.checkout                  = SPLINT.projectRootPath + "HTML/public/Checkout.php";
PATH.location.productInfo               = SPLINT.projectRootPath + "HTML/public/ProductInformation.php";
PATH.location.paymentComplete           = SPLINT.projectRootPath + "HTML/public/paymentComplete.php";

PATH.location.ADMIN = new Object();
PATH.location.ADMIN.index               = SPLINT.projectRootPath + "HTML/ADMIN/index.php";
PATH.location.ADMIN.inventory           = SPLINT.projectRootPath + "HTML/ADMIN/inventory.php";
PATH.location.ADMIN.products            = SPLINT.projectRootPath + "HTML/ADMIN/products.php";
PATH.location.ADMIN.statistics          = SPLINT.projectRootPath + "HTML/ADMIN/statistics.php";
PATH.location.ADMIN.balance             = SPLINT.projectRootPath + "HTML/ADMIN/balance.php";
PATH.location.ADMIN.designs             = SPLINT.projectRootPath + "HTML/ADMIN/designs.php";
PATH.location.ADMIN.orders              = SPLINT.projectRootPath + "HTML/ADMIN/order.php";
PATH.location.ADMIN.orderOverview       = SPLINT.projectRootPath + "HTML/ADMIN/orderOverview.php";
PATH.location.ADMIN.couponCodes         = SPLINT.projectRootPath + "HTML/ADMIN/couponCodes.php";
PATH.location.ADMIN.users               = SPLINT.projectRootPath + "HTML/ADMIN/users.php";
PATH.location.ADMIN.stripe              = SPLINT.projectRootPath + "HTML/ADMIN/stripe.php";

PATH.location.admin = new Object();
PATH.location.admin.orderOverview       = SPLINT.projectRootPath + "HTML/Admin/orders/ADMIN_orderOverview.php";
PATH.location.admin.orders              = SPLINT.projectRootPath + "HTML/Admin/orders/ADMIN_orders.php";
PATH.location.admin.index               = SPLINT.projectRootPath + "HTML/ADMIN/ADMIN_index.php";

//data/SVG
PATH.svg = new Object();
PATH.svg.paypal                         = SPLINT.projectRootPath + "svg/PaypalLogo.svg";
PATH.svg.slider1                        = SPLINT.projectRootPath + "svg/slider1.svg";
PATH.svg.window                         = SPLINT.projectRootPath + "svg/window.svg";
PATH.svg.arrow_up_right_from_square     = SPLINT.projectRootPath + "svg/arrow-up-right-from-square.svg";
PATH.svg.cursor = new Object();
PATH.svg.cursor.doubleArrow             = SSL + "//" + domain + "/" + folder + "/data/images/cursor/doubleArrow.svg";
PATH.svg.cursor.crossArrow              = SSL + "//" + domain + "/" + folder + "/data/images/cursor/crossArrow.svg";

PATH.svg.arrow = new Object();
PATH.svg.arrow.turn                     =  SSL + "//" + domain + "/" + folder + "/data/images/svg/turn.svg";


PATH.svg.uploadImage                    = SPLINT.projectRootPath + "svg/ImageUpload.svg";
PATH.svg.uploadImage_hover              = SPLINT.projectRootPath + "svg/ImageUpload_hover.svg";
PATH.svg.newText                        = SPLINT.projectRootPath + "svg/newText.svg";
PATH.svg.newText_hover                  = SPLINT.projectRootPath + "svg/newText_hover.svg";

//data/images
PATH.images = new Object();
PATH.images.product                     = SSL + "//" + domain + "/" + folder + "/data/images/products/";
PATH.images.navBarSparks                = SSL + "//" + domain + "/" + folder + "/data/images/sparks.png";
PATH.images.errorSRC                    = SSL + "//" + domain + "/" + folder + "/data/images/no_image.png";
PATH.images.logo                        = SSL + "//" + domain + "/" + folder + "/data/images/Logo.png";
PATH.images.PaypalLogo                  = SSL + "//" + domain + "/" + folder + "/data/images/PaypalLogo.jpg";
PATH.images.cursor = new Object();
PATH.images.cursor.test                 = SSL + "//" + domain + "/" + folder + "/data/images/cursor/test.png";
PATH.images.thumbnailBase               = SSL + "//" + domain + "/" + folder + "/data/images/ThumbnailBase.png";

PATH.images.lighter = new Object();
PATH.images.lighter.black = new Object();
PATH.images.lighter.black.gold          = SSL + "//" + domain + "/" + folder + "/data/images/lighter/black_gold.png";
PATH.images.lighter.black.chrome        = SSL + "//" + domain + "/" + folder + "/data/images/lighter/black_chrome.png";

PATH.images.collector = new Object();
PATH.images.collector.output            = SSL + "//" + domain + "/" + folder + "/data/images/Collector/output.png?"  +  new Date().getTime();

// function PATH_productImage(ProductID){
//     return SSL + "//" + domain + "/" + folder + "/data/images/products/" + ProductID + ".png?"  +  new Date().getTime();
// }
