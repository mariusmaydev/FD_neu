
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
        console.dir(this)
        let stackOut = [];
        for(const ele of this.inst.stack){
            let elem = new Object();
        
            if(ele.type == "txt"){
                elem.data = ele.data;
                elem.type = ele.type;
            } else {
                elem.data = ele.data;
                elem.type = ele.type;
        
                if(true || !SPLINT.CacheStorage.has(ele.ID)){
                    let blob = SPLINT.Tools.CanvasTools.loadImageAsBlob(ele.src.currentSrc);
                    // let src = SPLINT.Tools.CanvasTools.base64ToSrc(ele.src.currentSrc);
                    console.dir(blob)
                    let ob = new Object();
                        ob.blob = await blob;//SPLINT.Tools.CanvasTools.base64toBlob(src);
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
    // async #update(){
    //     // let offscreen  = document.createElement("canvas").transferControlToOffscreen();
    //     let canvas = document.createElement("canvas");
    //         canvas.width = this.inst.canvas.width;
    //         canvas.height = this.inst.canvas.height;
    //     let ctx = canvas.getContext("2d");
    //     let size = {
    //         x: this.inst.canvas.width,
    //         y: this.inst.canvas.height,
    //         dimensions: ConverterRenderThumbnail.SIZE
    //     }
    //     let stackOut = [];
    //     let transfers = [];
    //     console.log(this)
    //     for(const ele of this.inst.stack){
    //         // console.dir(ele.canvas.toDataURL("image/png", 1));
    //         // ctx.save();
    //         // ctx.drawImage(ele.canvas, 0, 0, ele.canvas.width, ele.canvas.height, 0, 0, canvas.width, canvas.height)
    //         // ctx.restore();
    //         let elem = new Object();
        
    //         if(ele.type == "txt"){
    //             elem.data = ele.data;
    //             elem.type = ele.type;
    //             elem.canvas = canvas;
    //             elem.ctx = ctx;
    //             elem.needsUpdate = false;
    //             canvasPaths.drawTextBuffer(elem, false);
    //         } else {
    //             elem.data = ele.data;
    //             elem.type = ele.type;
    //             elem.src  = ele.src;
    //             elem.canvas = canvas;
    //             elem.ctx = ctx;
    //             elem.needsUpdate = false;
    //             canvasPaths.drawImageBuffer(elem, false);
        
    //             if(true || !SPLINT.CacheStorage.has(ele.ID)){
    //                 // let src = SPLINT.Tools.CanvasTools.base64ToSrc(ele.src.currentSrc);
    //                 let ob = new Object();
    //                     ob.blob = await ele.canvasBuffer.convertToBlob();//await SPLINT.Tools.CanvasTools.base64toBlob(src);
    //                     ob.time = ele.time
        
    //                 SPLINT.CacheStorage.add(ele.ID, ob);
    //                 elem.blob = ob.blob;
    //             } else {
    //                 elem.blob = SPLINT.CacheStorage.get(ele.ID).blob;
    //             }
    //         }
    //         stackOut.push(elem)
    //     }
    //     // console.dir(canvas.toDataURL("image/png", 1))
    //         let imageData = (await Converter.workerCreateThumbnail.sendInPromise("createThumbnail", { canvas: offscreen, stack: stackOut, size: size}, [offscreen])).data;
    //         // let imageData = (await Converter.workerCreateThumbnail.sendInPromise("createThumbnail", { stack: stackOut, size: size})).data;

            
    //     // console.dir(imageData)
    //     let cv = document.createElement("canvas");
    //         cv.width = size.dimensions;
    //         cv.height = size.dimensions;
    //         let ctx1 = cv.getContext("2d");
    //         ctx1.save()
    //         ctx1.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, size.dimensions, size.dimensions)
    //         ctx1.restore()

    //         let binImg = await SPLINT.BinaryImage.fromImageData(ctx1.getImageData(0, 0, size.dimensions, size.dimensions));
    //     DSProject.Storage.Thumbnail = binImg;

    //     return binImg;
    // }
    async #updateTXT(size){
        let canvasTxT = document.createElement("canvas");
            canvasTxT.width = size.x;
            canvasTxT.height = size.y;
        let ctxTxT     = canvasTxT.getContext('2d', { willReadFrequently: true });
            ctxTxT.fillStyle = "transparent";
            ctxTxT.fillRect(0, 0, canvasTxT.width, canvasTxT.height);
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
            return DSProject.Storage.Thumbnail.saveToURL();
        } else {
            return false;
        }
    }
}