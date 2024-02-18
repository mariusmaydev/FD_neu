
// import { Fog } from "@THREE_ROOT_DIR/src/scenes/Fog.js";
// import { PerspectiveCamera } from "@THREE_ROOT_DIR/src/cameras/PerspectiveCamera.js";
// import { Color } from "@THREE_ROOT_DIR/src/math/Color.js";
import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import SPLINT from 'SPLINT';
import * as MATERIALS from '../../assets/materials/materials.js';
import LIGHT from './light.js';
import CompressedAnimations from './animations.js';
import LighterAnimations from '../animations.js';
import SETUP from '../setup.js';
import MODEL from '../model.js';
import Communication from './communication.js';
import { PerspectiveCamera } from "@THREE_ROOT_DIR/src/cameras/PerspectiveCamera.js";
import { Fog } from "@THREE_ROOT_DIR/src/scenes/Fog.js";
import { Color } from "@THREE_ROOT_DIR/src/math/Color.js";

export class draw {
    static get(canvas){
        return new draw(canvas);
    }
    constructor(canvas){
        this.context = null;
        this.id = "Lighter3D_";
        this.canvas = canvas;
        // this.thumbnailSRC = SPLINT.URIs.project + "/" + SRC().lighter.engraving.thumbnail;
        this.setup = new SETUP(this);
        this.loaded = null;
        this.animationTime = 0;
        this.loadedTexture = false;
        this.debuggMode = false;
        SPLINT.R_promise.then(function(){
            this.init();
            this.events();
            this.draw();
            
            this.mouseHandler.onMove = function(event){
                if(this.debuggMode){
                    return
                }
                if(!this.raycaster2.doesHover){
                    this.canvas.style.cursor = "default";
                }
                if(this.mouseHandler.mouseDown){
                    //    this.render();
                    if(this.raycaster2.mouseDownFlag){
                        // console.dir(this.setup.getLighterGroupe(this.scene))
                        MODEL._rotate(this.setup.getLighterGroupe(this.scene), 0, 0, this.mouseHandler.dX);
                    }
                } else {
                }
            }.bind(this);
        }.bind(this));

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
        this.setup.renderer(true);
        this.setup.scene();
        this.thumbnailSRC = SPLINT.resources.textures.lighter_engraving_thumbnail.clone();
        // this.thumbnailSRC_specularMap = SPLINT.resources.textures.lighter_engraving_specularMap.clone();
        // this.thumbnailSRC_displacementMap = SPLINT.resources.textures.lighter_engraving_displacementMap.clone();
        // console.log(SPLINT.resources.textures.lighter_engraving_thumbnail);
        this.scene.fog = new Fog(0xffffff, 6.5, 7.8);
        this.mouseHandler = SPLINT.MouseHandler( this.canvas );
        this.Animations = new LighterAnimations(this);
        this.compressedAnimations = new CompressedAnimations(this);
        this.setupCamera();
        this.renderer.physicallyCorrectLights  = true;
        this.renderer.toneMappingExposure = 0.5;
        // this.renderer.toneMapping = 2;
        this.renderer.toneMapping = THC.ACESFilmicToneMapping;
        this.renderer.outputEncoding = THC.sRGBEncoding;
        this.renderer.needsUpdate = true;
        this.raycaster = SPLINT.raycaster(this);
        this.raycaster2 = SPLINT.raycaster(this);
        // this.setup.controls();
    }
    setupCamera(){
        if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
            this.camera     = new PerspectiveCamera(60, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 200);
            // this.camera.position.set(0, 0.4, 4);
            this.camera.position.set(0, 0.18, 0.7);
        } else {
            this.camera     = new PerspectiveCamera(10, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 200);
            this.camera.position.set(-0.15, 0.35, 3.5);
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
                MODEL.getThumbnail(this.setup.getLighterGroupe(this.scene, name), this, SPLINT.resources.textures.lighter_engraving_thumbnail, SPLINT.resources.textures.ligher_NormalMapEngraving, "gold", 0xe8b000, !GoldFlag);
            } else{
                MODEL.getThumbnail(this.setup.getLighterGroupe(this.scene, name), this, SPLINT.resources.textures.lighter_engraving_thumbnail_chrome, SPLINT.resources.textures.ligher_NormalMapEngraving, "chrome", 0xc0c0c0, GoldFlag);
            }

        }
    }
    async onFinishLoading(){
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
            SPLINT.ViewPort.getSize().log();
        }.bind(this));
        SPLINT.Events.onLoadingComplete.dispatch();

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
        this.renderer.render(this.scene, this.camera);
        this.context.clearRect(0, 0, this.canvas.parentNode.clientWidth*2, this.canvas.parentNode.clientHeight*2);
        let domE = this.renderer.domElement;
        this.context.drawImage(domE, 0, 0, domE.width, domE.height, 0, 0, this.canvas.width, this.canvas.height);
    }
    drawBackground(){
        this.scene.background = new Color( 0xffffff);
        let plane = SPLINT.object.Plane(1000, 1600, 1, 1);
        plane.get().geometry.translate(0, -799, 0);
            plane.rotate(93, 0, 0);
            plane.plane.material = MATERIALS.other.indexBackground();
            plane.plane.receiveShadow = true;
        this.scene.add(plane.plane);
    }    
    async draw(){
            this.drawBackground();
            this.light();
            this.scene.add( this.camera );
        return new Promise(async function(resolve){
            await MODEL.init(this, "lighter", 2);
            await MODEL.init(this, "lighter2", 2, false);
            let lighterGroupe1 = this.setup.getLighterGroupe(this.scene);
                lighterGroupe1.rotation.z = 0.2618;
                lighterGroupe1.rotationBase = lighterGroupe1.rotation.clone();
                resolve('resolved');

            let lighterGroupe2 = this.setup.getLighterGroupe(this.scene, 'lighter2');
                lighterGroupe2.rotation.z = 10 * (Math.PI / 180);
                lighterGroupe2.position.x = -5;
                lighterGroupe2.position.z = -0.17;
                lighterGroupe2.children[14].rotation.y = (-106.5 +  1) * Math.PI / 180;
                lighterGroupe2.children[0].children[0].rotation.z = (-133.7648) * Math.PI / 180;
                lighterGroupe2.rotationBase = lighterGroupe2.rotation.clone();
            this.onFinishLoading();
        }.bind(this));
    }
    events(){
        let flag = true;
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
