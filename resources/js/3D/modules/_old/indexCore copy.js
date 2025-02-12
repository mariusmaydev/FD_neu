
// import * as MATERIALS from '../../assets/materials/materials.js';
// import MaterialsLighterGeneral from '../../assets/newMaterials/materialsLighterGeneral.js';
// import LIGHT from './light.js';
// import CompressedAnimations from './animations.js';
// import LighterAnimations from '../animations.js';
// import SETUP from '../setup.js';
// import LighterModel from "../model/LighterModel.js";
// // import { CubeCamera } from "@THREE_SRC/cameras/CubeCamera.js";
// import Communication from './communication.js';
// // import { WebGLCubeRenderTarget } from "@THREE_ROOT_DIR/src/renderers/WebGLCubeRenderTarget.js";
// import * as THREE from "@THREE";
// import LighterThumbnail from "../model/LighterThumbnail.js";
// import SPLINT from 'SPLINT';
// import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';
// import workerInterfaceNew from "../../assets/workerInterfaceNew.js";

// SPLINT.BinaryImage

// export class draw {
//     static get(canvas){
//         return new draw(canvas);
//     }
//     constructor(canvas){
//         this.StorageManager = new SPLINT.IndexedDB.Manager("StaticData", true)
//         this.renderWorker = new Worker(location.origin + "/fd/resources/js/_WebWorker/_module/_ThreeJSWorkerLoader.js", 
//         { 
//             // type : 'module',
//             name : 'ThreeRenderWorker_index' 
//         });
//         let importmap = document.querySelector('script[type="importmap"]');
//         console.dir(importmap)
//         this.renderWorker.postMessage({msg: "initLoader", importMap: importmap.textContent});
//         setTimeout(async function(){
//         this.renderWorker.postMessage("test")
//         }.bind(this), 5000);
//         //SPLINT.Worker.WebWorker("/js/3D/modules/lighter/index/_indexRenderWorker.js", false, false);
//         // this.renderWorker.options = {
//         //     type: "module"
//         // }
//         this.renderWorker.onerror = function(){
//             console.dir(arguments)
//         }
//         // this.renderWorker.init();
//         console.dir(this.renderWorker)
//         this.context = null;
//         this.id = "Lighter3D_";
//         this.canvas = canvas;
//         this.setup = new SETUP(this);
//         this.animationTime = 0;
//         this.debuggMode = false;
//         this.materials = new Object();
//         this.thumbnail = new Object();
//         this.startLoading();
//     }
//     async startLoading(){
//         this.lighterModel_1 = new LighterModel(this, "lighter");
//         this.lighterModel_1.withFlame = true;
//         this.lighterModel_2 = new LighterModel(this, "lighter2");
//         this.init();
//         this.events();
//         this.draw();
//         this.mouseHandler.onMove = async function(event){
//             if(this.debuggMode){
//                 return
//             }
//             if(!this.raycaster2.doesHover){
//                 this.canvas.style.cursor = "default";
//             }
//             if(this.mouseHandler.mouseDown){
//                 if(this.raycaster2.mouseDownFlag){
//                     this.lighterModel_1.rotate(0, 0, this.mouseHandler.dX);
//                 }
//             } else {
//             }
//         }.bind(this);

