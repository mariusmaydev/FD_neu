

class ADMIN_statistics extends ADMIN_DrawTemplate {
    constructor(){
        super("statistics");
    }
    async getData(){
        // let a = await ManagerHelper.g
    }
    draw(){
        this.ContentMain = new SPLINT.DOMElement(this.id + "contentMain", "div", this.mainElement);
        this.ContentMain.Class("contentMain"); 
        let a = new ADMIN_chartTamplate(this.ContentMain, "test", [1,2,3,4]);
        let b = new ADMIN_chartTamplate(this.ContentMain, "test2", [5,2,3,4]);
        let c = new ADMIN_chartTamplate(this.ContentMain, "test3", [1,2,3,4]);
        let d = new ADMIN_chartTamplate(this.ContentMain, "test4", [1,6,3,41]);
        let e = new ADMIN_chartTamplate(this.ContentMain, "test5", [1,2,3,4]);

        let f = new ADMIN_chartTamplate(this.ContentMain, "test6", [8,2,3,4,3,3,3,3,3]);
            f.config.data.datasets[0].gradient.color1 = new SPLINT.Utils.Colors.colorRGBa().fromHex('ff0f00');
            f.update();
    }
}