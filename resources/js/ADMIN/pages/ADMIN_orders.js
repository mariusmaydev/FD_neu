
class ADMIN_orders extends ADMIN_DrawTemplate {
    static VIEW = "view";
    constructor(){
        super("orders");
        ADMIN_loginFuncs.check_redirect();
        // this.draw();
        this.mainElement.Class("ADMIN_orderMain");
    }
    draw(){
        this.mainElement.innerHTML = "";

        this.radioButtonType = new S_radioButton(this.head, "chooseType");
        this.radioButtonType.dataObj.add("Open", "offene Bestellungen");
        this.radioButtonType.dataObj.add("Archive", "archivierte Bestellungen");
        this.radioButtonType.drawRadio();
        this.radioButtonType.onChange = function(){
                if(this.radioButtonType.Value == "Archive"){
                    S_Location.setHash(true);
                    this.choosePage();
                } else {
                    S_Location.setHash(false);
                    this.choosePage();
                }
            }.bind(this);
        this.choosePage();
    }
    choosePage(){
        this.mainElement.innerHTML = "";
        let hashtags = S_Location.getHashes();
        let hashtag = hashtags;
        if(typeof hashtags == 'object'){
            hashtag = hashtags[0];
        }
        switch(hashtag){
            case 'view' : new ADMIN_order_view(this.mainElement, hashtags[1], hashtags[2]); this.radioButtonType.mainElement.style.display = "none"; break;
            default : new ADMIN_order_list(this.mainElement, hashtags); /*this.radioButtonType.mainElement.style.display = "block"*/; break;
        }
    }
}