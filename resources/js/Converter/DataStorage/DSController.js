
class DSController {
    static PATH = PATH.php.converter;
    static #ThumbnailCreationLoopFlag = false;
    static startThumbnailCreationLoop(delay){
        if(!this.#ThumbnailCreationLoopFlag){
            this.#ThumbnailCreationLoopFlag = true;
            this.#ThumbnailCreationLoop(delay);
        } else {
            console.warn("ThumbnailCreationLoop already created");
        }
    }
    static async #ThumbnailCreationLoop(delay){
        setTimeout(async function(){
            DSProject.Storage.Thumbnail = await CONVERTER_STORAGE.canvasNEW.createData(1);
            this.#ThumbnailCreationLoop(delay);
        }.bind(this), delay)
    }
    static async createThumbnail(quality = 1){
        DSProject.Storage.Thumbnail = await CONVERTER_STORAGE.canvasNEW.createData(quality);
        return DSProject.Storage.Thumbnail;
    }
    static async saveAll(){
        return new Promise(async function(resolve){
        let imgData = DSImage.parse();
        let textData = DSText.parse();
        let projectData = DSProject.get();
        let call = new SPLINT.CallPHP(this.PATH, "SAVE.ALL");
            call.data.img = imgData;
            call.data.txt = textData;
            call.data.project = projectData;
            call.keepalive = false;
        
            let res = await call.send();
            resolve(res);    
        }.bind(this));
    }
    static async getAll(){
        return new Promise(async function(resolve){
            let call = new SPLINT.CallPHP(this.PATH, "GET.ALL");
            let res = await call.send();
            DSImage.add(res.img);
            DSText.add(res.txt);
            DSProject.add(res.project);
            resolve(res);    
        }.bind(this));
    }
}
// DSController.startThumbnailCreationLoop(5000);