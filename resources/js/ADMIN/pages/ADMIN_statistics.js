

class ADMIN_statistics extends ADMIN_DrawTemplate {
    constructor(){
        super("statistics");
    }
    async getData(){
        // let a = await ManagerHelper.g
    }
    async draw(){
        // let t1 = new Date();
        // let mg = new managerObject();
        this.ContentMain = new SPLINT.DOMElement(this.id + "contentMain", "div", this.mainElement);
        this.ContentMain.Class("contentMain");

        let userData = await managerCallPHP.getUserData();
        let pUserData = statisticsHelper.parseUserData(userData);
        let lastPages = statisticsHelper.getLastPages(pUserData);
        let visitDuration = statisticsHelper.getVisitDurations(pUserData);
        let orderData = await order.get();
        let orderValues = (await statisticsHelper.getOrderValues(orderData));


        let orderAmountObj = new Object();
            for(const key in orderData){
                let t = SPLINT.Tools.DateTime.Helper.convertDateTimeToFormatedUnix(orderData[key].Time);
                let ji = new SPLINT.Tools.Time.Helper.formatUnix(t * 1000);
                let da = ji.date();
                if(orderAmountObj[da] != undefined){
                    orderAmountObj[da] += 1;
                } else {
                    orderAmountObj[da] = 1;
                }
            }

        this.drawChart("orderAmount", "Anzahl Bestellung", orderAmountObj)
        this.drawChart("visit_duration", "Besuchdauer", visitDuration)
        this.drawChart("lastPage", "Abbruchseite", lastPages)
        this.drawChart("orderValues", "Umsatz pro Bestellung", orderValues)
        
        let d = new ADMIN_chartTamplate(this.ContentMain, "test4", [1,6,3,41]);
        let e = new ADMIN_chartTamplate(this.ContentMain, "test5", [1,2,3,4]);

        let f = new ADMIN_chartTamplate(this.ContentMain, "test6", [8,2,3,4,3,3,3,3,3]);
            f.config.data.datasets[0].gradient.color1 = new SPLINT.Utils.Colors.colorRGBa().fromHex('ff0f00');
            f.update();
    }
    drawChart(name, label, data){
        let b = new ADMIN_chartTamplate(this.ContentMain, name, data);
            b.label = label;

    }
}