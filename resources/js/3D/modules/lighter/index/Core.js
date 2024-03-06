
import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import * as MATERIALS from '../../assets/materials/materials.js';
import MaterialsLighterGeneral from '../../assets/newMaterials/materialsLighterGeneral.js';
import LIGHT from './light.js';
import CompressedAnimations from './animations.js';
import LighterAnimations from '../animations.js';
import SETUP from '../setup.js';
import LighterModel from "../model/LighterModel.js";
import { CubeCamera } from "@THREE_ROOT_DIR/src/cameras/CubeCamera.js";
import Communication from './communication.js';
import { PerspectiveCamera } from "@THREE_ROOT_DIR/src/cameras/PerspectiveCamera.js";
import { WebGLCubeRenderTarget } from "@THREE_ROOT_DIR/src/renderers/WebGLCubeRenderTarget.js";
import LighterThumbnail from "../model/LighterThumbnail.js";
import SPLINT from 'SPLINT';
import workerInterface from "../../assets/workerInterface.js";

export class draw {
    static get(canvas){
        return new draw(canvas);
    }
    constructor(canvas){
        this.context = null;
        this.id = "Lighter3D_";
        this.canvas = canvas;
        this.setup = new SETUP(this);
        this.animationTime = 0;
        this.debuggMode = false;
        this.materials = new Object();
        this.thumbnail = new Object();
        this.startLoading();
    }
    async startLoading(){
        this.lighterModel_1 = new LighterModel(this, "lighter");
        this.lighterModel_1.withFlame = true;
        this.lighterModel_2 = new LighterModel(this, "lighter2");
        this.init();
        this.events();
        this.draw();
        this.mouseHandler.onMove = async function(event){
            if(this.debuggMode){
                return
            }
            if(!this.raycaster2.doesHover){
                this.canvas.style.cursor = "default";
            }
            if(this.mouseHandler.mouseDown){
                if(this.raycaster2.mouseDownFlag){
                    this.lighterModel_1.rotate(0, 0, this.mouseHandler.dX);
                }
            } else {
            }
        }.bind(this);

    }
    onResize(){
        let a = this.canvas.parentNode.clientWidth;
        let b = this.canvas.parentNode.clientHeight;
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            this.canvas.width = a *2;
            this.canvas.height = b *2;
        } else {
            this.canvas.width = a * 2;
            this.canvas.height = b * 2;
        }
        this.canvas.style.width = a + "px";
        this.canvas.style.height = b + "px";
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            this.renderer.setPixelRatio( window.devicePixelRatio * 0.6);
        } else {
            this.renderer.setPixelRatio( window.devicePixelRatio * 2);
        }
        this.renderer.setSize( this.canvas.parentNode.clientWidth, this.canvas.parentNode.clientHeight, false);
        this.camera.aspect = this.canvas.parentNode.clientWidth / this.canvas.parentNode.clientHeight;
        this.camera.updateProjectionMatrix();
        this.render();
    }
    init(){
        this.setup.renderer(true);
        this.setup.scene();
        this.mouseHandler = SPLINT.MouseHandler( this.canvas );
        this.Animations = new LighterAnimations(this);
        this.compressedAnimations = new CompressedAnimations(this);
        this.setupCamera();
        this.raycaster = SPLINT.raycaster(this);
        this.raycaster2 = SPLINT.raycaster(this);
    }
    setupCamera(){
        if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
            this.camera     = new PerspectiveCamera(60, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 200);
            this.camera.position.set(0, 0.18, 0.7);
        } else {
            this.camera     = new PerspectiveCamera(45, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 200);
            this.camera.position.set(-0.15, 0.18, 1);
        }
        this.camera.name = "camera";
        this.camera.rotation.set(-0.05, 0, 0);
        this.camera.zoom = 1.2;
        this.camera.filmGauge = 20;
        // this.camera.focus = 1;
        // this.camera.filmOffset = 122;
        this.camera.positionBase = this.camera.position.clone();
        this.camera.FOVBase = this.camera.fov;
        this.camera.updateProjectionMatrix();
    }
    async loadThumbnail(name, GoldFlag){
        if(this.scene != null){
            if(GoldFlag){
                SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_1024.then(async function(texture){     
                    this.thumbnail.lighter1 = new LighterThumbnail(this, "lighter");   
                    this.thumbnail.lighter1.loadThumbnailMaterial(texture, 0xe8b000);
                }.bind(this))     
            } else{
                SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_1024.then(async function(texture){         
                    this.thumbnail.lighter2 = new LighterThumbnail(this, "lighter2");   
                    this.thumbnail.lighter2.loadThumbnailMaterial(texture, 0xc0c0c0, false);
                }.bind(this));   
            }

        }
    }
    async onFinishLoading(){
        this.scene.traverse(function(object) {
            if(object.type === 'Mesh') {
                if(object.material.name == "chrome"){
                    object.material = MaterialsLighterGeneral.chrome(this);
                } else if(object.material.name == "body"){
                    // object.material = MaterialsLighterGeneral.bodyColor(this, 0x006800);
                    object.material.needsUpdate = true
                } else if(object.material.name == "wheelStd") {
                    object.material = MaterialsLighterGeneral.wheel(this, object.material);
                    object.material.needsUpdate = true
                }
            };
        }.bind(this));
        this.startAnimationLoop();
        this.compressedAnimations.isOpen = true;
        this.compressedAnimations.close(0);
        this.setupRaycaster();
        this.setupRaycaster2();

        SPLINT.Utils.sleep(1000).then(async function() {
            if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){

            } else {
                this.compressedAnimations.flameIgnite(function(){}, 1000);
                this.compressedAnimations.wheel(0.5, 500);
                this.compressedAnimations.open();
                // this.compressedAnimations.smoothTurnStart();
            }
            workerInterface.createNormalMap(SPLINT.config.URIs.project + "../" + SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_1024_path).then(async function(texture){
                console.log("load")

                // let t = await SPLINT.Tools.CanvasTools.ImageData2base64(texture.source.data);
                // console.log(t);
                this.thumbnail.lighter1.loadNormalMap(texture)
                this.thumbnail.lighter1.loadNormalMap(texture)
            }.bind(this))
            
                let worker = new Worker(SPLINT.projectRootPath + "/js/_WebWorker/SVGGeneratorWorker.js") 
                    worker.onmessage = async function(e) {
                        console.log(e.data)    
                    }
            SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_1024.then(async function(texture){
                    console.dir(texture.source.data)
                    let img  =new Image();
                        img.onload = function(){
                            let imageData = SPLINT.Tools.CanvasTools.imageToImageData(img);
                            console.dir(imageData)
                            worker.postMessage(imageData);
                        }
                        img.src = SPLINT.config.URIs.project + "../" + SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_chrome_path;
                    

            })
            // SPLINT.ResourceManager.textures.ligher_NormalMapEngraving.then(async function(texture){ 
            //     // this.thumbnail.lighter1.loadEnvMap(this.cubeRenderTarget.texture);
            //     this.thumbnail.lighter1.loadNormalMap(texture);
            //     // this.thumbnail.lighter2.loadEnvMap(this.cubeRenderTarget.texture);
            //     // this.thumbnail.lighter2.loadNormalMap(texture);
            // }.bind(this));
            
        // console.log(SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_1024_data)
        }.bind(this));
    }

    animate(){}
    startAnimationLoop(){
        this.renderer.setAnimationLoop( async function(){
            this.render();
            this.AnimationMixer.tick();
         }.bind(this));
    }
    render(){
        this.cubeCamera.update(this.renderer, this.scene);
        this.renderer.render(this.scene, this.camera);
        this.context.clearRect(0, 0, this.canvas.parentNode.clientWidth*2, this.canvas.parentNode.clientHeight*2);
        let domE = this.renderer.domElement;
        this.context.drawImage(domE, 0, 0, domE.width, domE.height, 0, 0, this.canvas.width, this.canvas.height);
        // this.stats.update();
    }
    async drawBackground(){
        
        SPLINT.ResourceManager.dataTextures.indexBackground.then(function(texture){
            // let t1 = (await SPLINT.ResourceManager.dataTextures.indexBackground);
            // let clone = t1.SPLINT.ThreeClone();
                texture.mapping = THC.EquirectangularRefractionMapping;
                // texture.mapping = THC.CubeReflectionMapping;
            this.scene.background = texture;
            this.scene.enviroment = texture;
        }.bind(this))

        this.cubeRenderTarget = new WebGLCubeRenderTarget( 256 );
        this.cubeRenderTarget.texture.type = THC.HalfFloatType;
        this.cubeCamera = new CubeCamera( 1, 200, this.cubeRenderTarget );
        

        // this.pmremGenerator = new PMREMGenerator(this.renderer);
        // this.envMap = this.pmremGenerator.fromScene(this.scene).texture;

        // this.scene.enviroment = envMap;
        // this.scene.background = new Color( 0xffffff);
        let floor1         = await SPLINT.ResourceManager.textures.floor_1;
        let floor1Normal   = await SPLINT.ResourceManager.textures.floor_1_normalMap;
        let plane = SPLINT.object.Plane(5, 5, 1, 1);
            plane.get().geometry.translate(0, -1, 0);
            plane.rotate(87, 0, 0);
            plane.plane.material = await MATERIALS.other.indexBackground(floor1, floor1Normal, this.cubeRenderTarget.texture);
            plane.plane.receiveShadow = true;
        this.scene.add(plane.plane);
    }    
    async draw(){
            await this.drawBackground();
            LIGHT(this.scene);
            this.scene.add( this.camera );
        return new Promise(async function(resolve){
            await this.lighterModel_1.init();
            await this.lighterModel_2.init();
            // await MODEL.init(this, "lighter", true, false);
            // await MODEL.init(this, "lighter2", false, false);
            let lighterGroupe1 = this.setup.getLighterGroupe(this.scene);
                lighterGroupe1.rotation.z = 0.2618;
                lighterGroupe1.rotationBase = lighterGroupe1.rotation.clone();
                this.loadThumbnail("lighter", true);
                resolve('resolved');

            let lighterGroupe2 = this.setup.getLighterGroupe(this.scene, 'lighter2');
                lighterGroupe2.rotation.z = 10 * (Math.PI / 180);
                lighterGroupe2.position.x = -5;
                lighterGroupe2.position.z = -0.17;
                lighterGroupe2.children[14].rotation.y = (-106.5 +  1) * Math.PI / 180;
                lighterGroupe2.children[0].children[0].rotation.z = (-133.7648) * Math.PI / 180;
                lighterGroupe2.rotationBase = lighterGroupe2.rotation.clone();
            this.loadThumbnail("lighter2", false);
            this.onFinishLoading();
        }.bind(this));
    }
    events(){
        this.communication = new Communication(this);
    }
    setupRaycaster(){
        let groupe = this.setup.getLighterGroupe();
        this.raycaster.setScene(groupe);
        this.raycaster.addObject("oberes_teil1");
        this.raycaster.addObject("unteres_teil1");
        this.raycaster.addObject("Innenleben11");
        this.raycaster.addObject("Rad1");
        this.raycaster.onMouseClick = function(element, name){
            if(this.mouseHandler.hasMoved){
                return;
            }
            switch(name){
                case "oberes_teil1" : {
                    // if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
                    //     let translation = new THREE.Vector3(-0.08, -0.15, -3);
                    //     this.compressedAnimations.toggleCameraTo(0.3, 0, translation, true);
                    //     this.compressedAnimations.toggleCameraToFOV(0.3, 0, 40, true);
                    //     let rot = new THREE.Vector3(0, 0, 10);
                    //     this.compressedAnimations.toggleLighterRotate(0.3, 0, rot, true);
                    // }
                    this.compressedAnimations.wheel(0.5);
                    this.compressedAnimations.toggleOpen();
                } break;
                case "unteres_teil1" : {
                    this.compressedAnimations.wheel(0.5);
                    this.compressedAnimations.toggleOpen();
                } break;
                case "Innenleben11" : {
                    this.compressedAnimations.toggleFlame();
                } break;
                case "Rad1" : {
                    this.compressedAnimations.flameIgnite(function(){}, 500);
                    this.compressedAnimations.wheel(0.5);
                } break;
            }
        }.bind(this);
    }
    setupRaycaster2(){
        let groupe = this.setup.getLighterGroupe();
        this.raycaster2.setScene(groupe);
        for(const child of groupe.children){
            this.raycaster2.addObject(child);
        }
        this.raycaster2.onMouseMove = function(){
            this.canvas.style.cursor = "pointer";
        }.bind(this);
        this.raycaster2.onMouseDown = function(){
        }
        this.raycaster2.onMouseUp = function(){
        }
    }
}




