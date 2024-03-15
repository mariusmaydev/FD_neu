
import { Fog } from "@THREE_ROOT_DIR/src/scenes/Fog.js";
import { PerspectiveCamera } from "@THREE_ROOT_DIR/src/cameras/PerspectiveCamera.js";
import SPLINT from 'SPLINT';
import * as MATERIALS from '../../assets/materials/materials.js';
import LIGHT from './light.js';
import LighterAnimations from '../animations.js';
import SETUP from '../setup.js';
import MaterialsLighterGeneral from '../../assets/newMaterials/materialsLighterGeneral.js';
import Communication from './communication.js';
import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import { WebGLCubeRenderTarget } from "@THREE_ROOT_DIR/src/renderers/WebGLCubeRenderTarget.js";
import { CubeCamera } from "@THREE_ROOT_DIR/src/cameras/CubeCamera.js";
import { Color } from "@THREE_ROOT_DIR/src/math/Color.js";
import MaterialHelper from "@SPLINT_MODULES_DIR/ThreeJS/materials/MaterialHelper.js";
import LighterThumbnail from "../model/LighterThumbnail.js";
import LighterModel from "../model/LighterModel.js";
import workerInterface from "../../assets/workerInterface.js";

export class draw {
    static get(canvas){
        return new draw(canvas);
    }
    constructor(canvas){
        this.context = null;
        this.id = "Lighter3D_";
        this.canvas = canvas;
        this.context = null;
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
                        
                    } else {
                    }
                }.bind(this);
            }

    }
    remove(){
        this.onResize = function(){};
        this.AnimationMixer.stop();
    }
    clear(){
      }
    init(){
        SPLINT.Events.onLoadingComplete.dispatch();
        this.setup.renderer();
        this.setup.scene("scene");
        this.scene.fog = new Fog(0xcccccc, 4, 10);
        if(this.canvas.parentElement.getAttribute("mouseEvents") == 'true'){
            // this.raycaster = SPLINT.raycaster(this);
            this.mouseHandler = SPLINT.MouseHandler( this.canvas );
        }
        this.Animations = new LighterAnimations(this);
        // this.renderer.needsUpdate = true;
        this.setupCamera();
        // this.setup.controls();
        // this.mouseHandler = SPLINT.MouseHandler( this.canvas );
        

        this.cubeRenderTarget = new WebGLCubeRenderTarget( 256 );
        this.cubeRenderTarget.texture.type = THC.HalfFloatType;
        this.cubeCamera = new CubeCamera( 1, 1000, this.cubeRenderTarget );

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
        let group = this.setup.getLighterGroupe(this.scene, "lighter")
        let Gold = new Color(0xe8b000);
        let Chrome = new Color(0xc0c0c0);
        if(color == "GOLD"){
            this.thumbnail.setColor(Gold);

        } else {
            this.thumbnail.setColor(Chrome);
        }
        this.render();
    }
    async loadThumbnail(name, GoldFlag){
        let thumbSRC = this.canvas.getAttribute("thumbsrc");
        if(thumbSRC == null){
            return
        }
        let nameT = thumbSRC.split('/').at(-2);
        let num = parseInt(thumbSRC.split('?').at(-1));
        if(!isNaN(num)){
            nameT = thumbSRC.split('/').at(-2) + "_" + num;
        }
        return new Promise(async function(resolve){
            if(this.scene != null){
                SPLINT.ResourceManager.loadTextureAsync(nameT, this.canvas.getAttribute("thumbsrc").substr(4)).then(async function(texture){    
                    
                    this.thumbnail = new LighterThumbnail(this, "lighter");
                    if(GoldFlag){
                        this.thumbnail.loadThumbnailMaterial(texture, 0xe8b000);  
                    } else {
                        this.thumbnail.loadThumbnailMaterial(texture, 0xc0c0c0, true);  
                    }
                    resolve(true);
                }.bind(this));   
            }
        }.bind(this));
    }
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
        this.renderer.setSize( this.canvas.parentNode.clientWidth * 1, this.canvas.parentNode.clientHeight * 1, false);
        this.camera.aspect = this.canvas.parentNode.clientWidth / this.canvas.parentNode.clientHeight;
        this.camera.updateProjectionMatrix();
        this.render();
    }
    async onFinishLoading(){
        this.changeColor("base");
        // this.scene.traverse(function(object) {
        //     if(object.type === 'Mesh') {
        //         if(object.material.name == "chrome"){
        //             // object.material = MaterialsLighterGeneral.chrome1(this);
        //         } else if(object.material.name == "body"){
        //             object.material = MaterialsLighterGeneral.bodyColor(this, 0x006800);
        //             object.material.needsUpdate = true
        //         }
        //     };
        // }.bind(this));
        if(this.scene != null){
            this.canvas.parentElement.parentElement.parentElement.setAttribute("loaded", true);
            this.canvas.setAttribute("loaded", true);

            this.canvas.Storage = new Object();
            this.canvas.Storage.type = "loaded";
            this.canvas.Storage.value = "value";

            this.communication = new Communication(this);
            this.canvas.dispatchEvent(SPLINT_EVENTS.toCommonJS);
            setTimeout(async function(){
                // console.dir(this.canvas)
                if(this.canvas.getAttribute("showDimensions") == 'true'){
                    this.communication.showDimensions();
                }
                this.onResize();
                this.render();
            }.bind(this), 100);

            workerInterface.createNormalMap(SPLINT.projectRootPath + "../" + this.canvas.getAttribute("thumbsrc").substr(4)).then(async function(texture){
                this.thumbnail.loadNormalMap(texture)
                this.render();
            }.bind(this))
        }
    }
    setupCamera(){
        this.camera     = new PerspectiveCamera(55, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 10);
        this.camera.position.set(0, 0.15, 0.45);
        this.camera.rotation.set(0, 0, 0);
        this.camera.filmGauge = 50;
        // this.camera     = new THREE.PerspectiveCamera(60, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 10);
        // this.camera.position.set(0, 0.15, 0.4);
        // this.camera.rotation.set(0, 0, 0);
        // this.camera.filmGauge = 50;
        // this.camera.zoom = 1.2;
    }
    async light(){
        LIGHT(this.scene);
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
        this.cubeCamera.update(this.renderer, this.scene);
        this.context.clearRect(0, 0, this.canvas.parentNode.clientWidth*2, this.canvas.parentNode.clientHeight*2);
        this.renderer.render(this.scene, this.camera);
        let domE = this.renderer.domElement;
        this.context.drawImage(domE, 0, 0, domE.width, domE.height, 0, 0, this.canvas.width, this.canvas.height);
    }
    async draw(){
        this.drawBackground();
        this.light();
        this.scene.add( this.camera );
        return new Promise(async function(resolve){
            await this.lighterModel.init();
            if(this.canvas.getAttribute("color") == "CHROME"){
                await this.loadThumbnail("lighter", false);
            } else {
                await this.loadThumbnail("lighter", true);
            }
            this.Animations.lighter_close.start(false, 0);
            this.Animations.lever_close.start(true, 0);
            this.onFinishLoading();
            resolve('resolved');
        }.bind(this));
    }
    async drawBackground(){
        
		// let t1 = new RGBELoader()
        // .setPath( '../../../../../../Splint/lib/threeJS/examples/textures/equirectangular/' )
        // .load( 'quarry_01_1k.hdr'
        // // , function ( texture ) {

        // //     texture.mapping = THC.EquirectangularReflectionMapping;

        // //     this.scene.background = texture;
        // //     this.scene.environment = texture;

        // // }.bind(this) 
        // );
        // let t1 = await SPLINT.ResourceManager.dataTextures.indexBackground;
        // t1.mapping = THC.EquirectangularReflectionMapping;
        // console.log(t1);
        // let path = '../../../../../../Splint/lib/threeJS/examples/textures/cube/SwedishRoyalCastle/';
        // let format = '.jpg';
        // let urls = [
        //     path + 'px' + format, path + 'nx' + format,
        //     path + 'py' + format, path + 'ny' + format,
        //     path + 'pz' + format, path + 'nz' + format
        // ];
        // let reflectionCube = new CubeTextureLoader().load( urls );
        // let refractionCube = new CubeTextureLoader().load( urls );
        // refractionCube.mapping = THC.CubeRefractionMapping;
        // this.scene.background = t1;
        // this.scene.enviroment = t1;

        

        let plane = SPLINT.object.Plane(180, 1600, 1, 1);
        plane.get().geometry.translate(0, 799, 0);
        // plane.position(0, 0, -15);
            plane.rotate(90, 0, 0);
            plane.plane.material = MATERIALS.other.shadowCatcher();
            plane.plane.receiveShadow = true;
        this.scene.add(plane.plane);
    }
    events(){
        SPLINT.Events.onLoadingComplete = function(){
        }.bind(this);
    }
}