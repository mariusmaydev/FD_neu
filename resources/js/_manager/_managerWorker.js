
SPLINT.require_now("@SPLINT_ROOT/Tools/json.js");
class managerWorker extends SPLINT.Worker.WorkerHelper.WebWorkerTemplate {
    static {
        new this();
    }
    async click(data){
        let path = SPLINT.projectRootPath + "php/collector/collectorAccess.php";
        let call = new SPLINT.CallPHP(path, "USER.GET");
            call.data.UserID    = data.UserID;
            let g =  await call.send();
            return g;
        // let i = await managerWorker.registerClick(data);
        // return i;
        // let message = new Object();
        //     message.method  = "click";
        //     message.data = i;
        //     self.poSstMessage(Smessage);
        // console.log("click")
    }
    // static async onmessage(e){
    //     console.log("e");
    //     if(e.data.method != "SPLINT-update"){
    //         await managerWorker.checkSplint();
            
    //     }
    //     switch (e.data.method) {
    //         case 'click' : {
    //             let i = await managerWorker.registerClick(e.data.data);
    //             let message = new Object();
    //                 message.method  = "click";
    //                 message.data = i;
    //             self.postMessage(message);
    //         } break;
    //         case 'SPLINT-update' : {
    //             let data = e.data.data;
    //             for(const e of Object.entries(data)){
    //                 SPLINT[e[0]] = e[1];
    //             }
    //             managerWorker.resolver();
    //         } break;
    //     }
    // }
    // static async checkSplint(){
    //     if(!this.t){
    //         console.log("call")
    //         await this.callSplint();
    //     }
    //     this.t = true;
    //     return;
    // }
    // static async callSplint(){
    //     return new Promise(async function(resolve){
    //         let message = new Object();
    //             message.method  = "SPLINT-update";
    //         self.postMessage(message);
    //         this.resolver = resolve;
    //     }.bind(this));
    // }
}