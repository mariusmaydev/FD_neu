

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
    static get(canvas){
        return new draw(canvas);
    }
    constructor(canvas){
        this.id = "Lighter3D_";
        this.canvas = canvas;
        this.context = null;
        this.drawID = null;
        this.nameThumbnail = new Object();
        this.StorageManager = new SPLINT.IndexedDB.Manager("DynamicData");
        this.getName();
        this.setup = new SETUP(this);
        this.materials = new Object();
        this.lighterModel = new LighterModel(this);
        this.init();
        this.draw();
            
        if(this.canvas.parentElement.getAttribute("mouseEvents") == 'true'){
            this.mouseHandler.onMove = function(event){
            if(this.mouseHandler.mouseDown){
                this.render();
                this.lighterModel.rotate(0, 0, this.mouseHandler.dX);
            }
        }.bind(this);
    }

    }
    remove(){
        // this.onResize = function(){};
        this.AnimationMixer.stop();
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
    init(){
        SPLINT.Events.onLoadingComplete.dispatch();
        this.setup.renderer();
        this.setup.scene("scene");
        this.scene.fog = new THREE.Fog(0xcccccc, 4, 10);
        if(this.canvas.parentElement.getAttribute("mouseEvents") == 'true'){
            this.mouseHandler = SPLINT.MouseHandler( this.canvas );
        }
        this.Animations = new LighterAnimations(this);
        this.setupCamera();
        // SPLINT.ResourceManager.dataTextures.indexBackground.then(async function(texture){
        //     console.dir(texture)
        //     // let t1 = (await SPLINT.ResourceManager.dataTextures.indexBackground);
        //     // let clone = t1.SPLINT.ThreeClone();
        //         // texture.mapping = THREE.EquirectangularReflectionMapping;
        //         texture.mapping = THREE.EquirectangularReflectionMapping;
        //     this.scene.background = texture;
        //     this.scene.enviroment = texture;
        // }.bind(this))
        // this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256 );
        // this.cubeRenderTarget.texture.type = THREE.HalfFloatType;
        // this.cubeCamera = new THREE.CubeCamera( 1, 1000, this.cubeRenderTarget );
        // this.scene.add( this.cubeCamera );
        this.materials.chrome = MaterialsLighterGeneral.chrome(this);
        this.materials.chrome.needsUpdate = true;
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
    async changeEngravingColor(color){
        let Gold = new THREE.Color(0xe8b000);
        let Chrome = new THREE.Color(0xc0c0c0);
        if(color == "GOLD"){
            this.thumbnail.setColor(Gold);
        } else {
            this.thumbnail.setColor(Chrome);
        }
        this.render();
    }
    async loadThumbnail(GoldFlag){
        this.getName();
        if(this.nameThumbnail.new != this.nameThumbnail.before){
            this.thumbnailReload = true;
        } else {
            this.thumbnailReload = false;
        }
        this.nameThumbnail.before = this.nameThumbnail.new;
        return new Promise(async function(resolve){
            if(this.scene != null){
                let binaryImg = await this.StorageManager.get(this.drawID + "_thumbnail");
                if(binaryImg == undefined){
                    binaryImg = await SPLINT.BinaryImage.fromURL(location.origin + (this.canvas.getAttribute("thumbsrc")));
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
        const parentSize = {
            width   : this.canvas.parentNode.clientWidth,
            height  : this.canvas.parentNode.clientHeight
        }
        if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
            this.canvas.width   = parentSize.width * 2;
            this.canvas.height  = parentSize.height * 2;
        } else {
            this.canvas.width   = parentSize.width * 2;
            this.canvas.height  = parentSize.height * 2;
        }
        this.canvas.style.width     = parentSize.width  + "px";
        this.canvas.style.height    = parentSize.height + "px";

        if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
            this.renderer.setPixelRatio( window.devicePixelRatio * 1.5);
            this.renderer.setSize( parentSize.width /2, parentSize.height /2, false);
        } else {
            this.renderer.setPixelRatio( window.devicePixelRatio * 2);
            this.renderer.setSize( parentSize.width, parentSize.height, false);
        }
        this.render();
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

            this.communication = new Communication(this);
            this.canvas.dispatchEvent(SPLINT_EVENTS.toCommonJS);
            setTimeout(async function(){
                if(this.canvas.getAttribute("showDimensions") == 'true'){
                    this.communication.showDimensions();
                }
                this.adjustSizes();
                this.render();
            }.bind(this), 100);

            let normalMapData = await this.StorageManager.get(this.drawID + "_normalMap");
            
            if(normalMapData == undefined){
                let binaryImg = await this.StorageManager.get(this.drawID + "_thumbnail");
                if(binaryImg == undefined){
                    binaryImg = await SPLINT.BinaryImage.fromURL(location.origin + (this.canvas.getAttribute("thumbsrc").slice(0,-3)));
                    this.StorageManager.set(this.drawID + "_thumbnail", binaryImg);
                }
                let d = await binaryImg.export_imageData();
                workerInterfaceNew.createNormalMap(this.drawID + "_normalMap", d).then(async function(imageData){
                    this.StorageManager.set(this.drawID + "_normalMap", imageData);
                    let texture = new THREE.Texture(imageData);
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
                }.bind(this));
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
                // this.thumbnail.lighter1.loadEnvMap(this.cubeRenderTarget.texture);
                // this.thumbnail.lighter2.loadEnvMap(this.cubeRenderTarget.texture);
                // this.render();
            }
        }
    }
    setupCamera(){
        this.camera = new THREE.PerspectiveCamera(65, this.canvas.parentNode.clientWidth / this.canvas.parentNode.clientHeight, 0.01, 10);
        this.camera.position.set(0, 0.15, 0.45);
        this.camera.rotation.set(0, 0, 0);
        this.camera.filmGauge = 0;
    }
    async animate(){
        if(this.renderer == null || this.scene == null){
            return;
        }
        this.render();
        this.AnimationMixer.tick();
    }
    async render(){
        if(this.renderer == null || this.scene == null){
            return;
        }
        // this.cubeCamera.update(this.renderer, this.scene);
        this.renderer.render(this.scene, this.camera);
    }
    async draw(){
        this.drawBackground();
        LIGHT(this.scene);
        this.scene.add( this.camera );
        return new Promise(async function(resolve){
            await this.lighterModel.init();
            if(this.canvas.getAttribute("color") == "CHROME"){
                await this.loadThumbnail(false);
            } else {
                await this.loadThumbnail(true);
            }
            this.Animations.lighter_close.start(false, 0);
            this.Animations.lever_close.start(true, 0);
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
}