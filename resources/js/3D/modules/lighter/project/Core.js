

import SPLINT from 'SPLINT';
import * as MATERIALS from '../../assets/materials/materials.js';
import LIGHT from './light.js';
import LighterAnimations from '../animations.js';
import SETUP from '../setup.js';
import MaterialsLighterGeneral from '../../assets/newMaterials/materialsLighterGeneral.js';
import Communication from './communication.js';
import * as THREE from "@THREE";
import MaterialHelper from "@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js";
import LighterThumbnail from "../model/LighterThumbnail.js";
import LighterModel from "../model/LighterModel.js";
import workerInterfaceNew from "../../assets/workerInterfaceNew.js";
SPLINT.BinaryImage

export class draw {
    
    static get(canvas, autoInit = true){
        return new draw(canvas, autoInit);
    }
    constructor(canvas, autoInit = true){
        this.id = "Lighter3D_";
        this.canvas = canvas;
        this.drawID = null;
        this.nameThumbnail = new Object();
        this.StorageManager = new SPLINT.IndexedDB.Manager("DynamicData");
        this.getName();
        this.AnimationLoopActive = true;
        this.setup = new SETUP(this);
        this.singleImage = false;
        this.materials = new Object();
        this.lighterModel = new LighterModel(this);
        // if(autoInit){
        //     this.initStatic();
        // }    
    }
    getName(){
        let thumbSRC = this.canvas.getAttribute("thumbsrc");
        if(thumbSRC == null){
            return
        }
        let nameT = thumbSRC.split('/').at(-2);
        this.drawID = thumbSRC.split('/').at(-2);
        this.num = parseInt(thumbSRC.split('?').at(-1));
        if(!isNaN(this.num)){
            nameT = thumbSRC.split('/').at(-2) + "_" + this.num;
        }
        this.nameThumbnail.new = nameT;
    }
    initStatic(){
        this.isStaticRenderer = true;
        // this.canvas.height = window.innerHeight
        // this.canvas.width = window.innerWidth
        this.context_2D = this.canvas.getContext("2d", {willReadFrequently: false , desynchronized: true});
        this.setupCamera();
        this.setup.staticRenderer();
        this.setup.scene("scene");
        this.scene.fog = new THREE.Fog(0xcccccc, 4, 10);
        // this.adjustSizes()
        // this.materials.chrome = MaterialsLighterGeneral.chrome(this);
        // this.materials.chrome.needsUpdate = true;
        this.draw();
    }
    initDynamic(){
        this.isStaticRenderer = false;
        this.context_2D = this.canvas.getContext("2d", {willReadFrequently: false , desynchronized: true});
        this.finish = function(){}
        this.setupCamera();
        this.setup.renderer(true, this.canvas);
        this.setup.scene("scene");
        this.scene.fog = new THREE.Fog(0xcccccc, 4, 10);
        this.draw();
        // this.Animations = new LighterAnimations(this);
        // console.dir(this)
        this.renderer.domElement.oncontentvisibilityautostatechange = function(e){
            if(e.skipped == true){
                this.remove();
            }
        }.bind(this);
        this.renderer.domElement.style.contentVisibility = "auto";
        this.mouseHandler = SPLINT.MouseHandler( this.canvas );
        this.mouseHandler.onMove = function(event){
            if(this.mouseHandler.mouseDown){
                requestAnimationFrame(this.render.bind(this));
                // requestAnimationFrame(this.render.bind(this));
                this.lighterModel.rotate(0, 0, this.mouseHandler.dX);
            }
        }.bind(this);
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
    }
    async changeEngravingColor(color){
        let Gold = new THREE.Color(0xe8b000);
        let Chrome = new THREE.Color(0xc0c0c0);
        if(color == "GOLD"){
            this.thumbnail.setColor(Gold);
        } else {
            this.thumbnail.setColor(Chrome);
        }
    }
    async loadThumbnail(GoldFlag){
        return new Promise(async function(resolve){
            if(this.scene != null){
                let binaryImg = await this.StorageManager.get(this.drawID + "_thumbnail");
                if(binaryImg == undefined){
                    binaryImg = await SPLINT.BinaryImage.fromURL(location.origin + (this.canvas.getAttribute("thumbsrc")));
                    if(binaryImg == false || !(binaryImg instanceof SPLINT.BinaryImage)){
                        await this.StorageManager.remove(this.drawID + "_thumbnail");
                        // this.render();
                        // this.finish()
                        // resolve(true);
                        // return ;
                    } 
                    this.StorageManager.set(this.drawID + "_thumbnail", binaryImg);
                }
                let bb = await binaryImg.export_imageData();
                let texture = new THREE.Texture(bb); 
                this.thumbnail = new LighterThumbnail(this, "lighter");  
                if(GoldFlag){
                    this.thumbnail.loadThumbnailMaterial(texture, 0xe8b000, false);
                } else {      
                    this.thumbnail.loadThumbnailMaterial(texture, 0xc0c0c0, false);
                }
                this.thumbnail.loadAlphaMap(texture);
            }
            resolve(true) 
        }.bind(this));
    }
    
