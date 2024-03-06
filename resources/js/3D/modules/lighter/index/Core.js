
// import { Fog } from "@THREE_ROOT_DIR/src/scenes/Fog.js";
// import { PerspectiveCamera } from "@THREE_ROOT_DIR/src/cameras/PerspectiveCamera.js";
// import { Color } from "@THREE_ROOT_DIR/src/math/Color.js";
import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import * as MATERIALS from '../../assets/materials/materials.js';
import MaterialsLighterGeneral from '../../assets/newMaterials/materialsLighterGeneral.js';
import LIGHT from './light.js';
import CompressedAnimations from './animations.js';
import LighterAnimations from '../animations.js';
import SETUP from '../setup.js';
import MODEL from '../model.js';
import { CubeCamera } from "@THREE_ROOT_DIR/src/cameras/CubeCamera.js";
import Communication from './communication.js';
import { PerspectiveCamera } from "@THREE_ROOT_DIR/src/cameras/PerspectiveCamera.js";
import { Fog } from "@THREE_ROOT_DIR/src/scenes/Fog.js";
import { Color } from "@THREE_ROOT_DIR/src/math/Color.js";
import { MeshLambertMaterial } from "@THREE_ROOT_DIR/src/materials/MeshLambertMaterial.js";
import { CubeTextureLoader } from "@THREE_ROOT_DIR/src/loaders/CubeTextureLoader.js";
import { WebGLCubeRenderTarget } from "@THREE_ROOT_DIR/src/renderers/WebGLCubeRenderTarget.js";
import Stats from "@THREE_ROOT_DIR/examples/jsm/libs/stats.module.js";

import { PMREMGenerator } from "@THREE_ROOT_DIR/src/extras/PMREMGenerator.js";
import SPLINT from 'SPLINT';
import MaterialHelper from "@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js";
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
                    MODEL._rotate(this.setup.getLighterGroupe(this.scene), 0, 0, this.mouseHandler.dX);
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
            // this.renderer.setPixelRatio( Math.min(2, window.devicePixelRatio));
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
        SPLINT.Events.onLoadingComplete.dispatch();
        this.setup.renderer(true);
        this.setup.scene();
        // this.scene.fog = new Fog(0xffffff, 1, 1.1);
        this.mouseHandler = SPLINT.MouseHandler( this.canvas );
        this.Animations = new LighterAnimations(this);
        this.compressedAnimations = new CompressedAnimations(this);
        this.setupCamera();
        this.raycaster = SPLINT.raycaster(this);
        this.raycaster2 = SPLINT.raycaster(this);
        // this.setup.controls();
        // Stats
        // console.dir(Stats)
        // this.stats = new Stats();
		// 		document.body.appendChild( this.stats.dom );
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
                SPLINT.ResourceManager.textures.lighter_engraving_thumbnail.then(async function(texture){        
                    SPLINT.ResourceManager.textures.ligher_NormalMapEngraving.then(async function(texture1){               
                        MODEL.getThumbnail(this.setup.getLighterGroupe(this.scene, name), this, texture, texture1, "gold", 0xe8b000, !GoldFlag);
                    }.bind(this));      
                }.bind(this))     
            } else{
                SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_chrome.then(async function(texture){         
                    SPLINT.ResourceManager.textures.ligher_NormalMapEngraving.then(async function(texture1){ 
                        MODEL.getThumbnail(this.setup.getLighterGroupe(this.scene, name), this, texture, texture1, "chrome", 0xc0c0c0, GoldFlag);
                    }.bind(this));      
                }.bind(this));   
            }

        }
    }
    async onFinishLoading(){
        this.scene.traverse(function(object) {
            if(object.type === 'Mesh') {
                if(object.material.name == "chrome"){
                    // object.material = MaterialsLighterGeneral.chrome1(this);
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

        SPLINT.Utils.sleep(1000).then(function() {
            if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){

            } else {
                this.compressedAnimations.flameIgnite(function(){}, 1000);
                this.compressedAnimations.wheel(0.5, 500);
                this.compressedAnimations.open();
                // this.compressedAnimations.smoothTurnStart();
            }
        }.bind(this));
        // SPLINT.GUI.hide();
        // SPLINT.GUI.loadObj(this.camera).onChange(function(){
        //     this.camera.updateProjectionMatrix();
        // }.bind(this));
        // SPLINT.GUI.show();
    }
    light(){
        LIGHT(this.scene);
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
                
        let t1 = (await SPLINT.ResourceManager.dataTextures.indexBackground);
        // let clone = t1.SPLINT.ThreeClone();
            t1.mapping = THC.EquirectangularRefractionMapping;
        this.scene.background = t1;
        this.scene.enviroment = t1;

        this.cubeRenderTarget = new WebGLCubeRenderTarget( 256 );
        this.cubeRenderTarget.texture.type = THC.HalfFloatType;
        this.cubeCamera = new CubeCamera( 1, 200, this.cubeRenderTarget );
        

        // this.pmremGenerator = new PMREMGenerator(this.renderer);
        // this.envMap = this.pmremGenerator.fromScene(this.scene).texture;
        this.materials.chrome = MaterialsLighterGeneral.chrome(this);
        this.materials.chrome.needsUpdate = true;

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
            this.drawBackground();
            this.light();
            this.scene.add( this.camera );
        return new Promise(async function(resolve){
            await MODEL.init(this, "lighter", true, false);
            await MODEL.init(this, "lighter2", false, false);
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
            this.onFinishLoading();
            this.loadThumbnail("lighter2", false);
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
