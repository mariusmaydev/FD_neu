
class drawImprint extends Pages_template{
    constructor(parent = document.body){
        super("imprint");
        this.id = "Imprint_";
        this._draw();
    }
    _draw(){
        
        this.background = new drawBackground3D(document.body, "back", "medium");
        this.background.div.before(this.mainElement);
    }
} 