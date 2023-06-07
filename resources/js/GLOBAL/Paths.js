

const PATH = new Object();

//const domain    = "funken-design.com";
const domain    = location.host;//"192.168.178.44";
const folder    = "fd";
const php       = "php";
const SSL       = location.protocol;

var GLOBALS = new Object();
var globalUserID        = "";
var globalProjectID     = "";
var globalUserName      = "";
var globalProjectName   = "";
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

PATH.php.manager                        = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/collector/collectorAccess.php";
PATH.php.address                        = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/userdata/adress/addressAccess.php";

PATH.php.moonraker                      = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/moonraker/moonrakerAccess.php";

PATH.php.project                        = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/project/projectAccess.php";
PATH.php.text                           = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/converter/text/textAccess.php";

PATH.php.product                        = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/product/productAccess.php";

PATH.php.upload                         = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/upload/UploadAccess.php";

PATH.php.order                          = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/order/orderAccess.php";

PATH.php.login                          = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/userdata/login/loginAccess.php";

PATH.php.logout                         = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/login/logout.php";

PATH.php.designs = new Object();
PATH.php.designs.designs                = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/Designs/designsAccess.php";

PATH.php.designs.image                  = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/Designs/Images/imageDesignAccess.php";

PATH.php.hashtags                       = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/Designs/Hashtags/hashtagsAccess.php";

PATH.php.userData                       = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/userdata/userdataAccess.php";

PATH.php.converter                      = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/converter/converterAccess.php";
PATH.php.image                          = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/converter/image/imageAccess.php";

PATH.php.email                          = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/mail/EmailAccess.php";

PATH.php.codes = new Object();
PATH.php.codes.email                    = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/mail/EmailAccess.php";
PATH.php.codes.coupon                   = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/couponCode/couponCodeAccess.php";

PATH.php.inventory = new Object();
PATH.php.inventory.Item = new Object();
PATH.php.inventory.Item.add             = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/inventory/inventoryAddItem.php";
PATH.php.inventory.Item.remove          = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/inventory/inventoryRemoveItem.php";
PATH.php.inventory.Item.get             = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/inventory/inventoryGetItems.php";
PATH.php.inventory.Item.edit            = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/inventory/inventoryEditItem.php";

PATH.php.balance = new Object();
PATH.php.balance.add                    = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/balance/balanceADD.php";
PATH.php.balance.get                    = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/balance/balanceGET.php";

PATH.php.paypal                         = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/paypal/paypalAccess.php";
PATH.php.session                        = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/security/sessionAccess.php";

//LexOffice
PATH.php.lexOffice                      = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/lexOffice/lexOfficeAccess.php";

PATH.php.time                           = SSL + "//" + domain + "/" + folder + "/resources/" + php + "/Time.php";

//location
PATH.location = new Object();
PATH.location.index                     = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/index.php";
PATH.location.imprint                   = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/imprint.php";
PATH.location.sending                   = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/sending.php";
PATH.location.converter                 = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/Converter.php";
PATH.location.converterStart            = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/ConverterStart.php";
// PATH.location.account                   = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/ConverterStart.php";
// PATH.location.login                     = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/login/Login.php";
// PATH.location.auth                      = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/login/Auth.php";                   
PATH.location.payment                   = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/Payment.php";
PATH.location.cart                      = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/Cart.php";
// PATH.location.profile                   = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/Profile.php";
PATH.location.checkout                  = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/Checkout.php";
PATH.location.productInfo               = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/ProductInformation.php";
PATH.location.paymentComplete           = SSL + "//" + domain + "/" + folder + "/resources/HTML/public/paymentComplete.php";

