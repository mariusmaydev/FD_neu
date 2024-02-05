
class ADMIN_chartTamplate {
    static {
        const colors = SPLINT.Utils.Colors;
        this.colors = new Object();
        this.colors.orange1 = new colors.colorRGBa().fromHex('fff1de');
        this.colors.orange2 = new colors.colorRGBa().fromHex('ffa228');

        this.gradients = new Object();
        this.gradients.g1 =  new colors.Gradient(this.colors.orange1, this.colors.orange2);
    }
    constructor(parent, name, data = null, data1 = null){
        // let map = [1,2,3,4,5,6,7,{a:3},9];
        let dataset1 = new SPLINT.API.ChartJS.DataSet(null, ADMIN_chartTamplate.gradients.g1, "ok");
            dataset1.addData(data, data1);
        // let map2 = [2,2,3,8,5,6,2,{a:3},9];
        // let dataset2 = new S_chartDataSet(map2, grad, "ok1");
        //     // dataset2.gradient.color2 = new colors.colorRGBa().fromHex('000000');
        //     dataset2.type = "bar";
            dataset1.type = "bar";
        let chartObj1 = new SPLINT.API.ChartJS.Object('line', dataset1);
        
        return new SPLINT.API.ChartJS.Container(name, parent, chartObj1);
    }

}