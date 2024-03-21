
import SPLINT from 'SPLINT';
import * as MATERIALS from '../../assets/materials/materials.js';
import LIGHT from './light.js';
import * as THREE from "@THREE";
import CompressedAnimations from './animations.js';
import LighterAnimations from '../animations.js';
import SETUP from '../setup.js';
import Communication from './communication.js';
import MaterialsLighterGeneral from '../../assets/newMaterials/materialsLighterGeneral.js';

import LighterModel from '../model/LighterModel.js';
import MaterialHelper from '@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js';

export class draw {
    static get(canvas){
        return new draw(canvas);
    }
    constructor(canvas){
        this.id = "Lighter3D_";
        this.canvas = canvas;
        this.context = canvas.getContext("bitmaprenderer");
        this.setup = new SETUP(this);
        this.loaded = null;
        this.animationTime = 0;
        this.materials = new Object();
        this.lighterModel = new LighterModel(this);
            this.init();
            this.events();
            this.draw();

    }
    async changeColor(name, value = null){
        
        this.scene.traverse(function(object) {
            if(object.type === 'Mesh') {
                if(object.material.name == "chrome"){
                    // object.material = MaterialsLighterGeneral.chrome1(this);
                } else if(object.material.name.includes("body")){
                    if(name == "base"){
                        let mat = MaterialHelper.cloneMaterial(MaterialHelper.get("lighterBlackRough"));
                            mat.name = "bodyBase";
                        object.material = mat;
                    } else {
                        if(value != null){
                            object.material = MaterialsLighterGeneral.bodyColor(this, value);
                        } else {
                            object.material = MaterialsLighterGeneral.bodyColor(this, MaterialsLighterGeneral.BODY_COLOR_LIST[name]);
                        }
                    }
                    object.material.needsUpdate = true
                }
            };
        }.bind(this));
        this.render();
    }
    setupOffscreen(){
        this.context = this.canvas.getContext("bitmaprenderer");
        this.offscreencanvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
        this.context_off = this.offscreencanvas.getContext("2d");

    }
    async animate(){
        if(this.renderer.domElement.width > 0){
            this.render();
        } else {
            requestAnimationFrame(this.animate.bind(this));
        }
    }
    async render(){
        this.context_off.clearRect(0, 0, this.canvas.parentNode.clientWidth*2, this.canvas.parentNode.clientHeight*2);
        this.renderer.render(this.scene, this.camera);
        let domE = this.renderer.domElement;
        this.context_off.drawImage(domE, 0, 0, domE.width, domE.height, 0, 0, this.canvas.width, this.canvas.height);

        this.bitmap = this.offscreencanvas.transferToImageBitmap();
        this.context.transferFromImageBitmap(this.bitmap);
    }
    init(){
        
        // SPLINT.GUI.hide();
        this.setup.renderer(true);
        this.setup.scene();
        this.Animations = new LighterAnimations(this);
        this.compressedAnimations = new CompressedAnimations(this);
        this.setupCamera();
    }
    remove(){
        // console.dir(window)
        this.onResize = function(){};
        this.AnimationMixer.stop();
        // this.clear();
        // THREE.Object3D
        this.renderer.renderLists.dispose()
        this.renderer.forceContextLoss();
        this.scene = null;

    }
    setupCamera(){
        this.camera     = new THREE.PerspectiveCamera(24, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.1, 100);
        this.camera.position.set(0, 0.135, 0.97);
        // this.camera.zoom = 1.1;
        this.camera.updateProjectionMatrix();
    }
    drawThumbnail(){
        // MODEL.getThumbnail(this.setup.getLighterGroupe(this.scene, name), this, SPLINT.resources.textures.lighter_engraving_thumbnail, "gold", 0xe8b000, !GoldFlag);
    }
    async loadThumbnail(name, GoldFlag){}
    async onFinishLoading(){
        this.setupOffscreen();
        // this.Animations.lever_close.start(true, 0);
        // this.Animations.lighter_close.start(false, 0);
        this.animate();
        SPLINT.Events.onLoadingComplete.dispatch()
        this.canvas.parentElement.parentElement.parentElement.setAttribute("loaded", true);
        this.canvas.setAttribute("loaded", true);

        this.canvas.Storage = new Object();
        this.canvas.Storage.type = "loaded";
        this.canvas.Storage.value = "value";

        this.canvas.dispatchEvent(SPLINT_EVENTS.toCommonJS);
    }
    async drawBackground(){
        
        // let t1 = await SPLINT.ResourceManager.dataTextures.indexBackground;
        // t1.mapping = THC.EquirectangularReflectionMapping;
        // console.log(t1);
        
        // this.scene.background = t1;
        // this.scene.enviroment = t1;


        // this.cubeRenderTarget = new WebGLCubeRenderTarget( 256 );
        // this.cubeRenderTarget.texture.type = THC.HalfFloatType;
        // this.cubeCamera = new CubeCamera( 1, 1000, this.cubeRenderTarget );

        this.materials.chrome = MaterialsLighterGeneral.chrome(this);
        this.materials.chrome.needsUpdate = true;

        let plane = SPLINT.object.Plane(1, 20, 1, 1);
            plane.rotate(90, 0, 0);
            plane.position(0, 0, 0.01);
            plane.plane.receiveShadow = true;
            plane.plane.material = MATERIALS.other.converterBackgroundTransparent();
        this.scene.add(plane.plane);
    }    
    async draw(){

        this.drawBackground();
        LIGHT(this.scene);
        this.scene.add( this.camera );
        
        return new Promise(async function(resolve) {
            await this.lighterModel.init();
            
            this.adjustModel();
            resolve("ok");
            this.onFinishLoading();
        }.bind(this));
    }
    events(){
        this.communication = new Communication(this);
    }
    // setupRaycaster(){
    //     let groupe = this.setup.getLighterGroupe(this.scene, "Images");