//     }
//     onResize(){
//         let a = this.canvas.parentNode.clientWidth;
//         let b = this.canvas.parentNode.clientHeight;
//         if(SPLINT.ViewPort.getSize() == "mobile-small"){
//             this.canvas.width = a *2;
//             this.canvas.height = b *2;
//         } else {
//             this.canvas.width = a * 2;
//             this.canvas.height = b * 2;
//         }
//         this.canvas.style.width = a + "px";
//         this.canvas.style.height = b + "px";
//         if(SPLINT.ViewPort.getSize() == "mobile-small"){
//             this.renderer.setPixelRatio( window.devicePixelRatio * 0.6);
//         } else {
//             this.renderer.setPixelRatio( window.devicePixelRatio * 2);
//         }
//         this.renderer.setSize( this.canvas.parentNode.clientWidth, this.canvas.parentNode.clientHeight, false);
//         this.camera.aspect = this.canvas.parentNode.clientWidth / this.canvas.parentNode.clientHeight;
//         this.camera.updateProjectionMatrix();
//         this.render();
//     }
//     init(){
//         this.setup.renderer(true);
//         this.setupOffscreen();
//         this.setup.scene();
//         this.mouseHandler = SPLINT.MouseHandler( this.canvas );
//         this.Animations = new LighterAnimations(this);
//         this.compressedAnimations = new CompressedAnimations(this);
//         this.setupCamera();
//         this.raycaster = SPLINT.raycaster(this);
//         this.raycaster2 = SPLINT.raycaster(this);
//         // this.setupOffscreen();
//         // this.setup.controls();
//     }
//     setupCamera(){
//         if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
//             this.camera     = new THREE.PerspectiveCamera(60, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 200);
//             this.camera.position.set(0, 0.18, 0.7);
//         } else {
//             this.camera     = new THREE.PerspectiveCamera(45, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 200);
//             this.camera.position.set(-0.15, 0.18, 1);
//         }
//         this.camera.name = "camera";
//         this.camera.rotation.set(-0.05, 0, 0);
//         this.camera.zoom = 1.2;
//         this.camera.filmGauge = 20;
//         // this.camera.focus = 1;
//         // this.camera.filmOffset = 122;
//         this.camera.positionBase = this.camera.position.clone();
//         this.camera.FOVBase = this.camera.fov;
//         this.camera.updateProjectionMatrix();
//     }
//     async loadThumbnail(name, GoldFlag){
//         if(this.scene != null){
//             let binaryImg = await this.StorageManager.get("ThumbnailIndex");
//             if(binaryImg == undefined){
//                 binaryImg = await SPLINT.BinaryImage.fromURL(location.origin + "/fd/data/3Dmodels/Lighter/test/test.binImg");
//                 this.StorageManager.set("ThumbnailIndex", binaryImg);
//             }
//             if(GoldFlag){
//                 let bb = await binaryImg.export_imageData();
//                 let texture = new THREE.Texture(bb);
//                 this.thumbnail.lighter1 = new LighterThumbnail(this, "lighter");   
//                 this.thumbnail.lighter1.loadThumbnailMaterial(texture, 0xe8b000, false);
//                 this.thumbnail.lighter1.loadAlphaMap(texture);
//             } else {      
//                 // let binaryImg = await SPLINT.BinaryImage.fromURL(location.origin + "/fd/data/3Dmodels/Lighter/test/test.binImg");
//                 let bb = await binaryImg.export_imageData();
                
//                 let texture = new THREE.Texture(bb);
//                 this.thumbnail.lighter2 = new LighterThumbnail(this, "lighter2");   
//                 this.thumbnail.lighter2.loadThumbnailMaterial(texture, 0xc0c0c0, false);
//                 this.thumbnail.lighter1.loadAlphaMap(texture);
//             }
//         }
//     }

//     async onFinishLoading(){
//         this.scene.traverse(function(object) {
//             if(object.type === 'Mesh') {
//                 if(object.material.name == "chrome"){
//                     object.material = MaterialsLighterGeneral.chrome(this);
//                     object.material.needsUpdate = true;
//                 } else if(object.material.name == "body"){
//                     // object.material = MaterialsLighterGeneral.bodyColor(this, 0x006800);
//                     object.material.needsUpdate = true
//                 } else if(object.material.name == "wheelStd") {
//                     object.material = MaterialsLighterGeneral.wheel(this, object.material);
//                     object.material.needsUpdate = true
//                 }
//             };
//         }.bind(this));
//         // this.startAnimationLoop();
//         this.compressedAnimations.isOpen = true;
//         this.compressedAnimations.close(0);
//         this.setupRaycaster();
//         this.setupRaycaster2();

//         SPLINT.Utils.sleep(1000).then(async function() {
//             if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){

//             } else {
//                 this.compressedAnimations.flameIgnite(function(){}, 1000);
//                 this.compressedAnimations.wheel(0.5, 500);
//                 this.compressedAnimations.open();
//                 // this.compressedAnimations.smoothTurnStart();
//             }
            
//             let normalMapData = await this.StorageManager.get("ThumbnailIndex_normalMap");
            
//             if(normalMapData == undefined){
//                 let binaryImg = await this.StorageManager.get("ThumbnailIndex");
//                 if(binaryImg == undefined){
//                     binaryImg = await SPLINT.BinaryImage.fromURL(location.origin + "/fd/data/3Dmodels/Lighter/test/test.binImg");
//                     this.StorageManager.set("ThumbnailIndex", binaryImg);
//                 }
//                 let d = await binaryImg.export_imageData();
//                 workerInterfaceNew.createNormalMap(this.drawID, d).then(async function(imageData){
//                     this.StorageManager.set("ThumbnailIndex_normalMap", imageData);
//                     let texture = new THREE.Texture(imageData);
//                         texture.needsUpdate = true;

