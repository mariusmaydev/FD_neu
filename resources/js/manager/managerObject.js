
class managerObject {
    STORAGE = new Object();
    constructor(){
        this.STORAGE.Path       = [];
        this.STORAGE.TimeEnd    = null;
        this.init();
    }
    async init(){
        SPLINT.SessionsPHP.showAll();
        await this.get();
        await this.push();
        this.events();
    }
    events(){
        window.addEventListener("hashchange", async function(){
            this.STORAGE.Path[this.STORAGE.Path.length - 1].TimeEnd = S_DateTime.parseToMySqlDateTime((new Date()));
            this.STORAGE.TimeEnd = S_DateTime.parseToMySqlDateTime((new Date()));
            await this.push();
            this.savePHP();
        }.bind(this));
        window.addEventListener("beforeunload", function(e){
            this.STORAGE.Path[this.STORAGE.Path.length - 1].TimeEnd = S_DateTime.parseToMySqlDateTime((new Date()));
            this.STORAGE.TimeEnd = S_DateTime.parseToMySqlDateTime((new Date()));
            // await this.push();
            this.savePHP();
        }.bind(this))
    }
    async savePHP(){
        let st = this.STORAGE;console.dir(st);
        let f = managerCallPHP.editUser(st.UserID, JSON.stringify(st.IP), st.TimeStart, st.TimeEnd, JSON.stringify(st.Path));
    }
    async createPHP(){
        let st = this.STORAGE;console.dir(st);
        let f = managerCallPHP.createUser(st.UserID, JSON.stringify(st.IP), st.TimeStart, st.TimeEnd, JSON.stringify(st.Path));
    }
    async get(){
        return new Promise(async function(resolve){
            let res = (await this.getPHP());
                if(typeof res == "object" && res != null){
                    this.STORAGE = res;
                } else {
                    this.STORAGE.TimeStart = S_DateTime.parseToMySqlDateTime((new Date()));
                    this.STORAGE.UserID = (await SPLINT.SessionsPHP.get("USER_ID", false));
                    this.STORAGE.IP = (await managerObject.getIP());
                    await this.createPHP();
                }
            resolve(res);
        }.bind(this));
    }
    async getPHP(){
        return new Promise(async function(resolve){
            let res = (await managerCallPHP.getUserData((await SPLINT.SessionsPHP.get("USER_ID", false))));
                if(res == "null" || res == null){
                    resolve(res);
                    return res;
                }
                if(res["Path"] == "" || res["Path"] == null){
                    res["Path"] = [];
                } else {
                    res["Path"] = SPLINT.Tools.parse.toJSON(res["Path"]);
                }
                if(res["IP"] != "" && res["Path"] != null){
                    res["IP"] = SPLINT.Tools.parse.toJSON(res["IP"]);
                }
                resolve(res);
        });
    }
    async push(){
        let obj = new managerPageObject();
            obj.Page        = managerObject.getPage();
            obj.hashes      = (await SPLINT.Tools.Location.getHashes());
            obj.TimeStart   = S_DateTime.parseToMySqlDateTime((new Date()));
            obj.TimeEnd     = null;
        this.STORAGE.Path.push(obj)
    }
    static getPage(){
        let url = location.pathname;
        let page = null;
        if(url.endsWith("/")){
            page = "index";
        } else {
            let fileName = url.split("/");
            page = fileName.at(-1).split(".")[0];
        }
        return page;
    }  
    static async getIP(){
        return SPLINT.API.IPinfo.get();
    }
}