    //     this.raycaster.setScene(groupe);
    //     this.raycaster.onMouseDown = function(element, name){
    //         this.renderImages.focus(element.object.name);
    //     }.bind(this);
    //     this.raycaster.onMouseMove = function(element, name){
    //         if(this.raycaster.mouseDownFlag){
    //             let img = this.renderImages.getImage(element.object.name);
    //                 // console.log(img)
    //                 let meshWidth = this.renderImages.mesh.geometry.parameters.width;
    //                 let a = (meshWidth) + this.raycaster.pointer.x
    //                 img.ImagePosX = a * 1900;
    //                 let meshHeight = this.renderImages.mesh.geometry.parameters.height;
    //                 let b = (meshHeight) - this.raycaster.pointer.y
    //                 img.ImagePosY = b * 2875;
    //                 img.update();
                
    //         }
    //     }.bind(this)
    // }
    onResize(){
        let a = this.canvas.parentNode.clientWidth;
        let b = this.canvas.parentNode.clientHeight;
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            this.canvas.width = a * 2;
            this.canvas.height = b * 2;
        } else {
            this.canvas.width = a * 2;
            this.canvas.height = b * 2;
        }
        this.canvas.style.width = a + "px";
        this.canvas.style.height = b + "px";
        if(SPLINT.ViewPort.getSize() == "mobile-small"){
            // this.renderer.setPixelRatio( Math.min(2, window.devicePixelRatio));
            this.renderer.setPixelRatio( window.devicePixelRatio * 2);
        } else {
            this.renderer.setPixelRatio( window.devicePixelRatio * 2);
        }
        // this.renderer.setPixelRatio( window.devicePixelRatio * 1.5);
        this.renderer.setSize( this.canvas.parentNode.clientWidth * 1, this.canvas.parentNode.clientHeight * 1, false);
        this.camera.aspect = this.canvas.parentNode.clientWidth / this.canvas.parentNode.clientHeight;
        this.camera.updateProjectionMatrix();
        this.render();
    }
    
    async adjustModel(){
        let scene = this.setup.getLighterGroupe(this.scene, "lighter");
        for(let i = scene.children.length - 1; i >= 0; i--){
            let element = scene.children[i];
            switch(element.name){
                case 'unteres_teil1'       : {
                } break;
                case 'oberes_teil1'        : {
                    element.children[0].geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0.002, 0 ) );
                    element.children[0].rotation.z = -2.33463
                } break;
                case 'stab1'               : {
                }  break;
                case 'verbindung_oben1'    : {
                    element.children[0].rotation.x = 2.33463
                } break;
                case 'verbindung_unten1'   : {
                } break;
                default: {
                    scene.remove(element);
                }
            }
        }

    }
}
