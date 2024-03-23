// importScripts(location.origin + "/Splint/js/Splint.js");
// import * as THREE from "@THREE";
import rendererT from "../../3D/modules/lighter/renderer.js";
// import SPLINT from "SPLINT";
class ThreeRenderWorker {
    static async onMessage(event) {
        console.dir(event);
            await this.loadThreeJS();
            
            const message   = event.data.msg;
            const data      = event.data;


            switch(message){
                case 'init': { 
                    this.init(data); 
                } break;
                case 'initRenderer': { 

                } break;
                case 'startRendering': { 

                } break;
            }
    }
    
    static async loadThreeJS(){
        // if(THREE == undefined){
        //     // self.THREE = await import(location.origin + "/Splint/node_modules/three/build/three.module.js");
        //     // self.test = await import(location.origin + "/fd/resources/js/3D/modules/lighter/renderer.js");
        // }
        // console.dir(self);
        // return THREE;
    }
    static transferBack(){
        const bitmap = this.canvas.transferToImageBitmap();
        self.postMessage( { msg : "render", bitmap } );
    }
    static async init(dataIn){
        console.dir("init_ThreeRender");
        console.log("this")
        this.canvas = dataIn.canvas;
        this.ctx    = this.canvas.getContext('webgl2');
        await this.setupRenderer();
        this.animate();
    }
    static async setupRenderer(){
        let renderer = rendererT.init(10, this.canvas.width, this.canvas.height, this.canvas); 
        this.context = renderer.getContext();
        console.dir(this)
        // this.renderer   = new THREE.WebGLRenderer({
        //     context: this.ctx, 
        //     canvas : this.canvas, 
        //     preserveDrawingBuffer:false, 
        //     antialias: false, 
        //     alpha: true, 
        //     precision: "highp", 
        //     powerPreference: "high-performance"
        // });
        // this.renderer.shadowMap.enabled = true;
        // // this.renderer.shadowMap.type = THREE.VSMShadowMap
        // this.renderer.shadowMap.soft = true;
        // this.renderer.shadowMap.needsUpdate = true;
        // this.renderer.gammaFactor = 10;
        // // if(SPLINT.ViewPort.getSize() == "mobile-small"){
        // //     this.renderer.setPixelRatio( window.devicePixelRatio * 0.6);
        // // } else {
        // //     this.renderer.setPixelRatio( window.devicePixelRatio * 2);
        // // }
        // // this.renderer.setSize( this.canvas.parentNode.clientWidth, this.canvas.parentNode.clientHeight, true);

        // this.renderer.gammaOutput = true;
        // this.renderer.gammaInput = true;
        // this.renderer.antialias = true;
        // this.renderer.alpha = true;
        // this.renderer.physicallyCorrectLights = true;
        // this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        // this.renderer.outputEncoding = 3001;
        // this.renderer.toneMappingExposure = 1;
        // this.renderer.setClearColor(0x000000, 0);
        // this.renderer.powerPreference = "high-performance";
        // this.renderer.autoClear = true;
        console.dir("initRenderer_ThreeRender");

    }
    static async startRenderer(){
        console.dir("startRenderer_ThreeRender");

    }
    static animate(){
        this.transferBack();
        requestAnimationFrame(this.animate.bind(this));
    }
}
self.addEventListener("message", async function(e) {ThreeRenderWorker.onMessage(e) });
// self.onmessage = function (e){
//     console.dir(e)
//     if(e.data.msg == "init"){
//     offscreencanvas = e.data.canvas; 
//     context_off = offscreencanvas.getContext("2d");
//     console.dir("init")
//     loop();

//     }
// }
// async function loop(){
//     const bitmap = offscreencanvas.transferToImageBitmap();
//     self.postMessage({msg : "render", bitmap } )
//     requestAnimationFrame(loop);
// }

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