    adjustSizes(){
        if(this.isStaticRenderer) {
            console.dir(this)
        }
        let parentSize = {
            width   : this.canvas.parentNode.clientWidth,
            height  : this.canvas.parentNode.clientHeight
        }
        // this.camera.aspect = window.innerWidth / window.innerHeight;
        // this.camera.updateProjectionMatrix();
    
        this.setup.adjustCamera(parentSize);
        let drp = window.devicePixelRatio ;
        // if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
        //     this.canvas.width   = parentSize.width * drp;
        //     this.canvas.height  = parentSize.height * drp;
        // } else {
        //     this.canvas.width   = parentSize.width ;
        //     this.canvas.height  = parentSize.height;
        // }
        this.canvas.style.width     = parentSize.width  + "px";
        this.canvas.style.height    = parentSize.height + "px";
        this.canvas.width     = parentSize.width * drp;
        this.canvas.height    = parentSize.height * drp;

        if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
            this.renderer.setSize( this.canvas.width , this.canvas.height, false);
            this.renderer.setPixelRatio( drp );
        } else {
            this.renderer.setSize( this.canvas.width , this.canvas.height, false);
            this.renderer.setPixelRatio( drp );
        }
        // this.canvas.style.width     = parentSize.width  + "px";
        // this.canvas.style.height    = parentSize.height + "px";
    }
    async onFinishLoading(){
        this.changeColor("base");
        this.scene.traverse(function(object) {
            if(object.type === 'Mesh') {
                if(object.material.name == "body"){
                    object.material = MaterialsLighterGeneral.bodyColor(this, 0x006800);
                    object.material.needsUpdate = true
                }
            };
        }.bind(this));
        if(this.scene != null){
            this.canvas.parentElement.parentElement.parentElement.setAttribute("loaded", true);
            this.canvas.setAttribute("loaded", true);

            this.canvas.Storage = new Object();
            this.canvas.Storage.type = "loaded";
            this.canvas.Storage.value = "value";

            this.render();
            this.communication = new Communication(this);
            // this.canvas.dispatchEvent(SPLINT_EVENTS.toCommonJS);
            this.canvas.dispatchEvent(SPLINT_EVENTS.toCommonJS);
            // setTimeout(async function(){
            //     if(this.canvas.getAttribute("showDimensions") == 'true'){
            //         this.communication.showDimensions();
            //     }
            //     this.adjustSizes();
            //     this.render();
            // }.bind(this), 100);
            // this.startAnimationLoop()

            let normalMapData = await this.StorageManager.get(this.drawID + "_normalMap");

            if(normalMapData == undefined){
                let binaryImg = await this.StorageManager.get(this.drawID + "_thumbnail");
                if(binaryImg == undefined){
                    binaryImg = await SPLINT.BinaryImage.fromURL(location.origin + (this.canvas.getAttribute("thumbsrc")));
                    if(!(binaryImg instanceof SPLINT.BinaryImage)){
                        await this.StorageManager.remove(this.drawID + "_thumbnail");
                        return;
                    }
                    this.StorageManager.set(this.drawID + "_thumbnail", binaryImg);
                }
                let d = await binaryImg.export_imageData();
                
                workerInterfaceNew.createNormalMap(this.drawID + "_normalMap", d).then(async function(imageData){

                    this.StorageManager.set(this.drawID + "_normalMap", imageData);
                    let texture = new THREE.Texture(imageData);
                        texture.needsUpdate = true;


                    this.thumbnail.loadNormalMap(texture);

                    this.thumbnail.setColor(new THREE.Color(0xe8b000))

                    let obj = {
                        magFilter: THREE.LinearFilter,
                        minFilter: THREE.LinearMipMapLinearFilter
                    }
                    this.thumbnail.setMaterialMapAttributes(obj);
                }.bind(this));
                this.render();
            } else {
                let texture = new THREE.Texture(normalMapData);
                    texture.needsUpdate = true;

                    // this.thumbnail.loadEnvMap(this.cubeRenderTarget.texture);
                this.thumbnail.loadNormalMap(texture);

                this.thumbnail.setColor(new THREE.Color(0xe8b000))

                let obj = {
                    magFilter: THREE.LinearFilter,
                    minFilter: THREE.LinearMipMapLinearFilter
                }
                this.thumbnail.setMaterialMapAttributes(obj);
            this.render();
            }
        }
    }
    setupCamera(){
        console.dir(this.canvas)
        if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
            this.camera     = new THREE.PerspectiveCamera(40, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 10);
            this.camera.position.set(0, 0.15, 0.8);//0.3);//-0.7);
        } else {
            this.camera     = new THREE.PerspectiveCamera(65, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 10);
            this.camera.position.set(0, 0.2, 0.35);
        }
        this.camera.name = "camera";
        this.camera.rotation.set(0, 0, 0);
        this.camera.zoom = 1.2;
        this.camera.filmGauge = 0;
        this.camera.focus = 0.4;
        // this.camera.filmOffset = 122;
        // this.camera.aspect = this.canvas.parentNode.clientWidth / this.canvas.parentNode.clientHeight;
        // this.camera.updateProjectionMatrix();
        this.camera.positionBase = this.camera.position.clone();
        this.camera.FOVBase = this.camera.fov;
        this.camera.updateProjectionMatrix();
        this.camera.matrixAutoUpdate = true;
    }
    stopAnimationLoop(){
        this.AnimationLoopActive = false;
    }
    async render(){
        if(this.renderer == null || this.scene == null){
            return;
        }
        if(this.isStaticRenderer){
            this.adjustSizes();
            this.renderer.render(this.scene, this.camera);
            let ele = this.renderer.domElement;

            this.context_2D.drawImage(ele, 0, 0, ele.width, ele.height, 0, 0, this.canvas.width, this.canvas.height);

            this.finish()
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }
    async draw(){
        this.drawBackground();
        LIGHT(this.scene);
        this.scene.add( this.camera );
        return new Promise(async function(resolve){
            await this.lighterModel.init();
            if(this.canvas.getAttribute("color") == "CHROME"){
                this.loadThumbnail(false);
            } else {
                this.loadThumbnail(true);
            }
            this.adjustModel();
            this.onFinishLoading();
            resolve('resolved');
        }.bind(this));
    }
    async drawBackground(){
        let plane = SPLINT.object.Plane(180, 1600, 1, 1);
        plane.get().geometry.translate(0, 799, 0);
        // plane.position(0, 0, -15);
            plane.rotate(90, 0, 0);
            plane.plane.material = MATERIALS.other.shadowCatcher();
            plane.plane.receiveShadow = true;
        this.scene.add(plane.plane);
    }
    async adjustModel(){
        let scene = this.setup.getLighterGroupe(this.scene, "lighter");
        for(let i = scene.children.length - 1; i >= 0; i--){
            let element = scene.children[i];
            switch(element.name){
                case 'unteres_teil1'       : {
                } break;
                case 'oberes_teil1'        : {
                    element.children[0].geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0.000, 0 ) );
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