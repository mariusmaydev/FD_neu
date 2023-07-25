// import * as THREE from 'three';
import SPLINT from 'SPLINT';
import * as THC from "@THREE_ROOT_DIR/src/constants.js";
import {
    Scene,
    WebGLRenderer
} from 'three';
// import { Scene } from "@THREE_ROOT_DIR/src/scenes/Scene.js";
// import { WebGLRenderer } from "@THREE_ROOT_DIR/src/renderers/WebGLRenderer.js";
import { OrbitControls } from '@THREE_MODULES_DIR/controls/OrbitControls.js';
import MODEL from './model.js';

export default class setup {
    static RENDERER = null;
    constructor(instance) {
        this.inst = instance;
        this.events = new events(this, this.inst);
        this.inst.LighterGroupe = new Object();
    }
    renderer(newFlag = false){
            let canvas = this.inst.canvas;
            let a = this.inst.canvas.parentNode.clientWidth;
            let b = this.inst.canvas.parentNode.clientHeight;
            this.inst.canvas.width = a * 2;
            this.inst.canvas.height = b * 2;
            this.inst.canvas.style.width = (a) + "px";
            this.inst.canvas.style.height = (b) + "px";
        if(setup.RENDERER == null || newFlag){
            this.inst.renderer   = new WebGLRenderer({antialias: true, alpha: true});
            this.inst.renderer.shadowMap.enabled = true
            this.inst.renderer.shadowMap.type = THC.VSMShadowMap
            this.inst.renderer.shadowMap.soft = true;
            this.inst.renderer.shadowMap.needsUpdate = true;
            // this.inst.renderer.gammaFactor = 0.5;
            // this.inst.renderer.outputEncoding = THREE.sRGBEncoding;
            this.inst.renderer.setPixelRatio( window.devicePixelRatio * 1);
            this.inst.renderer.setSize( this.inst.canvas.parentNode.clientWidth * 2, this.inst.canvas.parentNode.clientHeight * 2);

            this.inst.renderer.gammaOutput = false;
            this.inst.renderer.gammaInput = true;
            this.inst.renderer.antialias = true;
            this.inst.renderer.alpha = true;
            this.inst.renderer.physicallyCorrectLights = true;
            this.inst.renderer.setClearColor(0x000000, 0);
            this.inst.renderer.autoClear = true;
            if(newFlag == false){
                setup.RENDERER = this.inst.renderer;
            }
        } else {
            this.inst.renderer = setup.RENDERER;
        }
        this.inst.context = this.inst.canvas.getContext("2d");
    }
    scene(sceneName = "scene"){
        // if(SPLINT.resources.models.lighter_glb[sceneName] == undefined){
            this.inst.scene      = new Scene();
        // } else {
        //     this.inst.scene = SPLINT.resources.models.lighter_glb[sceneName].clone();
        // }
    }
    controls(){
        this.inst.controls   = new OrbitControls( this.inst.camera, this.inst.canvas );
        this.inst.controls.enableDamping     = false;   //damping 
        this.inst.controls.dampingFactor     = 0.5;   //damping inertia
        this.inst.controls.enableZoom        = true;      //Zooming
        this.inst.controls.autoRotate        = false;       // enable rotation
        // this.controls.enablePan = true; // enable panning
        // this.controls.minPolarAngle     = Math.PI / 2;
        // this.controls.maxPolarAngle     = Math.PI / 2;
        this.inst.controls.update();
    }
    async draw(){
        this.inst.drawBackground();
        this.inst.light();
        this.inst.scene.add( this.inst.camera );
        return new Promise(async function(resolve){
            await MODEL.init(this.inst);
            resolve('resolved');
            this.inst.onFinishLoading();
        }.bind(this));
    }
    getLighterGroupe(scene = this.inst.scene, name = 'lighter'){
        if(this.inst.LighterGroupe[name] == undefined){
            this.inst.LighterGroupe[name] = SPLINT.Utils.getObjByKey_Value(scene.children, "name", name);
        }
        return this.inst.LighterGroupe[name];
    }
    static getGroupe(scene, name = 'lighter'){
        return SPLINT.Utils.getObjByKey_Value(scene.children, "name", name);
    }
} 

class events {
    static {
        window.addEventListener('resize', function(){
            let scenes = window.SPLINT.threeJS.scenes;
            for(const sc of scenes){
                sc.onResize();
            }
        }, true);
    }
    constructor(inst_setup, inst_core){
        this.inst_setup = inst_setup;
        this.inst_core = inst_core;
    }
}