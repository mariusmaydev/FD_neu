
class manager extends SPLINT.autoObject {
    static {
        // this.initWorker();
        // this.fullyLoaded = Promise.allSettled([
        //     SPLINT.require('@PROJECT_ROOT/manager/managerHelper.js'),
        //     SPLINT.require('@PROJECT_ROOT/manager/managerCallPHP.js'),
        //     SPLINT.require('@PROJECT_ROOT/manager/managerObject.js')
        // ]);
        // this.fullyLoaded.then(async function(){
        //     this.managerObject = new managerObject();
        // }.bind(this))
    }
    static initWorker(){
        // let a = SPLINT.API.WebWorkerAPI.defineWorker({
        //     name : "testW",
        //     src  : {
        //         url: "@SPLINT_ROOT/WebWorker/WebWorkerManager.js"
        //     },
        //     maxInstances : 5
        // })
        // console.log(a);
        // let h = a.getHandle();
        // console.dir(h)
        // this.WORKER = new SPLINT.Worker.WebWorker("js/manager/_managerWorker.js", true, false);
        // this.WORKER.onReceive = async function(event) {
        //     console.log("receive", event.data)
        // }
    }
    static sendClickToWorker(element, x, y){
        // this.WORKER.send("click", {x: x, y: y});
    }
    // static 
    // static {
    //     this.WORKER = new SPLINT.Worker.WebWorker("js/manager/_managerWorker.js", true, false);
    //     this.WORKER.onReceive = async function(event) {
    //         console.log("receive", event.data)
    //     }
    //     // this.WORKER.onInitComplete = function(){
    //     //     SPLINT.Worker.WorkerHelper.updateSplint(this.WORKER);
    //     // }.bind(this);
    //     this.STORAGE = new SPLINT.autoObject(false);
    //     this.STORAGE.Page.TimeStart;
    //     this.STORAGE.Page.TimeEnd;
    //     this.STORAGE.Page.name;
    //     this.STORAGE.interactions.click = [];
    //     this.mo = new managerObject();
    //     console.log(this.mo)
    // }
    static async dir(){
        console.dir(this.prototype.parseToObject.call(this))
    }
    static async log(){
        console.log(this.prototype.parseToObject.call(this))
    }
    static async registerClick(element, x, y){
        // this.sendClickToWorker(element, x, y);
        // Function.prototype.test = function(){
        //     return "ok"
        // }
    }
    
}
window.addEventListener("click", async function(event){
    // manager.registerClick(event.target, event.x, event.y);
}, true);
