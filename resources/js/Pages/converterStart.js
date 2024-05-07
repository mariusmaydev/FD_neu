
class drawConverterStart extends Pages_template {
    constructor() {
        super("converterStart");
    }
    draw(){
        this.choiceMenu     = new drawProjectChoiceMenu(this.mainElement);
        setTimeout(async function(){
            console.dir(SPLINT.Events.onLoadingComplete);
        }, 10000)
        SPLINT.Events.onLoadingComplete = function(){
            this.mainElement.setAttribute("loaded", true);
        }.bind(this);
        if(SPLINT.Events.onLoadingComplete.dispatched == true){
            this.mainElement.setAttribute("loaded", true);
        }
        NavBar.setInParts();
    }
}