// initWorker(){
//     // let g1 = SPLINT.file.loadFromProjectAsync();
//     // console.dir(SPLINT.config.URIs.project + "/" + SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_1024_data)
//     let worker = new Worker(SPLINT.projectRootPath + "/js/_WebWorker/normalMapWorker.js", { type: "module"});
    
//     worker.onmessage = async function(e) {
//         console.log(e)
//         let bmp = e.data;//await blobToBase64(e.data);
        
//         let t = new Texture(bmp);
//         t.needsUpdate = true;
//         // let g = S_Tools.base64ToSrc(bmp)
//         this.thumbnail.lighter1.loadNormalMap(t);
//         // this.thumbnail.lighter1.loadThumbnailMaterial(t, 0xe8b000);
//         console.log(t)
//     }.bind(this);
// //     worker.onerror = function(e) {
// //         console.log(e)
// //     }.bind(this);

//     // SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_1024_data.then(async function(texture){     
//         worker.postMessage(SPLINT.config.URIs.project + "/" + SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_1024_data);
//         console.log("post")
//     // }.bind(this))  
// }

// // startup();
//     var input, output, ctx_i, ctx_o, w, h;

//     function startup() {
//         var img;

//         input = document.createElement("canvas");
//         ctx_i = input.getContext("2d", { willReadFrequently: true});
//         ctx_i.clearRect(0, 0,input.width, input.height);

