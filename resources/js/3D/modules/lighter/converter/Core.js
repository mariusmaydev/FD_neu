
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
                if(object.material.name.includes("body")){
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
    stopAnimationLoop(){
        this.AnimationLoopActive = false;
    }
    async animate(){
        if(this.renderer.domElement.width > 0){
            this.render();
        } else {
            requestAnimationFrame(this.animate.bind(this));
        }
    }
    async render(){
        if(this.renderer == null || this.scene == null){
            return;
        }
        this.renderer.render(this.scene, this.camera);
    }
    init(){
        this.setup.renderer(true, this.canvas);
        this.setup.scene("scene");
        this.Animations = new LighterAnimations(this);
        this.compressedAnimations = new CompressedAnimations(this);
        this.setupCamera();
    }
    remove(){
        this.AnimationMixer.stop();
        this.renderer.renderLists.dispose()
        this.renderer.forceContextLoss();
        this.scene = null;

    }
    setupCamera(){
        this.camera     = new THREE.PerspectiveCamera(24, this.canvas.parentNode.clientWidth/this.canvas.parentNode.clientHeight, 0.1, 100);
        this.camera.position.set(0, 0.135, 0.97);
        this.camera.zoom = 1;
        this.camera.updateProjectionMatrix();
    }
    async onFinishLoading(){
        SPLINT.Events.onLoadingComplete.dispatch()
        this.canvas.parentElement.parentElement.parentElement.setAttribute("loaded", true);
        this.canvas.setAttribute("loaded", true);

        this.canvas.Storage = new Object();
        this.canvas.Storage.type = "loaded";
        this.canvas.Storage.value = "value";

        this.canvas.dispatchEvent(SPLINT_EVENTS.toCommonJS);
        this.render();
    }
    async drawBackground(){
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
            this.renderer.setPixelRatio( window.devicePixelRatio * 2);
            this.renderer.setSize( parentSize.width /2, parentSize.height /2, false);
        } else {
            this.renderer.setPixelRatio( window.devicePixelRatio * 2);
            this.renderer.setSize( parentSize.width, parentSize.height, false);
        }
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
