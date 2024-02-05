
class statisticsHelper {
    static getLastPages(AllUserObj){
        let res = new Object();
        for(const e of AllUserObj){
            let entry = e.Path[e.Path.length - 1];
            let name = entry.Page;
            let hashes = entry.hashes;
            if(hashes.length > 0){
                name = name + "#" + hashes.join('#');
            }
            console.dir(entry);
            if(res[name] == undefined){
                res[name] = 1;
            } else {
                res[name] = res[name] + 1;
            }
        }
        return res;
    }
    static parseUserData(UserData){
        let res = [];
        for(const e of UserData){
            e.IP = SPLINT.Tools.parse.toJSON(e.IP);
            e.Path = SPLINT.Tools.parse.toJSON(e.Path);
            res.push(e);
        }
        return res;
    }
    static getVisitDurations(pUserData){
        let res = [];
        for(const e of pUserData){
            let k = new Date(e.TimeStart);
            let k1 = new Date(e.TimeEnd);
            res.push(SPLINT.Tools.DateTime.timeDiffSec(k, k1));
        }
        return res;
    }
    static async getOrderAmount(orderData){
        let price = 25;
        let res = [];
        for(const e of orderData){
            let value = 0;
            for(const i of e.Items){
                price = (await productHelper.getByName(i.ProductName)).price;
                value = value + parseInt(i.amount) * price;
            }
            res.push(value);
        }
        return res;
    }
    static async getOrderValues(orderData){
        let price = 25;
        let res = [];
        for(const e of orderData){
            let value = 0;
            for(const i of e.Items){
                price = (await productHelper.getByName(i.ProductName)).price;
                value = value + parseInt(i.amount) * price;
            }
            res.push(value);
        }
        return res;
    }
}