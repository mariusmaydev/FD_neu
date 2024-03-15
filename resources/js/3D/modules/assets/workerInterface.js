import { Texture } from "@THREE_ROOT_DIR/src/textures/Texture.js";
import SPLINT from "SPLINT";

export default class workerInterface {
    static #worker = null
    static size = 0;
    static get worker(){
        if(this.#worker == null){
            // this.#worker = new Worker(SPLINT.projectRootPath + "/js/_WebWorker/normalMapWorker.js", { type: "module"});
            // this.receiveMessage();
        }
        return this.#worker;
    }
    static set worker(v){
        this.#worker = v;
    }
    constructor(){
        this.worker = new Worker(SPLINT.projectRootPath + "/js/_WebWorker/normalMapWorker.js");
        this.id = workerInterface.size
        workerInterface.size += 1;
        this.receiveMessage();
    }
    receiveMessage(){
        this.worker.onerror = function(){
            console.log(arguments)
        }
        this.worker.onmessage = async function(e) {
            // if(e.data.id == this.id){
            //     console.log("ok")
            // } else {
            //     console.log("nok")
            // }
            workerInterface.size -= 1;
            // console.log(e)
            // let type = e.data.type;//await blobToBase64(e.data);
            // let content = e.data.content;//await blobToBase64(e.
            // console.log(content, type);
            this.resolveCall(this.compFunc(e.data.content));
            this.worker.terminate();
            // // let g = S_Tools.base64ToSrc(bmp)
            // this.thumbnail.lighter1.loadNormalMap(t);
            // // this.thumbnail.lighter1.loadThumbnailMaterial(t, 0xe8b000);
            // console.log(t)
        }.bind(this);
    }
    static async createNormalMap(url){
        let workerI = new workerInterface();

        let msg = new Object();
            msg.type = "createNormalMap";
            msg.url = url;
            workerI.compFunc = function(imgData){
            let t = new Texture(imgData);
                t.needsUpdate = true;
            return t;
        }
        return workerI.sendMessage(msg)
    }
    async sendMessage(msg){
        msg.id = this.id;
        return new Promise(async function(resolve){
            this.resolveCall = resolve;
            this.worker.postMessage(msg);
        }.bind(this));
    }
}