//                     this.thumbnail.lighter1.loadEnvMap(this.cubeRenderTarget.texture);
//                     this.thumbnail.lighter2.loadEnvMap(this.cubeRenderTarget.texture);
//                     this.thumbnail.lighter1.loadNormalMap(texture);
//                     this.thumbnail.lighter2.loadNormalMap(texture);
//                     this.thumbnail.lighter1.setColor(new THREE.Color(0xe8b000))
//                     this.render();
//                 }.bind(this));
//             } else {
//                 let texture = new THREE.Texture(normalMapData);
//                     texture.needsUpdate = true;
//                 // console.dir("b")
//                 this.thumbnail.lighter1.loadEnvMap(this.cubeRenderTarget.texture);
//                 this.thumbnail.lighter2.loadEnvMap(this.cubeRenderTarget.texture);

//                 this.thumbnail.lighter1.loadNormalMap(texture);
//                 this.thumbnail.lighter2.loadNormalMap(texture);
//                 this.thumbnail.lighter1.setColor(new THREE.Color(0xe8b000))
//                 this.render();
//             }
            
//         // console.log(SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_1024_data)
//         }.bind(this));
//     }

//     setupOffscreen(){
//         // return
//         this.context = this.canvas.getContext("bitmaprenderer");
//         this.offscreencanvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        

//         this.renderWorker.onmessage = function(e){
//             this.context.transferFromImageBitmap(e.data.bitmap);
//         }.bind(this)
//     }
//     async animate(){
//         // if(this.renderer.domElement.width > 0){
//             this.render();
//         // } else {
//         //     requestAnimationFrame(this.animate.bind(this));
//         // }
//     }
//     async render(){
//         // this.context_off.clearRect(0, 0, this.canvas.parentNode.clientWidth * 2, this.canvas.parentNode.clientHeight * 2);
//         // this.renderer.render(this.scene, this.camera);
//         // this.cubeCamera.update(this.renderer, this.scene);
//         // let domE = this.renderer.domElement;
//         // this.context_off.drawImage(domE, 0, 0, domE.width, domE.height, 0, 0, this.canvas.width, this.canvas.height);

//         this.context.transferFromImageBitmap(this.bitmap);
//     }

//     // animate(){}
//     startAnimationLoop(){
//         console.dir(this.offscreencanvas)
//         this.renderWorker.postMessage({msg: "init", canvas : this.offscreencanvas}, [this.offscreencanvas]);
//         // this.renderWorker.postMessage("test2");
//         // this.renderer.setAnimationLoop( async function(){
//         //     this.render();
//         //     this.AnimationMixer.tick();
//         //  }.bind(this));
//     }
//     // render(){
//     //     this.renderer.render(this.scene, this.camera);
//     //     this.cubeCamera.update(this.renderer, this.scene);
//     //     this.context.clearRect(0, 0, this.canvas.parentNode.clientWidth*2, this.canvas.parentNode.clientHeight*2);
//     //     let domE = this.renderer.domElement;
//     //     this.context.drawImage(domE, 0, 0, domE.width, domE.height, 0, 0, this.canvas.width, this.canvas.height);
//     //     // this.stats.update();
//     // }
//     async drawBackground(){
//         SPLINT.ResourceManager.dataTextures.indexBackground.then(async function(texture){
//             console.dir(texture)
//             // let t1 = (await SPLINT.ResourceManager.dataTextures.indexBackground);
//             // let clone = t1.SPLINT.ThreeClone();
//                 // texture.mapping = THREE.EquirectangularReflectionMapping;
//                 texture.mapping = THREE.CubeReflectionMapping;
//             this.scene.background = texture;
//             this.scene.enviroment = texture;
//         }.bind(this))

//         this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256,{ generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
//         this.cubeRenderTarget.texture.type = THREE.HalfFloatType;
//         this.cubeCamera = new THREE.CubeCamera( 1, 200, this.cubeRenderTarget );
//         this.scene.add( this.cubeCamera );
//         // this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
//         // this.envMap = this.pmremGenerator.fromScene(this.scene).texture;

