

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
        let userData = await managerCallPHP.getUserData();
        console.dir(userData);
        let pUserData = statisticsHelper.parseUserData(userData);
        let lastPages = statisticsHelper.getLastPages(pUserData);
        let visitDuration = statisticsHelper.getVisitDurations(pUserData);
        let orderValues = (await statisticsHelper.getOrderValues(await order.get()));
        // let orderAmount = (await statisticsHelper.getOrderAmount(await order.get()));
        console.log(order.get(), order.getFromArchive())
        let ef = order.get();
        let gh = new Object();
        ef.then(function(g){
            for(const key in g){
                let t = S_Time.convertDateTimeToFormatedUnix(g[key].Time);
                let ji = new formatUnix_S(t * 1000);
                // console.dir(ji.date())
                let da = ji.date();
                if(gh[da] != undefined){
                    gh[da] += 1;
                } else {
                    gh[da] = 1;
                }
            }

            this.drawChart("orderAmount", "Anzahl Bestellung", gh)
            // console.log(g)
        }.bind(this));
        console.log(gh)
        this.ContentMain = new SPLINT.DOMElement(this.id + "contentMain", "div", this.mainElement);
        this.ContentMain.Class("contentMain"); 

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