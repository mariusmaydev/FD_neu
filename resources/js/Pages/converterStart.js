
class drawConverterStart extends Pages_template {
    constructor() {
        super("converterStart");
    }
    draw(){
        this.background = new drawBackground3D(document.body, "back", "medium");
        this.background.div.before(this.mainElement);
        this.choiceMenu     = new drawProjectChoiceMenu(this.mainElement);
        // this.projectList    = new drawProjectList(this.mainElement, "converterStart", false);
        // this.projectList1    = new drawProjectList(this.mainElement, "converterStart1", false);
        SPLINT.Events.onLoadingComplete = function(){
            this.mainElement.setAttribute("loaded", true);
        }.bind(this);
    }
}