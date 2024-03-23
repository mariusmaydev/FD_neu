
importScripts(location.origin + "/Splint/js/DataManagement/indexedDB.js");
SPLINT.require_now("@SPLINT_ROOT/Tools/fontObject.js");

importScripts(location.origin + "/fd/resources/js/_WebWorker/_common/_converterWorker/_ConverterWorkerHelper.js");

importScripts(location.origin + "/Splint/js/dataTypes/BinaryImage/BinaryImage.js");

const FontFaceStorage = new SPLINT.IndexedDB.Manager("StaticData");

class ConverterWorker_render extends SPLINT.Worker.WorkerHelper.WebWorkerTemplate {
    static { new this() }
    static {
        this.canvas = null;
        this.ctx = null;
    }
    
    async init(data){
        console.dir(data)
        
        ConverterWorker_render.canvas = data.canvas;
        ConverterWorker_render.ctx = ConverterWorker_render.canvas.getContext('2d');
          this.#animate();
        
        // return "d"
    }
    async #animate() {
        // do  animations here ...
        let ctx = ConverterWorker_render.ctx;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 200, 200);
        const bitmap = ConverterWorker_render.canvas.transferToImageBitmap();
        self.postMessage({msg: 'render', bitmap}); // this will be handled in main thread , where we will update the content 
        self.requestAnimationFrame(this.#animate.bind(this));
    }
      
}
