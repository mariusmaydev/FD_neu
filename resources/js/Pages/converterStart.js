
class drawConverterStart extends Pages_template {
    constructor() {
        super("converterStart");
    }
    draw(){
        this.background = new drawBackground3D(document.body, "back", "medium");
        this.background.div.before(this.mainElement);
        this.choiceMenu     = new drawProjectChoiceMenu(this.mainElement);
        // if(SPLINT.ViewPort.getSize() == "mobile-small"){
        //     Footer.mobile();
        // } else {
        //     Footer.desktop();
        // }
        setTimeout(async function(){
            console.dir(SPLINT.Events.onLoadingComplete);
        }, 10000)
        SPLINT.Events.onLoadingComplete = function(){
            this.mainElement.setAttribute("loaded", true);
        }.bind(this);
        if(SPLINT.Events.onLoadingComplete.dispatched == true){
            this.mainElement.setAttribute("loaded", true);
        }
    }
}