
import SPLINT from 'SPLINT';
import * as MATERIALS from '../../assets/materials/materials.js';
import LIGHT from './light.js';
import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import CompressedAnimations from './animations.js';
import LighterAnimations from '../animations.js';
import SETUP from '../setup.js';
import MODEL from '../model.js';
import Communication from './communication.js';
// import IMAGES from './images.js';
import MaterialsLighterGeneral from '../../assets/newMaterials/materialsLighterGeneral.js';
import { Fog } from "@THREE_ROOT_DIR/src/scenes/Fog.js";
import { PerspectiveCamera } from "@THREE_ROOT_DIR/src/cameras/PerspectiveCamera.js";

export class draw {
    static get(canvas){
        return new draw(canvas);
    }
    constructor(canvas){
        this.id = "Lighter3D_";
        this.canvas = canvas;
        this.context = null;
        this.setup = new SETUP(this);
        this.loaded = null;
        this.animationTime = 0;
        this.materials = new Object();
        // this.imgsrc = SPLINT.URIs.project + "/" + SRC().lighter.engraving.thumbnail;
        // SPLINT.R_promise.then(function(){
            this.init();
            this.events();
            this.draw();
            // this.mouseHandler.onMove = function(event){
            //     console.log(event)
            //     if(this.mouseHandler.mouseDown){
            //         this.renderer.setAnimationLoop( function(){
            //            this.renderer.render( this.scene, this.camera );
            //         }.bind(this));
            //         MODEL._rotate(this.setup.getLighterGroupe(this.scene), 0, 0, this.mouseHandler.dX);
            //     } else {
            //         this.renderer.setAnimationLoop( null);
            //     }
            // }.bind(this);
        // }.bind(this));

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
    init(){
        SPLINT.GUI.hide();
        SPLINT.Events.onLoadingComplete.dispatch()
        // console.log(SPLINT.resources.textures.lighter_engraving_thumbnail);
        this.setup.scene();
        // this.scene.fog = new Fog(0xff0000, 10, 300);
        // this.mouseHandler = SPLINT.MouseHandler( this.canvas );
        this.Animations = new LighterAnimations(this);
        this.compressedAnimations = new CompressedAnimations(this);
        this.setup.renderer(true);
        this.setupCamera();

        // this.renderImages = new IMAGES(this);
        this.renderer.toneMappingExposure = 1;
        this.renderer.shadowMap.type = SPLINT.VSMShadowMap;
        // this.raycaster = SPLINT.raycaster(this);
        // this.setup.controls();
    }
    setupCamera(){
        this.camera     = new PerspectiveCamera(24, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.1, 100);
        this.camera.position.set(0, 0.135, 0.97);
        // this.camera.zoom = 1.1;
        this.camera.updateProjectionMatrix();
    }
    drawThumbnail(){
        // MODEL.getThumbnail(this.setup.getLighterGroupe(this.scene, name), this, SPLINT.resources.textures.lighter_engraving_thumbnail, "gold", 0xe8b000, !GoldFlag);
    }
    async loadThumbnail(name, GoldFlag){}
    async onFinishLoading(){
        this.Animations.lever_close.start(true, 0);
        this.Animations.lighter_close.start(false, 0);
        this.animate();
    }
    light(){
        LIGHT(this.scene);
    }
    async animate(){
        if(this.renderer.domElement.width > 0){
            this.render();
        } else {
            requestAnimationFrame(this.animate.bind(this));
        }
    }
    async render(){
        this.context.clearRect(0, 0, this.canvas.parentNode.clientWidth*2, this.canvas.parentNode.clientHeight*2);
        this.renderer.render(this.scene, this.camera);
        let domE = this.renderer.domElement;
        this.context.drawImage(domE, 0, 0, domE.width, domE.height, 0, 0, this.canvas.width, this.canvas.height);
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
            this.light();
            this.scene.add( this.camera );
        
        return new Promise(async function(resolve) {
            await MODEL.init(this, "lighter");
                // lighterGroupe2.visible = false;
            // console.log();
            resolve("ok");
            this.onFinishLoading();
        }.bind(this));
    }
    events(){
        // this.setup.events.onResize().initDefault();
        let flag = true;
        this.communication = new Communication(this);
    }
    setupRaycaster(){
        let groupe = this.setup.getLighterGroupe(this.scene, "Images");

        this.raycaster.setScene(groupe);
        this.raycaster.onMouseDown = function(element, name){
            this.renderImages.focus(element.object.name);
        }.bind(this);
        this.raycaster.onMouseMove = function(element, name){
            if(this.raycaster.mouseDownFlag){
                let img = this.renderImages.getImage(element.object.name);
                    // console.log(img)
                    let meshWidth = this.renderImages.mesh.geometry.parameters.width;
                    let a = (meshWidth) + this.raycaster.pointer.x
                    img.ImagePosX = a * 1900;
                    let meshHeight = this.renderImages.mesh.geometry.parameters.height;
                    let b = (meshHeight) - this.raycaster.pointer.y
                    img.ImagePosY = b * 2875;
                    img.update();
                
            }
        }.bind(this)
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
        // this.renderer.setPixelRatio( window.devicePixelRatio * 1.5);
        this.renderer.setSize( this.canvas.parentNode.clientWidth * 1, this.canvas.parentNode.clientHeight * 1, false);
        this.camera.aspect = this.canvas.parentNode.clientWidth / this.canvas.parentNode.clientHeight;
        this.camera.updateProjectionMatrix();
        this.render();
    }
}