//         img = new Image();
//         img.crossOrigin = "Anonymous";

        
//         SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_1024.then(async function(texture){     
//             console.dir(texture)
//             img.src = texture.source.data.src;
//             // let r = startup(texture);
//             // console.log(r);
//         }.bind(this))  

//         //img.src = "https://i.imgur.com/a4N2Aj4.jpg"; //128x128 - Tiny but fast.
//         // img.src = "https://i.imgur.com/wFe4EG7.jpg"; //256x256 - Takes about a minute.
//         //img.src = "https://i.imgur.com/bm4pXrn.jpg"; //512x512 - May take 5 or 10 minutes.
//         // img.src = "https://i.imgur.com/aUIdxHH.jpg"; //original - Don't do it! It'll take hours.
//         img.onload = async function () {
//             w = img.width - 1;
//             h = img.height - 1;
//             input.width = w + 1;
//             input.height = h + 1;
//             ctx_i.drawImage(img, 0, 0);

//             output = document.createElement("canvas");
//             ctx_o = output.getContext("2d");
//             output.width = w + 1;
//             output.height = h + 1;
//             totallyNormal();
//             let f = await output.toDataURL("image/png", 1);
//             console.log(f);
//         };
//     }

//     function totallyNormal() {
//         var pixel, x_vector, y_vector;

