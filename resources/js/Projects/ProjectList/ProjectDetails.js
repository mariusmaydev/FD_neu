
class ProjectDetails {
    constructor(data, parent, lighterParent = null){
        this.lighterParent = lighterParent;
        this.parent = parent;
        this.id = "ProjectDetails_" + "_";
        this.data = data;
        this.mainElement = null;
        this.ele = null;
        this._onclose = function(){};
    }
    set onclose(v){
        this._onclose = v;
    }
    async show(drawButtons = true){
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            this.ele = new ProjectDetails_Mobile(this.data, this.parent, this.lighterParent);
        } else {
            this.ele = new ProjectDetails_Desktop(this.data, this.parent, this.lighterParent);
        }
        await this.ele.show(drawButtons);
        this.ele.onclose = this._onclose;
    }
    hide(){
        this.ele.hide();
    }
}