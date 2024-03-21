
// import("./Core.js");
// import LighterThumbnail from "../model/LighterThumbnail.js";
// importScripts(location.origin + "/Splint/js/modules/ThreeJS/CORE.js");
// import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';
// import workerInterfaceNew from "../../assets/workerInterfaceNew.js";
let offscreencanvas;
let context_off;
console.dir(self)
self.onmessage = function (e){
    console.dir(e)
    if(e.data.msg == "init"){
    offscreencanvas = e.data.canvas; 
    context_off = offscreencanvas.getContext("2d");
    console.dir("init")
    loop();

    }
}
async function loop(){
    const bitmap = offscreencanvas.transferToImageBitmap();
    self.postMessage({msg : "render", bitmap } )
    requestAnimationFrame(loop);
}

// class indexRenderWorker extends SPLINT.Worker.WorkerHelper.WebWorkerTemplate {
//     static {
//         new this();
//         this.offscreencanvas;
//         this.ctx;
//         this.bitmap;
//     }

//     init(data){
//         indexRenderWorker.offscreencanvas = data.canvas; 
//         indexRenderWorker.context_off = indexRenderWorker.offscreencanvas.getContext("2d");
//         console.dir("init")
//         this.loop();
//     }
//     async loop(){
//         indexRenderWorker.bitmap = indexRenderWorker.offscreencanvas.transferToImageBitmap();
//         let bitmap = indexRenderWorker.bitmap;
//         self.postMessage({msg : "render", bitmap } )
//         requestAnimationFrame(this.loop.bind(this));
//     }
    
//     async animate(){
//         if(this.renderer.domElement.width > 0){
//             this.render();
//         } else {
//             requestAnimationFrame(this.animate.bind(this));
//         }
//     }
//     async render(){
//         this.context_off.clearRect(0, 0, this.canvas.parentNode.clientWidth * 2, this.canvas.parentNode.clientHeight * 2);
//         this.renderer.render(this.scene, this.camera);
//         this.cubeCamera.update(this.renderer, this.scene);
//         let domE = this.renderer.domElement;
//         this.context_off.drawImage(domE, 0, 0, domE.width, domE.height, 0, 0, this.canvas.width, this.canvas.height);

//         // this.context.transferFromImageBitmap(this.bitmap);
//     }
// }