//         for (var y = 0; y < w + 1; y += 1) {
//             for (var x = 0; x < h + 1; x += 1) {
//                 var data = 
//                 [
//                     0, 0, 0, 0,
//                     x > 0, x < w, y > 1, y < h, 
//                     x - 1, x + 1, x, x, 
//                     y, y, y - 1, y + 1
//                 ];
//                 for (var z = 0; z < 4; z +=1) {
//                     if (data[z + 4]) {
//                         pixel = ctx_i.getImageData(data[z + 8], data[z + 12], 1, 1);
//                         data[z] = ((0.299 * (pixel.data[0] / 100)) + (0.587 * (pixel.data[1] / 100)) + (0.114 * (pixel.data[2] / 100)) / 3);
//                     } else {
//                         pixel = ctx_i.getImageData(x, y, 1, 1);
//                         data[z] = ((0.299 * (pixel.data[0] / 100)) + (0.587 * (pixel.data[1] / 100)) + (0.114 * (pixel.data[2] / 100)) / 3);
//                     }
//                 }
//                 x_vector = parseFloat((Math.abs(data[0] - data[1]) + 1) * 0.5) * 255;
//                 y_vector = parseFloat((Math.abs(data[2] - data[3]) + 1) * 0.5) * 255;
//                 ctx_o.fillStyle = "rgba(" + x_vector + "," + y_vector + ",255,255)";
//                 ctx_o.fillRect(x, y, 1, 1);
//             }
//         }
//         console.log("finisehd");
//     }

// async function startup(texture) {
//     return new Promise(async function(resolve){
//     let input, output, ctx_i, ctx_o, w, h;
//     let img;
//     img = texture.source.data;//new Image();//MaterialHelper.getTexture(SPLINT.resources.textures.lighter_engraving_thumbnail).source.data;;
//     img.crossOrigin = "Anonymous";
//     //img.src = "https://i.imgur.com/a4N2Aj4.jpg"; //128x128 - Tiny but fast.
//     // img.src = "http://localhost/fd/data/3Dmodels/Lighter/textures/thumbnail.png"; //256x256 - Takes about a minute.
//     input = document.createElement("canvas");

