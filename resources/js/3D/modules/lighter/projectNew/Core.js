
import { Fog } from "@THREE_ROOT_DIR/src/scenes/Fog.js";
import { PerspectiveCamera } from "@THREE_ROOT_DIR/src/cameras/PerspectiveCamera.js";
import SPLINT from 'SPLINT';
import * as MATERIALS from '../../assets/materials/materials.js';
import LIGHT from './light.js';
import LighterAnimations from '../animations.js';
import SETUP from '../setup.js';
import MaterialsLighterGeneral from '../../assets/newMaterials/materialsLighterGeneral.js';
import LighterThumbnail from "../model/LighterThumbnail.js";
import LighterModel from "../model/LighterModel.js";

export class draw {
    static get(canvas){
        return new draw(canvas);
    }
    constructor(canvas){
        this.id = "Lighter3D_P_";
        this.canvas = canvas;
        this.context = null;
        this.setup = new SETUP(this);
        this.materials = new Object();
        this.thumbnail = new Object();
        
        this.lighterModel_1 = new LighterModel(this, "lighter");
        this.lighterModel_2 = new LighterModel(this, "lighter2");
            this.init();
            this.draw();

    }
    remove(){
        this.onResize = function(){};
        this.AnimationMixer.stop();

    }
    async onFinishLoading(){
        if(this.scene != null){
            setTimeout(async function(){
                this.canvas.parentElement.parentElement.parentElement.setAttribute("loaded", true);
                this.render();
            }.bind(this), 100)    
        }
    }
    init(){
        SPLINT.Events.onLoadingComplete.dispatch();
        this.setup.renderer(true);
        this.setup.scene();
        this.scene.fog = new Fog(0xcccccc, 0.1, 30);
        this.Animations = new LighterAnimations(this);
        this.setupCamera();
        // this.setup.controls();
    }
    setupCamera(){
        this.camera     = new PerspectiveCamera(60, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 10);
        this.camera.position.set(0.03, 0.15, 0.40);
        this.camera.rotation.set(0, 0, 0);
    }
    async loadThumbnail(name, GoldFlag){
        return new Promise(async function(resolve, reject){
            
            if(this.scene != null){
                SPLINT.ResourceManager.textures.lighter_engraving_thumbnail_add.then(async function(texture){    
                    this.thumbnail.lighter1 = new LighterThumbnail(this, "lighter");
                    this.thumbnail.lighter1.loadThumbnailMaterial(texture, 0xe8b000);  
                    this.thumbnail.lighter2 = new LighterThumbnail(this, "lighter2");
                    this.thumbnail.lighter2.loadThumbnailMaterial(texture, 0xc0c0c0);
                    resolve(true)
                }.bind(this));
            }
        }.bind(this));
    }
    async draw(){
        
        // if(SPLINT.resources.models.lighter_glb.sceneL == undefined){
            // this.scene.background = null;
            this.drawBackground();
            this.light();
            this.scene.add( this.camera );
        // }
        return new Promise(async function(resolve){
            let p1 = this.lighterModel_1.init();
                p1.then(async function(){
                        this.Animations.lighter_close.start(false, 0, "lighter");
                        this.Animations.lever_close.start(true, 0, "lighter");
                    let lighterGroupe1 = this.setup.getLighterGroupe(this.scene);
                        lighterGroupe1.rotation.z = 10 * (Math.PI / 180);
                        lighterGroupe1.rotationBase = lighterGroupe1.rotation.clone();
                }.bind(this));

            let p2 = this.lighterModel_2.init();
                p2.then(async function(){
                    this.Animations.lighter_close.start(false, 0, "lighter2");
                    this.Animations.lever_close.start(true, 0, "lighter2");
                    let lighterGroupe2 = this.setup.getLighterGroupe(this.scene, 'lighter2');
                        lighterGroupe2.rotation.z = 10 * (Math.PI / 180);
                        lighterGroupe2.position.x = 0.08;
                        lighterGroupe2.position.z = -0.07;
                        lighterGroupe2.rotationBase = lighterGroupe2.rotation.clone();
                }.bind(this));

            Promise.all([p1, p2]).then(async function(){
                await this.loadThumbnail();
            
                this.onFinishLoading();
                resolve("ok");
                return true;
            }.bind(this))
            // await this.loadThumbnail("lighter", true);

                // resolve('resolved');
            
        }.bind(this));
    }
    light(){
        LIGHT(this.scene);
    }
    animate(){
        if(this.renderer == null || this.scene == null){
            return;
        }
        this.render();
        this.AnimationMixer.tick();
    }
    render(){
        if(this.renderer == null || this.scene == null){
            return;
        }
        this.renderer.render(this.scene, this.camera);
        this.context.clearRect(0, 0, this.canvas.parentNode.clientWidth*2, this.canvas.parentNode.clientHeight*2);
        let domE = this.renderer.domElement;
        this.context.drawImage(domE, 0, 0, domE.width, domE.height, 0, 0, this.canvas.width, this.canvas.height);
    }
    async drawBackground(){

        this.materials.chrome = MaterialsLighterGeneral.chrome(this);
        this.materials.chrome.needsUpdate = true;
        let plane = SPLINT.object.Plane(180, 1600, 1, 1);
        plane.get().geometry.translate(0, 799, 0);
        // plane.position(0, 0, -15);
            plane.rotate(90, 0, 0);
            plane.plane.material = MATERIALS.other.shadowCatcher();
            plane.plane.receiveShadow = true;
        this.scene.add(plane.plane);
    }
    events(){
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
            this.renderer.setPixelRatio( window.devicePixelRatio * 2);
        } else {
            this.renderer.setPixelRatio( window.devicePixelRatio * 2);
        }
        this.renderer.setSize( this.canvas.parentNode.clientWidth * 1, this.canvas.parentNode.clientHeight * 1, false);
        this.camera.aspect = this.canvas.parentNode.clientWidth / this.canvas.parentNode.clientHeight;
        this.camera.updateProjectionMatrix();
        this.render();
    }
}