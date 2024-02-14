
import { Fog } from "@THREE_ROOT_DIR/src/scenes/Fog.js";
import { PerspectiveCamera } from "@THREE_ROOT_DIR/src/cameras/PerspectiveCamera.js";
import SPLINT from 'SPLINT';
import * as MATERIALS from '../../assets/materials/materials.js';
import LIGHT from './light.js';
import LighterAnimations from '../animations.js';
import SETUP from '../setup.js';
import MODEL from '../model.js';
import Communication from './communication.js';

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
        this.loaded = false;
        SPLINT.R_promise.then(async function(){
            this.events();
            this.init();
            await this.setup.draw();
            this.loaded = true;
            // resolve(true);
            
            if(this.canvas.parentElement.getAttribute("mouseEvents") == 'true'){
                this.mouseHandler.onMove = function(event){
                    if(this.mouseHandler.mouseDown){
                        this.render();
                        MODEL._rotate(this.setup.getLighterGroupe(this.scene), 0, 0, this.mouseHandler.dX);
                        
                    } else {
                    }
                }.bind(this);
            }
            // this.loaded.then(function(){
            // }.bind(this));
        }.bind(this));

    }
    remove(){
        this.onResize = function(){};
        this.AnimationMixer.stop();
        // this.AnimationMixer = null;
        // this.renderer.renderLists.dispose()
        // this.renderer.forceContextLoss();
        // this.scene = null;
        this.loaded = false;
        // this.renderer = null;
    }
    clear(){
        // this.stopAnimation()
        // console.log(this.scene)
        // this.scene.traverse(object => {
        //   if (!object.isMesh) return
        //   console.log(this)
        //   this.deleteObject(object)
        // })
      }
    
    // deleteObject(object){
    //     object.geometry.dispose()
    
    //     if (object.material instanceof Array) {
    //       object.material.forEach(material => material.dispose());
    //     } else {
    //         object.material.dispose();
    //     }
    //     object.removeFromParent()
    //     this.scene.remove(object)
    //   }
    init(){
        // if(this.canvas.getAttribute("newContext") == "true"){
        //     this.setup.renderer(true);
        // } else {
            this.setup.renderer();
        // }
        this.setup.scene("scene");
        this.scene.fog = new Fog(0xcccccc, 4, 10);
        if(this.canvas.parentElement.getAttribute("mouseEvents") == 'true'){
            // this.raycaster = SPLINT.raycaster(this);
            this.mouseHandler = SPLINT.MouseHandler( this.canvas );
        }
        this.Animations = new LighterAnimations(this);
        this.setupCamera();
        this.renderer.toneMappingExposure = 1;
        // this.setup.controls();
        // this.mouseHandler = SPLINT.MouseHandler( this.canvas );
    }
    async loadThumbnail(name, GoldFlag){
        // this.setup.getLighterGroupe(this.scene, name);
        this.thumbnailSRC = SPLINT.texture.loadFromRoot(this.canvas.getAttribute("thumbsrc"));
        this.thumbnailSRC.then(async function(tex){
            if(this.scene != null){
                MODEL.getThumbnail(this.setup.getLighterGroupe(this.scene, name), this, tex, "gold", 0xe8b000, !GoldFlag);
                MODEL.getThumbnail(this.setup.getLighterGroupe(this.scene, name), this, tex, "chrome", 0xc0c0c0, GoldFlag);
            }
            this.thumbnailSRC = null;
            return true;
        }.bind(this)).then(async function(){
            this.canvas.parentElement.parentElement.parentElement.setAttribute("loaded", true);
            this.render();
        }.bind(this)).catch(function(){});
        this.thumbnailSRC.catch(function(){
            this.canvas.parentElement.parentElement.parentElement.setAttribute("loaded", true);
        }.bind(this));
        return true;
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
        // let a = this.setup.getLighterGroupe(this.scene, "lighter2");
        // if(a != undefined){
            // a.parent.remove(a);
        // }
        // debugger;
        if(this.scene != null){
            // this.render();
            this.Animations.lighter_close.start(false, 0);
            this.Animations.lever_close.start(true, 0);
            this.render();
            SPLINT.Events.onLoadingComplete.dispatch();
            this.communication = new Communication(this);
            if(this.canvas.getAttribute("showDimensions") == 'true'){
                this.communication.showDimensions();
            }
            this.onResize();
            // this.canvas.parentElement.parentElement.parentElement.setAttribute("loaded", true);
        }
        // debugger;
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
        this.context.clearRect(0, 0, this.canvas.parentNode.clientWidth*2, this.canvas.parentNode.clientHeight*2);
        this.renderer.render(this.scene, this.camera);
        let domE = this.renderer.domElement;
        this.context.drawImage(domE, 0, 0, domE.width, domE.height, 0, 0, this.canvas.width, this.canvas.height);
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
    events(){
        SPLINT.Events.onLoadingComplete = function(){
        }.bind(this);
        // this.canvas.S_toModule = function(event, element, LighterData){
        //     LighterData = JSON.parse(LighterData);
        //     if(LighterData.turn == true){
                
        //         // this.scene.rotation.z = (20 * Math.PI / 180);
        //         this.Animations.lighter_turn.start();
        //         // this.animate();
        //     } else if(LighterData.turn == false){
        //         this.Animations.lighter_turn.start(false)
        //     }
        //     // console.log(event, LighterData);
        //     // let attr = JSON.parse(LighterData);
        //     // if(flag){
        //     //     this.Animations.lighter_close.stop();
        //     //     this.Animations.lever_close.stop();
        //     //     this.Animations.wheel_spinn.stop();
        //     //     this.Animations.lighter_open.start(true);
        //     //     this.Animations.wheel_spinn.start(true);
        //     //     this.Animations.lever_open.start(false);
        //     //     flag = false;
        //     // } else {
        //     //     this.Animations.lighter_open.stop();
        //     //     this.Animations.lever_open.stop();
        //     //     this.Animations.wheel_spinn.stop();
        //     //     this.Animations.lighter_close.start(false);
        //     //     this.Animations.wheel_spinn.start(true);
        //     //     this.Animations.lever_close.start(true);
        //     //     flag = true;
        //     // }
        //   }.bind(this);
    }
    setupRaycaster(){
        let lOpen = false;
        let groupe = this.setup.getLighterGroupe();
        this.raycaster.setScene(groupe);
        this.raycaster.addObject("oberes_teil1");
        this.raycaster.addObject("unteres_teil1");
        this.raycaster.addObject("Innenleben11");
        this.raycaster.addObject("Rad1");
        this.raycaster.onMouseClick = function(element, name){
            // switch(name){
            //     case "oberes_teil1" : {
            //         if(lOpen){
            //             this.Animations.lighter_close.start(false);
            //             this.Animations.lever_close.start(true);
            //             lOpen = false;
            //         } else {
            //             this.Animations.lighter_open.start(true);
            //             this.Animations.lever_open.start(false);
            //             lOpen = true;
            //         }
            //         // this.compressedAnimations.toggleOpen();
            //     } break;
            //     case "unteres_teil1" : {
            //         if(lOpen){
            //             this.Animations.lighter_close.start(false);
            //             this.Animations.lever_close.start(true);
            //             lOpen = false;
            //         } else {
            //             this.Animations.lighter_open.start(true);
            //             this.Animations.lever_open.start(false);
            //             lOpen = true;
            //         }
            //     } break;
            //     case "Innenleben11" : {
            //         // this.compressedAnimations.toggleFlame();
            //     } break;
            //     case "Rad1" : {
            //         // this.compressedAnimations.flameIgnite(function(){}, 500);
            //         // this.compressedAnimations.wheel(0.5);
            //     } break;
            // }
        }.bind(this);
    }
}