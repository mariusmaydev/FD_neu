
class drawConverterStart extends Pages_template {
    constructor(pre = false) {
        super("converterStart", pre);
    }
    draw(){
        // this.mainElement.setAttribute("loaded", true);
        // SPLINT.Events.onLoadingComplete.dispatch();
        // SPLINT.Events.onLoadingComplete = function(){
        // }.bind(this);
        // if(SPLINT.Events.onLoadingComplete.dispatched == true){
        //     this.mainElement.setAttribute("loaded", true);
        // }
            SPLINT.SessionsPHP.remove("PROJECT_ID", false);
            SPLINT.SessionsPHP.remove("PROJECT_NAME", false);
        this.choiceMenu     = new drawProjectChoiceMenu(this.mainElement);
            this.mainElement.setAttribute("loaded", true);
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            NavBar.setSolid();
        } else {
            NavBar.setInParts();
            // NavBar.setSolid();
        }

    }
}