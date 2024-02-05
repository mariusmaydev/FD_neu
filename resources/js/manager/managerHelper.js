



class ManagerHelper {
    static PATH = PATH.php.manager;
    static PAGE;
    static STORAGE = new SPLINT.autoObject();
    static {
        SPLINT.Events.onInitComplete = function(){
            if(location.href.includes("/HTML/ADMIN/")){
                return;
            }
            let f = new managerObject();
            console.log(f)
            // this.#getPage();
            // this.STORAGE.TimeStart = new Date();
            // document.addEventListener("visibilitychange", function(e){
            //     if (document.visibilityState === 'hidden') {
            //         this.STORAGE.TimeEnd = new Date();
            //         this.#save();
            //     }
            //     // console.dir(window.location)
            //     // console.dir(e.target.referrer)
            //     // console.dir(e);
    
            //     // // let newOrigin = S_URI.getOrigin(e.target.referrer);
            //     // // if(location.href == e.target.referrer){
    
            //     // // }
            // }.bind(this));
            // this.#saveIP();
        }.bind(this);

    }
    static async #saveIP(){
        let res = await SPLINT.API.IPinfo.get();
        let q = new Object();
            q.a = "b";
        //     let res3 = await managerCallPHP.editUser(null, res.ip);
        // let res1 = await managerCallPHP.editUserPATH(null, q);
        let res2 = await managerCallPHP.editIP(null, res);
        console.log(res2)

    }
    static #getPage(){
        let url = location.pathname;
        if(url.endsWith("/")){
            this.PAGE = "index";
        } else {
            let fileName = url.split("/");
            this.PAGE = fileName.at(-1).split(".")[0];
        }
        return this.PAGE;
    }
    static #save(){
        let tStart  = S_DateTime.parseToMySqlDateTime(this.STORAGE.TimeStart);
        let tEnd    = S_DateTime.parseToMySqlDateTime(this.STORAGE.TimeEnd);
        managerCallPHP.add(tStart, tEnd, this.PAGE);
    }
    
}
// SPLINT.require('@PROJECT_ROOT/manager/managerCallPHP.js');
// SPLINT.require('@PROJECT_ROOT/manager/manager.js');