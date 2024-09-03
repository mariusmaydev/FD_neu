import * as THREE from "@THREE";
import SPLINT from "SPLINT";

export default class workerInterfaceNEW {
    static stack = [];
    static WORKERMANAGER = new window.SPLINT.Worker.WebWorker.Manager("js/_WebWorker/_module/_normalMapWorker.js");
    static {
        this.flag = true;
        this.worker = workerInterfaceNEW.WORKERMANAGER.connect("normalMapWorker", true, false).then(async function (worker) {
            workerInterfaceNEW.worker = worker;
        })
    }
    static async createNormalMap(name, url_imageData){
        let ele  = new Object();
            ele.name = name;
            ele.src = url_imageData;
            ele.resolve = function(){};
            ele.prom = new Promise(async function(resolve, reject){
                ele.resolve = resolve;
            });
        this.stack.push(ele);
        if(this.worker.initComplete){
            this.check();
        }
        return ele.prom;
    }
    static async check(){
        if(!this.flag){
            return ;
        }
        console.dir(this)
        if(this.worker.initComplete && this.stack.length > 0){
            this.flag = false;
            this.startWorker(this.stack.pop());
        }
    }
    static async startWorker(ele){
        this.worker.sendInPromise("createNormalMap", {src: ele.src, id: ele.name}).then(async function(e){
            ele.resolve(e.data);
            workerInterfaceNEW.flag = true;;
            workerInterfaceNEW.check();
        });
    }
}


// export default class workerInterfaceNEW {
//     static WORKERMANAGER = new window.SPLINT.Worker.WebWorker.Manager("js/_WebWorker/_module/_normalMapWorker.js");
//     static async createNormalMap(name, url_imageData){
//         return new Promise(async function(resolve){
//             workerInterfaceNEW.WORKERMANAGER.connect(name, true, false).then(async function(worker){
//                 worker.sendInPromise("createNormalMap", {src: url_imageData, id: name}).then(async function(e){
//                     // console.log(e)
//                     // let c = document.createElement("canvas");
//                     //     c.width = e.data.width;
//                     //     c.height = e.data.height;
//                     // let ctx = c.getContext("2d");
//                     //     ctx.putImageData(e.data, 0, 0);
                        
//                     // console.dir(c.toDataURL("image/png"));
//                     // worker.t
//                         resolve(e.data);
//                 });
//             });
//         });
//     }
// }