//     //img.src = "https://i.imgur.com/bm4pXrn.jpg"; //512x512 - May take 5 or 10 minutes.
//     //img.src = "https://i.imgur.com/aUIdxHH.jpg"; //original - Don't do it! It'll take hours.
//     // img.onload = function () {
//         ctx_i = input.getContext("2d");
//         ctx_i.fillStyle = "#000000";
//         ctx_i.fillRect(0, 0, input.width, input.height);
//         if(img.height > img.width){
//             w = img.height;
//             h = img.height;
//         } else { 
//             w = img.width;
//             h = img.width;
//         }
//         w = (w) - 1;
//         h = (h) - 1;
//         input.width = w + 1;
//         input.height = h + 1;
//         ctx_i.save();
//         ctx_i.imageSmoothingEnabled = true;
//         ctx_i.imageSmoothingQuality  = "high";
//         ctx_i.globalAlpha = 0.5;
//         ctx_i.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
//         ctx_i.restore();
//         // ctx_i.scale(0.25, 0.25)
//         output = document.createElement("canvas");
//         ctx_o = output.getContext("2d");
//         output.width = w + 1;
//         output.height = h + 1;
//         await totallyNormal();

        
//         let img;

//         let input = document.createElement("canvas");
//         let ctx_i = input.getContext("2d");
//             ctx_i.clearRect(0, 0,input.width, input.height);

//         img = new Image();
//         img.crossOrigin = "Anonymous";
//         //img.src = "https://i.imgur.com/a4N2Aj4.jpg"; //128x128 - Tiny but fast.
//         img.src = "https://i.imgur.com/wFe4EG7.jpg"; //256x256 - Takes about a minute.
//         //img.src = "https://i.imgur.com/bm4pXrn.jpg"; //512x512 - May take 5 or 10 minutes.
//         //img.src = "https://i.imgur.com/aUIdxHH.jpg"; //original - Don't do it! It'll take hours.
//         img.onload = function () {
//             w = img.width - 1;
//             h = img.height - 1;
//             input.width = w + 1;
//             input.height = h + 1;
//             ctx_i.drawImage(img, 0, 0);

//             output = document.getElementById("output");
//             ctx_o = output.getContext("2d");
//             output.width = w + 1;
//             output.height = h + 1;
//         };













//         // input.width = img.width;
//         // input.height = img.height;
//         // ctx_i.clearRect(0, 0,input.width, input.height);
//         // ctx_i.drawImage(output, 0, 0, w*4, h*4);
//         // let im = new Image();
//         //     im.src = await output.toDataURL("image/png", 1);
//         //     im.onload = function(){
//             let e = await output.toDataURL("image/png", 1);
//             console.log(e)
//                 let im = new Image();
//                     let t = new Texture();
//                         t.image = im;
//                     im.onload = function(){
//                         t.needsUpdate = true;
//                         resolve(t);
//                     }
//                     im.src = e;

//             // }
//             async function totallyNormal() {
//                 let pixel, x_vector, y_vector;
            
//                 for (let y = 0; y < w + 1; y += 1) {
//                   for (let x = 0; x < h + 1; x += 1) {
//                     let data = [0, 0, 0, 0, x > 0, x < w, y > 1, y < h, x - 1, x + 1, x, x, y, y, y - 1, y + 1];
//                     for (let z = 0; z < 4; z +=1) {
//                       if (data[z + 4]) {
//                         pixel = ctx_i.getImageData(data[z + 8], data[z + 12], 1, 1);
//                         data[z] = ((0.299 * (pixel.data[0] / 100)) + (0.587 * (pixel.data[1] / 100)) + (0.114 * (pixel.data[2] / 100)) / 3);
//                       } else {
//                         pixel = ctx_i.getImageData(x, y, 1, 1);
//                         data[z] = ((0.299 * (pixel.data[0] / 100)) + (0.587 * (pixel.data[1] / 100)) + (0.114 * (pixel.data[2] / 100)) / 3);
//                       }
//                     }
//                     x_vector = parseFloat((Math.abs(data[0] - data[1]) + 1) * 0.5) * 255;
//                     y_vector = parseFloat((Math.abs(data[2] - data[3]) + 1) * 0.5) * 255;
//                     ctx_o.fillStyle = "rgba(" + x_vector + "," + y_vector + ",255,255)";
//                     ctx_o.fillRect(x, y, 1, 1);
//                   }
//                 }
//                 return true;
//             }
            
//     });
//     // };
// }