PATH.location.ADMIN = new Object();
PATH.location.ADMIN.index               = SSL + "//" + domain + "/" + folder + "/resources/HTML/ADMIN/index.php";
PATH.location.ADMIN.inventory           = SSL + "//" + domain + "/" + folder + "/resources/HTML/ADMIN/inventory.php";
PATH.location.ADMIN.products            = SSL + "//" + domain + "/" + folder + "/resources/HTML/ADMIN/products.php";
PATH.location.ADMIN.statistics          = SSL + "//" + domain + "/" + folder + "/resources/HTML/ADMIN/statistics.php";
PATH.location.ADMIN.balance             = SSL + "//" + domain + "/" + folder + "/resources/HTML/ADMIN/balance.php";
PATH.location.ADMIN.designs             = SSL + "//" + domain + "/" + folder + "/resources/HTML/ADMIN/designs.php";
PATH.location.ADMIN.orders              = SSL + "//" + domain + "/" + folder + "/resources/HTML/ADMIN/order.php";
PATH.location.ADMIN.orderOverview       = SSL + "//" + domain + "/" + folder + "/resources/HTML/ADMIN/orderOverview.php";
PATH.location.ADMIN.couponCodes         = SSL + "//" + domain + "/" + folder + "/resources/HTML/ADMIN/couponCodes.php";
PATH.location.ADMIN.users               = SSL + "//" + domain + "/" + folder + "/resources/HTML/ADMIN/users.php";

PATH.location.admin = new Object();
PATH.location.admin.orderOverview       = SSL + "//" + domain + "/" + folder + "/resources/HTML/Admin/orders/ADMIN_orderOverview.php";
PATH.location.admin.orders              = SSL + "//" + domain + "/" + folder + "/resources/HTML/Admin/orders/ADMIN_orders.php";
PATH.location.admin.index               = SSL + "//" + domain + "/" + folder + "/resources/HTML/ADMIN/ADMIN_index.php";

//data/SVG
PATH.svg = new Object();
PATH.svg.paypal                         = SSL + "//" + domain + "/" + folder + "/resources/svg/PaypalLogo.svg";
PATH.svg.slider1                        = SSL + "//" + domain + "/" + folder + "/resources/svg/slider1.svg";
PATH.svg.window                         = SSL + "//" + domain + "/" + folder + "/resources/svg/window.svg";
PATH.svg.arrow_up_right_from_square     = SSL + "//" + domain + "/" + folder + "/resources/svg/arrow-up-right-from-square.svg";
PATH.svg.cursor = new Object();
PATH.svg.cursor.doubleArrow             = SSL + "//" + domain + "/" + folder + "/data/images/cursor/doubleArrow.svg";
PATH.svg.cursor.crossArrow              = SSL + "//" + domain + "/" + folder + "/data/images/cursor/crossArrow.svg";

PATH.svg.arrow = new Object();
PATH.svg.arrow.turn                     =  SSL + "//" + domain + "/" + folder + "/data/images/svg/turn.svg";


PATH.svg.uploadImage                    = SSL + "//" + domain + "/" + folder + "/resources/svg/ImageUpload.svg";
PATH.svg.uploadImage_hover              = SSL + "//" + domain + "/" + folder + "/resources/svg/ImageUpload_hover.svg";
PATH.svg.newText                        = SSL + "//" + domain + "/" + folder + "/resources/svg/newText.svg";
PATH.svg.newText_hover                  = SSL + "//" + domain + "/" + folder + "/resources/svg/newText_hover.svg";

//data/images
PATH.images = new Object();
PATH.images.product                     = SSL + "//" + domain + "/" + folder + "/data/images/products/";
PATH.images.navBarSparks                = SSL + "//" + domain + "/" + folder + "/data/images/sparks.png";
PATH.images.errorSRC                    = SSL + "//" + domain + "/" + folder + "/data/images/no_image.png";
PATH.images.logo                        = SSL + "//" + domain + "/" + folder + "/data/images/Logo.png";
PATH.images.cursor = new Object();
PATH.images.cursor.test                 = SSL + "//" + domain + "/" + folder + "/data/images/cursor/test.png";
PATH.images.thumbnailBase               = SSL + "//" + domain + "/" + folder + "/data/images/ThumbnailBase.png";

PATH.images.lighter = new Object();
PATH.images.lighter.black = new Object();
PATH.images.lighter.black.gold          = SSL + "//" + domain + "/" + folder + "/data/images/lighter/black_gold.png";
PATH.images.lighter.black.chrome        = SSL + "//" + domain + "/" + folder + "/data/images/lighter/black_chrome.png";

PATH.images.collector = new Object();
PATH.images.collector.output            = SSL + "//" + domain + "/" + folder + "/data/images/Collector/output.png?"  +  new Date().getTime();

function PATH_productImage(ProductID){
    return SSL + "//" + domain + "/" + folder + "/data/images/products/" + ProductID + ".png?"  +  new Date().getTime();
}
