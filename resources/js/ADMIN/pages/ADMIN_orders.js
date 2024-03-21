
class ADMIN_orders extends ADMIN_DrawTemplate {
    static VIEW = "view";
    constructor(){
        super("orders");
        this.mainElement.Class("ADMIN_orderMain");
    }
    draw(){
        this.mainElement.innerHTML = "";

        this.radioButtonType = new SPLINT.DOMElement.Button.Radio(this.head, "chooseType");
        this.radioButtonType.dataObj.add("Open", "offene Bestellungen");
        this.radioButtonType.dataObj.add("Archive", "archivierte Bestellungen");
        this.radioButtonType.drawRadio();
        this.radioButtonType.onChange = function(){
                if(this.radioButtonType.Value == "Archive"){
                    S_Location.setHash(true);
                } else {
                    S_Location.setHash(false);
                }
            }.bind(this);
        this.choosePage();
        window.onhashchange = function(e){
            this.choosePage();
        }.bind(this);
    }
    choosePage(){
        this.mainElement.innerHTML = "";
        let hashtags = S_Location.getHashes();
        let hashtag = hashtags;
        if(typeof hashtags == 'object'){
            hashtag = hashtags[0];
        }
        if(hashtag == "true"){
            this.radioButtonType.setValue("Archive");
        } else if(hashtag == "false" || hashtag == undefined){
            this.radioButtonType.setValue("Open");
        }
        switch(hashtag){
            case 'view' : {
                new ADMIN_order_view(this.mainElement, hashtags[1], hashtags[2]); 
                this.radioButtonType.mainElement.style.display = "none"; 
            } break;
            default : {
                new ADMIN_order_list(this.mainElement, hashtags); /*this.radioButtonType.mainElement.style.display = "block"*/;
             } break;
        }
    }
}