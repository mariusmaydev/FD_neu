import * as THREE from "@THREE";
import SPLINT from "SPLINT";

export default class workerInterfaceNEW {
    static WORKERMANAGER = new window.SPLINT.Worker.WebWorker.Manager("js/_WebWorker/_module/_normalMapWorker.js");
    static async createNormalMap(name, url_imageData){
        return new Promise(async function(resolve){
            workerInterfaceNEW.WORKERMANAGER.connect(name, true, false).then(async function(worker){
                worker.sendInPromise("createNormalMap", {src: url_imageData, id: name}).then(async function(e){
                    // console.log(e)
                    // let c = document.createElement("canvas");
                    //     c.width = e.data.width;
                    //     c.height = e.data.height;
                    // let ctx = c.getContext("2d");
                    //     ctx.putImageData(e.data, 0, 0);
                        
                    // console.dir(c.toDataURL("image/png"));

                        resolve(e.data);
                });
            });
        });
    }
}