
class Startup {
    static INDEX            = "Body_ADMIN_index";
    static DESIGN           = "Body_ADMIN_designs";
    static PRODUCTS         = "Body_ADMIN_products";
    static ORDERS           = "Body_ADMIN_orders";
    static TESTSPACE        = "Body_ADMIN_testSpace";
    static COUPONCODES      = "Body_ADMIN_couponCodes";
    static STATISTICS       = "Body_ADMIN_statistics";
    static ENGRAVING        = "Body_ADMIN_engraving";
    static LOGIN            = "Body_ADMIN_login";
    static USER_ACCOUNTS    = "Body_ADMIN_userAccounts";
    static STRIPE           = "Body_ADMIN_stripe";
    static STRIPE_SUCCESS   = "Body_ADMIN_stripeSuccess";
    static {
        
    }
    static check(){
        let body = document.getElementsByTagName("body")[0];   
            switch(body.id){
                case Startup.INDEX          : new ADMIN_index(); break;
                case Startup.DESIGN         : new ADMIN_designs(); break;
                case Startup.COUPONCODES    : new ADMIN_couponCodes(); break;
                case Startup.TESTSPACE      : new ADMIN_testSpace(); break;
                case Startup.STATISTICS     : new ADMIN_statistics(); break;
                case Startup.LOGIN          : new ADMIN_login(); break;
                case Startup.PRODUCTS       : new ADMIN_products(); break;
                // case Startup.COUPONCODES    : new ADMIN_couponCodes(); break;
                // case Startup.STATISTICS     : load_Images(); break;
                case Startup.USER_ACCOUNTS  : new ADMIN_userAccounts(); break;
                case Startup.ORDERS         : new ADMIN_orders(); break;
                case Startup.TESTSPACE      : new ADMIN_testSpace(); break;
                case Startup.ENGRAVING      : new ADMIN_engraving(); break;
                case Startup.STRIPE         : new ADMIN_Stripe(); break;
                case Startup.STRIPE_SUCCESS : new ADMIN_StripeSuccess(); break;
                // case Startup.DATABASE       : new ADMIN_dataBase(); break;
                // case Startup.MANAGEMENT     : new ADMIN_management(); break;
            }
    }
}
document.body.onload = Startup.check();

function load_Index(){
    new ADMIN_index();
}

function load_Designs(){
    Admin_DrawDesignMenu();
}

function load_Images(){

}