//         // this.scene.enviroment = this.envMap;
//         // this.scene.background = this.envMap;//new THREE.Color( 0xffffff);
//         let floor1         = await SPLINT.ResourceManager.textures.floor_1;
//         let floor1Normal   = await SPLINT.ResourceManager.textures.floor_1_normalMap;
//         let plane = SPLINT.object.Plane(5, 5, 1, 1);
//             plane.get().geometry.translate(0, -1, 0);
//             plane.rotate(87, 0, 0);
//             plane.plane.material = await MATERIALS.other.indexBackground(floor1, floor1Normal);//, this.cubeRenderTarget.texture);
//             plane.plane.receiveShadow = true;
//         this.scene.add(plane.plane);
//     }    
//     async draw(){
//              this.drawBackground();
//             LIGHT(this.scene);
//             this.scene.add( this.camera );
//         return new Promise(async function(resolve){
//             await this.lighterModel_1.init();
//             await this.lighterModel_2.init();
//             // await MODEL.init(this, "lighter", true, false);
//             // await MODEL.init(this, "lighter2", false, false);
//             let lighterGroupe1 = this.setup.getLighterGroupe(this.scene);
//                 lighterGroupe1.rotation.z = 0.2618;
//                 lighterGroupe1.rotationBase = lighterGroupe1.rotation.clone();
//                 this.loadThumbnail("lighter", true);
//                 // resolve('resolved');

//             let lighterGroupe2 = this.setup.getLighterGroupe(this.scene, 'lighter2');
//                 lighterGroupe2.rotation.z = 10 * (Math.PI / 180);
//                 lighterGroupe2.position.x = -5;
//                 lighterGroupe2.position.z = -0.17;
//                 lighterGroupe2.children[14].rotation.y = (-106.5 +  1) * Math.PI / 180;
//                 lighterGroupe2.children[0].children[0].rotation.z = (-133.7648) * Math.PI / 180;
//                 lighterGroupe2.rotationBase = lighterGroupe2.rotation.clone();
//             this.loadThumbnail("lighter2", false);
//             this.startAnimationLoop();
//             this.onFinishLoading();
//         }.bind(this));
//     }
//     events(){
//         this.communication = new Communication(this);
//     }
//     setupRaycaster(){
//         let groupe = this.setup.getLighterGroupe();
//         this.raycaster.setScene(groupe);
//         this.raycaster.addObject("oberes_teil1");
//         this.raycaster.addObject("unteres_teil1");
//         this.raycaster.addObject("Innenleben11");
//         this.raycaster.addObject("Rad1");
//         this.raycaster.onMouseClick = function(element, name){
//             if(this.mouseHandler.hasMoved){
//                 return;
//             }
//             switch(name){
//                 case "oberes_teil1" : {
//                     // if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
//                     //     let translation = new THREE.Vector3(-0.08, -0.15, -3);
//                     //     this.compressedAnimations.toggleCameraTo(0.3, 0, translation, true);
//                     //     this.compressedAnimations.toggleCameraToFOV(0.3, 0, 40, true);
//                     //     let rot = new THREE.Vector3(0, 0, 10);
//                     //     this.compressedAnimations.toggleLighterRotate(0.3, 0, rot, true);
//                     // }
//                     this.compressedAnimations.wheel(0.5);
//                     this.compressedAnimations.toggleOpen();
//                 } break;
//                 case "unteres_teil1" : {
//                     this.compressedAnimations.wheel(0.5);
//                     this.compressedAnimations.toggleOpen();
//                 } break;
//                 case "Innenleben11" : {
//                     this.compressedAnimations.toggleFlame();
//                 } break;
//                 case "Rad1" : {
//                     this.compressedAnimations.flameIgnite(function(){}, 500);
//                     this.compressedAnimations.wheel(0.5);
//                 } break;
//             }
//         }.bind(this);
//     }
//     setupRaycaster2(){
//         let groupe = this.setup.getLighterGroupe();
//         this.raycaster2.setScene(groupe);
//         for(const child of groupe.children){
//             this.raycaster2.addObject(child);
//         }
//         this.raycaster2.onMouseMove = function(){
//             this.canvas.style.cursor = "pointer";
//         }.bind(this);
//         this.raycaster2.onMouseDown = function(){
//         }
//         this.raycaster2.onMouseUp = function(){
//         }
//     }
// }