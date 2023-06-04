import * as THREE from 'threeJS';
import SPLINT from 'SPLINT';
import * as MATERIALS from '../../assets/materials/materials.js';
import LIGHT from './light.js';
import LighterAnimations from '../animations.js';
import SETUP from '../setup.js';
import MODEL from '../model.js';
import SRC from '../../assets/Helper.js';

export class draw {
    static get(canvas){
        return new draw(canvas);
    }
    constructor(canvas){
        this.id = "Lighter3D_P_";
        this.canvas = canvas;
        this.context = null;
        this.setup = new SETUP(this);
        this.loaded = false;
        this.loadedTexture = false;
        SPLINT.R_promise.then(async function(){
            this.init();
            await this.draw();
            this.loaded = true;
            // this.events();
            
            // this.mouseHandler.onMove = function(event){
            //     if(this.mouseHandler.mouseDown){
            //         this.renderer.setAnimationLoop( function(){
            //            this.renderer.render( this.scene, this.camera );
            //         }.bind(this));
            //         // MODEL._rotate(SETUP.getLighterGroupe(this.scene), 0, 0, this.mouseHandler.dX);
            //     } else {
            //         this.renderer.setAnimationLoop( null);
            //     }
            // }.bind(this);
            // this.loaded.then(function(){
            //     // this.onFinishLoading();
            // }.bind(this));
        }.bind(this));

    }
    remove(){
        this.onResize = function(){};
        this.AnimationMixer.stop();
        // this.AnimationMixer = null;
        // this.renderer.renderLists.dispose()
        // this.renderer.forceContextLoss();
        // this.renderer = null;
        // this.scene = null;
        this.loaded = false;

    }
    async onFinishLoading(name){
        if(this.scene != null){
            this.animate();        
            SPLINT.Events.onLoadingComplete.dispatch();
        }
    }
    init(){
        this.setup.renderer(true);
        this.setup.scene();
        this.scene.fog = new THREE.Fog(0xcccccc, 0.1, 30);
        // this.mouseHandler = SPLINT.MouseHandler( this.canvas );
        this.Animations = new LighterAnimations(this);
        this.renderer.toneMappingExposure = 1;
        this.setupCamera();
        // this.setup.controls();
    }
    setupCamera(){
        this.camera     = new THREE.PerspectiveCamera(60, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.01, 10);
        this.camera.position.set(0.03, 0.15, 0.40);
        this.camera.rotation.set(0, 0, 0);
    }
    async loadThumbnail(name, GoldFlag){
        if(this.loadedTexture == true){
            return;
        }
        this.loadedTexture = true;
        this.thumbnailSRC = "fd/" + SRC().lighter.engraving.thumbnail_add
        if(this.thumbnailSRC != null){
            this.thumbnailSRC = SPLINT.texture.loadFromRoot(this.thumbnailSRC);
            this.thumbnailSRC.then(async function(tex){
                if(this.scene != null){
                    MODEL.getThumbnail(this.setup.getLighterGroupe(this.scene, 'lighter'), this, tex, "gold", 0xe8b000, !GoldFlag);
                    MODEL.getThumbnail(this.setup.getLighterGroupe(this.scene, 'lighter2'), this, tex, "chrome", 0xc0c0c0, !GoldFlag);
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
        }
        return true;
    }
    async draw(){
        
        // if(SPLINT.resources.models.lighter_glb.sceneL == undefined){
            // this.scene.background = null;
            this.drawBackground();
            this.light();
            this.scene.add( this.camera );
        // }
        return new Promise(async function(resolve){
            await MODEL.init(this, "lighter");
            this.Animations.lighter_close.start(false, 0, "lighter");
            this.Animations.lever_close.start(true, 0, "lighter");
            await MODEL.init(this, "lighter2");
            this.Animations.lighter_close.start(false, 0, "lighter2");
            this.Animations.lever_close.start(true, 0, "lighter2");
            let lighterGroupe1 = this.setup.getLighterGroupe(this.scene);
                lighterGroupe1.rotation.z = 10 * (Math.PI / 180);
                lighterGroupe1.rotationBase = lighterGroupe1.rotation.clone();

                resolve('resolved');
            let lighterGroupe2 = this.setup.getLighterGroupe(this.scene, 'lighter2');
                lighterGroupe2.rotation.z = 10 * (Math.PI / 180);
                lighterGroupe2.position.x = 0.08;
                lighterGroupe2.position.z = -0.07;
                lighterGroupe2.rotationBase = lighterGroupe2.rotation.clone();
            
            resolve("ok");
            this.onFinishLoading();
            
            return true;
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
    drawBackground(){
        let plane = SPLINT.object.Plane(180, 1600, 1, 1);
        plane.get().geometry.translate(0, 799, 0);
        // plane.position(0, 0, -15);
            plane.rotate(90, 0, 0);
            plane.plane.material = MATERIALS.other.shadowCatcher();
            plane.plane.receiveShadow = true;
        this.scene.add(plane.plane);
    }
    events(){
        // this.setup.events.onResizeInit();
        let flag = true;
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
    onResize(){
        let a = this.canvas.parentNode.clientWidth;
        let b = this.canvas.parentNode.clientHeight;
        this.canvas.width = a * 2 ;
        this.canvas.height = b * 2 ;
        this.canvas.style.width = a + "px";
        this.canvas.style.height = b + "px";
        this.renderer.setPixelRatio( window.devicePixelRatio * 1.5);
        this.renderer.setSize( this.canvas.parentNode.clientWidth * 2, this.canvas.parentNode.clientHeight * 2);
        this.camera.aspect = this.canvas.parentNode.clientWidth / this.canvas.parentNode.clientHeight;
        this.camera.updateProjectionMatrix();
        this.render();
    }
}