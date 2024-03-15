
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
        // this.projectList    = new drawProjectList(this.mainElement, "converterStart", false);
        // this.projectList1    = new drawProjectList(this.mainElement, "converterStart1", false);
        
        // this.linkImprint = new SPLINT.DOMElement.Button(this.mainElement, "imprint", "Impressum");
        // this.linkImprint.Class("linkImprint");
        // this.linkImprint.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_DEFAULT);
        // this.linkImprint.onclick = function(){
        //     S_Location.goto(PATH.location.imprint).call();
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