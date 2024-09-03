SPLINT.require_now("@PROJECT_ROOT/_Loader/LoaderHelper.js")
SPLINT.require_now("@PROJECT_ROOT/_Loader/LoaderPages.js")

class LoaderMain {
    static LASTPAGE = null;
    static STACK = [];
    static BaseLoaded = false;
    static getActualPage(){
        let p = SPLINT.Tools.Location.getParams();
        return p.PAGE;
    }
    static goto(pageName, ...hashes){
        SPLINT.Tools.Location.setHashes(...hashes);
        SPLINT.Tools.Location.addParams({"PAGE": pageName }).call(false)
        this.checkPage();
    }
    static set onPageChange(func){
        this.STACK.push(func);
    }
    static async start(){
        addEventListener("popstate", function(){
            LoaderMain.checkPage();
        });
        this.checkPage()
        SPLINT.SessionsPHP.showAll();
    }
    static async checkPage(){
        let p = SPLINT.Tools.Location.getParams();
        if(p.PAGE == undefined){
            SPLINT.Tools.Location.setParams({ "PAGE":"index"}).call(false);
            SPLINT.Tools.Location.setParams({ "PAGE":"index"}).call(false);
            this.LASTPAGE = "index";
        } else {
            if(p.PAGE != this.LASTPAGE){
                SPLINT.Events.onPopStateChange.dispatch();
                this.LASTPAGE = p.PAGE;
                let ele = document.getElementsByClassName("Pages_MAIN");
                if(ele.length > 0){
                    ele[0].remove();
                }
                let ele1 = document.getElementsByClassName("Conv_MAIN");
                if(ele1.length > 0){
                    SPLINT.Tools.CursorHandler.remove();
                    ele1[0].remove();
                }
                let ele2 = document.getElementById("FooterBody");
                if(ele2 != null){
                    ele2.remove();
                }
                let ele3 = document.getElementById("checkout_main");
                if(ele3 != null){
                    ele3.remove();
                }
                let ele4 = document.getElementsByClassName("subWindow_MAIN");
                if(ele4.length > 0){
                    SPLINT.Tools.CursorHandler.remove();
                    ele4[0].remove();
                }
            } else {
                return;
            }
        }
        switch(this.LASTPAGE){
            case "index" : this.loadIndex(); break;
            case "converterStart" : this.loadConverterStart(); break;
            case "converter" : this.loadConverter(); break;
            case "cart" : this.loadCart(); break;
            case "AGB" : this.loadAGB(); break;
            case "dataProtection" : this.loadDataProtection(); break;
            case "imprint" : this.loadImprint(); break;
            case "checkout" : this.loadCheckout(); break;
            case "paymentComplete" : this.loadPaymentComplete(); break;
            default : this.loadIndex();
        }
        
        // SPLINT_EventExtensions.removeAllListenersFromOtherPage();
    }
    static async loadBase(){
        if(this.BaseLoaded){
            return;
        }
        return Promise.allSettled([
            LoaderHelper.preloadScript(),
            LoaderHelper.initModules()
        ]).then(function(){
            LoaderHelper.BaseLoaded = true;
            return true;
        })
    }
    static initCSS(...fileNames){
        let list = document.styleSheets;
        let listResP = [];
        let listResM = [];
        for(const e of fileNames){
            for (let i = 0; i < list.length; i++) {
                let item = list.item(i);
                if(fileNames.includes(item.ownerNode.name)){
                    listResP.push(i);
                } else if(item.ownerNode.name != undefined){
                    listResM.push(i);
                }
            }
        }
        for(const e of listResP) {
            list.item(e).disabled = false;
        }
        for(const e of listResM) {
            list.item(e).disabled = true;
        }
        return;
    }
    static async loadPaymentComplete(){
        await LoaderHelper.loadCSS("paymentComplete");
        this.initCSS("paymentComplete");
        await this.loadBase();
        await LoaderHelper.preloadPage(LoaderPages.paymentComplete);
        new drawPaymentComplete();
    }
    static async loadCheckout(){
        await LoaderHelper.loadCSS("checkout");
        this.initCSS("checkout");
        await this.loadBase();
        await LoaderHelper.preloadPage(LoaderPages.checkout);
        new Checkout();
    }
    static async loadImprint(){
        await LoaderHelper.loadCSS("imprint");
        this.initCSS("imprint");
        await this.loadBase();
        await LoaderHelper.preloadPage(LoaderPages.imprint);
        new drawImprint();
    }
    static async loadDataProtection(){
        await LoaderHelper.loadCSS("dataProtection");
        this.initCSS("dataProtection");
        await this.loadBase();
        await LoaderHelper.preloadPage(LoaderPages.dataProtection);
        new drawDataProtection();
    }
    static async loadAGB(){
        await LoaderHelper.loadCSS("AGBs");
        this.initCSS("AGBs");
        await this.loadBase();
        await LoaderHelper.preloadPage(LoaderPages.AGB);
        new drawAGBs();
    }
    static async loadCart(){
        await LoaderHelper.loadCSS("cart");
        this.initCSS("cart");
        await this.loadBase();
        await LoaderHelper.preloadPage(LoaderPages.cart);
        new drawCart();

    }
    static async loadIndex(){
        await LoaderHelper.loadCSS("index");  
        this.initCSS("index");
        await this.loadBase();
        await LoaderHelper.preloadPage(LoaderPages.index);
        new drawIndex();
    }
    static async loadConverterStart(){
        await LoaderHelper.loadCSS("converterStart");  
        this.initCSS("converterStart");
        await this.loadBase();
        await LoaderHelper.preloadPage(LoaderPages.converterStart);
        new drawConverterStart();
    }
    static async loadConverter(){ 

        await LoaderHelper.loadCSS("converter");  
        await LoaderHelper.loadCSS("fontfaces"); 
        this.initCSS("converter", "fontfaces");
        await this.loadBase();
        await LoaderHelper.preloadPage(LoaderPages.converter);
        new Converter();
    }
    static async prefetch(){
        LoaderHelper.prefetchProject();
        LoaderHelper.prefetchSplint();
        LoaderHelper.prefetchCSS("converterStart");  
        LoaderHelper.prefetchCSS("index"); 
        LoaderHelper.prefetchCSS("converter");  
        LoaderHelper.prefetchCSS("fontfaces");  
        LoaderHelper.prefetchCSS("cart");  
        LoaderHelper.prefetchCSS("AGBs");  
        LoaderHelper.prefetchCSS("paymentComplete");  
        LoaderHelper.prefetchCSS("imprint");  
        LoaderHelper.prefetchCSS("checkout");  
        LoaderHelper.prefetchCSS("dataProtection");  
    }
}
LoaderMain.start();


// SPLINT.Events.onLoadingComplete = function(){
    // LoaderMain.prefetch();
// }

// setTimeout(function(){
//     SPLINT.Events.onLoadingComplete.dispatch();
// }, 5000);