
class ConverterRenderThumbnail {
    static #INSTANCE = null
    static #PROMS;
    static SIZE = 2048;
    static {
        this.#PROMS = new Object();
        this.#PROMS.update  = null;
        this.#PROMS.save    = null;
    }
    constructor(inst){
        if(ConverterRenderThumbnail.#INSTANCE != null){
            return ConverterRenderThumbnail.#INSTANCE;
        }
        this.inst = inst;
        ConverterRenderThumbnail.#INSTANCE = this;
    }
    static async update(){
        if(this.#INSTANCE != null){
            return this.#INSTANCE.update.callFromIdle(100, this.#INSTANCE);
        }
        return false;
    }
    static async save(direct = false){
        if(direct){
            return this.#INSTANCE.save()
        }
        if(this.#INSTANCE != null){
            return this.#INSTANCE.save.callFromIdle(100, this.#INSTANCE);
        }
        return false;
    }
    save(){
        if(!(ConverterRenderThumbnail.#PROMS.save instanceof Promise)){
            ConverterRenderThumbnail.#PROMS.save = new Promise(async function(resolve){
                let res = await this.#save();
                ConverterRenderThumbnail.#PROMS.save = res;
                resolve(res);
            }.bind(this));
        }
        return ConverterRenderThumbnail.#PROMS.save;
    }
    update(){
        if(!(ConverterRenderThumbnail.#PROMS.update instanceof Promise)){
            ConverterRenderThumbnail.#PROMS.update = new Promise(async function(resolve){
                let res = await this.#update();
                ConverterRenderThumbnail.#PROMS.update = res;
                resolve(res);
            }.bind(this));
        }
        return ConverterRenderThumbnail.#PROMS.update;
    }
    async #update(){
        // let offscreen  = document.createElement("canvas").transferControlToOffscreen();
        let size = {
            x: this.inst.canvas.width,
            y: this.inst.canvas.height,
            dimensions: ConverterRenderThumbnail.SIZE
        }
        let stackOut = [];
        for(const ele of this.inst.stack){
            let elem = new Object();
        
            if(ele.type == "txt"){
                elem.data = ele.data;
                elem.type = ele.type;
            } else {
                elem.data = ele.data;
                elem.type = ele.type;
        
                if(!SPLINT.CacheStorage.has(ele.ID)){
                    let src = SPLINT.Tools.CanvasTools.base64ToSrc(ele.src.currentSrc);
                    let ob = new Object();
                        ob.blob = await SPLINT.Tools.CanvasTools.base64toBlob(src);
                        ob.time = ele.time
        
                    SPLINT.CacheStorage.add(ele.ID, ob);
                    elem.blob = ob.blob;
                } else {
                    elem.blob = SPLINT.CacheStorage.get(ele.ID).blob;
                }
            }
            stackOut.push(elem)
        }
            // let imageData = (await Converter.workerCreateThumbnail.sendInPromise("createThumbnail", { canvas: offscreen, stack: stackOut, size: size}, [offscreen])).data;
            let imageData = (await Converter.workerCreateThumbnail.sendInPromise("createThumbnail", { stack: stackOut, size: size})).data;
// 

        // // let canvasTxT = await this.#updateTXT(size);
        // // let canvasOut = document.createElement("canvas")
        // //     canvasOut.width = ConverterRenderThumbnail.SIZE;
        // //     canvasOut.height = ConverterRenderThumbnail.SIZE;
        // // let ctxOut = canvasOut.getContext("2d", {colorSpace: "srgb"});
        // //     ctxOut.putImageData(imageData, 0, 0)
        // //     ctxOut.drawImage(canvasTxT, 0, 0, canvasTxT.width, canvasTxT.height, 0, 0, ConverterRenderThumbnail.SIZE, ConverterRenderThumbnail.SIZE);

        // //     let imh1 = ctxOut.getImageData(0, 0, ConverterRenderThumbnail.SIZE, ConverterRenderThumbnail.SIZE, {colorSpace: "srgb"})
        
            let binImg = await SPLINT.BinaryImage.fromImageData(imageData);
        DSProject.Storage.Thumbnail = binImg;

        return binImg;
    }
    async #updateTXT(size){
        let canvasTxT = document.createElement("canvas");
            canvasTxT.width = size.x;
            canvasTxT.height = size.y;
        let ctxTxT     = canvasTxT.getContext('2d', { willReadFrequently: true });
            ctxTxT.fillStyle = "transparent";
            ctxTxT.fillRect(0, 0, canvasTxT.width, canvasTxT.height);
            // ctxTxT.scale(size.scale, size.scale);
            for(const ele of this.inst.stack) {
                if(ele.type == "txt"){
                let elem = new Object();
                    elem.data = ele.data;
                    elem.type = ele.type
                    elem.ctx = ctxTxT;
                    await canvasPaths.drawThumbnailTxt(elem);
                }
            }
        return canvasTxT;
    }
    async #save(){
        if(DSProject.Storage.Thumbnail instanceof SPLINT.BinaryImage) {
            SPLINT.IndexedDB.set(DSProject.Storage.ProjectID + "_thumbnail", DSProject.Storage.Thumbnail, "DynamicData")
            console.log(DSProject)
            return DSProject.Storage.Thumbnail.saveToURL();
        } else {
            return false;
        }
    }
}