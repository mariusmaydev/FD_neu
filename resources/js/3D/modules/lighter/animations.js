import SPLINT from 'SPLINT';
import * as THREE from '@THREE';
// THREE.THREE.Vector3
// import { THREE.Vector3 } from "@THREE_ROOT_DIR/src/math/THREE.Vector3.js";
// import { THREE.Vector3 } from "three";


export default class LighterAnimations {
    constructor(instance) {
        this.instance = instance;
        this.scene = instance.scene;
        this.init();
        this.define();
    }
    init(){
        this.instance.AnimationMixer = new SPLINT.AnimationMixer(this.instance);
    }
    define(){
        this.lighter_turn_Back = this.#getAnimation(0.3);
        this.lighter_turn_Back.onStart = function(model, name = 'lighter'){
            return this.#getGroupe(model, name);
        }.bind(this);
        this.lighter_turn_Back.onTick = function(model, progress, groupe, base ,amount){
            let f = SPLINT.AnimationFX.ease(progress, 1, "out");
            let d = (f / 100) * amount;
            groupe.rotation.z = base - d;
        }.bind(this);
        this.lighter_turn_Back.onStop = function(a,b,c,f){
            this.progress = 0;
            f[2]();
        }

        this.lighterRotate = this.#getAnimation(0.5);
        this.lighterRotate.onStart = function(model, name = 'lighter'){
            // console.dir(model);
            let groupe = this.#getGroupe(model, name);
            groupe.rotationLast = groupe.rotation.clone();
            groupe.rotation_range = new THREE.Vector3();
            groupe.rotation_range.x = parseFloat(groupe.rotationBase.x) - parseFloat(groupe.rotationLast.x);
            groupe.rotation_range.y = parseFloat(groupe.rotationBase.y) - parseFloat(groupe.rotationLast.y);
            groupe.rotation_range.z = parseFloat(groupe.rotationBase.z) - parseFloat(groupe.rotationLast.z);
            return groupe;
        }.bind(this);
        this.lighterRotate.onTick = function(model, progress, groupe, rot = null, offset = false){
            // console.log(arguments);
            let f = SPLINT.AnimationFX.ease(progress, 2, "in-out");
            let d = (f / 100);
                if(rot != null){
                    if(offset){
                        groupe.rotation.x = groupe.rotationLast.x + (rot.x * d) * (Math.PI / 180);;
                        groupe.rotation.y = groupe.rotationLast.y + (rot.y * d) * (Math.PI / 180);;
                        groupe.rotation.z = groupe.rotationLast.z + (rot.z * d) * (Math.PI / 180);;
                    } else {
                        groupe.rotation.x = groupe.rotationLast.x + (groupe.rotation_range.x * d);
                        groupe.rotation.y = groupe.rotationLast.y + (groupe.rotation_range.y * d);
                        groupe.rotation.z = groupe.rotationLast.z + (groupe.rotation_range.z * d);
                    }
                }
            }
        this.cameraToFOV = this.#getAnimation(0.5);
        this.cameraToFOV.onStart = function(model, name = 'lighter'){
            // console.dir(model);
            let groupe = this.#getGroupe(model, "camera");
            console.dir(groupe)
            groupe.FOVLast = groupe.fov;
            groupe.FOV_range = parseFloat(groupe.FOVBase) - parseFloat(groupe.FOVLast);
            return groupe;
        }.bind(this);
        this.cameraToFOV.onTick = function(model, progress, groupe, value = null, offset = false){
            // console.log(arguments);
            let f = SPLINT.AnimationFX.ease(progress, 2, "in-out");
            let d = (f / 100);
                if(value != null){
                    if(offset){
                        groupe.fov = groupe.FOVLast + (value * d)
                    } else {
                        groupe.fov = groupe.FOVLast + (groupe.FOV_range * d)
                    }
                }
                groupe.updateProjectionMatrix();
            }

        this.cameraTo = this.#getAnimation(0.5);
        this.cameraTo.onStart = function(model, name = 'lighter'){
            let groupe = this.#getGroupe(model, "camera");
            groupe.positionLast = groupe.position.clone();
            groupe.position_range = new THREE.Vector3();
            groupe.position_range.x = parseFloat(groupe.positionBase.x) - parseFloat(groupe.positionLast.x);
            groupe.position_range.y = parseFloat(groupe.positionBase.y) - parseFloat(groupe.positionLast.y);
            groupe.position_range.z = parseFloat(groupe.positionBase.z) - parseFloat(groupe.positionLast.z);
            return groupe;
        }.bind(this);
        this.cameraTo.onTick = function(model, progress, groupe, trans = null, offset = false){
            // console.log(arguments);
            let f = SPLINT.AnimationFX.ease(progress, 2, "in-out");
            let d = (f / 100);
                if(trans != null){
                    if(offset){
                        groupe.position.x = groupe.positionLast.x + (trans.x * d);
                        groupe.position.y = groupe.positionLast.y + (trans.y * d);
                        groupe.position.z = groupe.positionLast.z + (trans.z * d);
                    } else {
                        groupe.position.x = groupe.positionLast.x + (groupe.position_range.x * d);
                        groupe.position.y = groupe.positionLast.y + (groupe.position_range.y * d);
                        groupe.position.z = groupe.positionLast.z + (groupe.position_range.z * d);
                    }
                }
            }

        this.lighter_color_double_close = this.#getAnimation(0.4);
        this.lighter_color_double_close.onStart = function(model, name, inst ){
            inst.progress = 100;
            let obj = [];
                obj[0] = this.#getGroupe(model, 'lighter');
                obj[1] = this.#getGroupe(model, 'lighter2');
            return obj;
        }.bind(this);
        this.lighter_color_double_close.onTick = function(model, progress, g){
            let a = SPLINT.AnimationFX.ease(progress, 2, "in-out") * 0.01;
            if(a < 0 || a > 1){
                return;
            } else {
                g[0].position.x = -0.05*a;
                g[1].position.x = -1.24 +(1.32*a);
            }
            
        }.bind(this);

        this.lighter_color_double_start = this.#getAnimation(0.3);
        this.lighter_color_double_start.onStart = function(model, name, inst){
            inst.progress = 0;
            let obj = [];
                obj[0] = this.#getGroupe(model, 'lighter');
                obj[1] = this.#getGroupe(model, 'lighter2');
            return obj;
        }.bind(this);
        this.lighter_color_double_start.onTick = function(model, progress, g){
            // let f = SPLINT.AnimationFX.ease(progress, 1, "in-out");
            // let d = 0.5 - (f / 100);
            // g[0].rotation.z = (30 * d) * (Math.PI / 180);
            let a = SPLINT.AnimationFX.ease(progress, 2, "in-out") * 0.01;

            if(a < 0 || a > 1){
                return;
            } else {
                g[0].position.x = -0.05*a;
                g[1].position.x = +1 -(0.92*a);
            }
            
        }.bind(this);


        this.lighter_color = this.#getAnimation(0.1);
        this.lighter_color.onStart = function(model, name = 'lighter'){
            let groupe = this.#getGroupe(model, name);
            let obj = new Object();
                obj.gold        =  this.#getGroupe(groupe.children[0].children[0], "gold");
                obj.gold1       =  this.#getGroupe(groupe.children[0].children[0], "gold1");
                obj.chrome      =  this.#getGroupe(groupe.children[0].children[0], "chrome");
                obj.chrome1     =  this.#getGroupe(groupe.children[0].children[0], "chrome1");

                obj.gold_1      =  this.#getGroupe(groupe.children[1].children[0], "gold");
                obj.gold1_1     =  this.#getGroupe(groupe.children[1].children[0], "gold1");
                obj.chrome_1    =  this.#getGroupe(groupe.children[1].children[0], "chrome");
                obj.chrome1_1   =  this.#getGroupe(groupe.children[1].children[0], "chrome1");
            return obj;
        }.bind(this);
        this.lighter_color.onTick = function(model, progress, groupe){
            let a = SPLINT.AnimationFX.ease(progress, 2, "in-out");
            // let b = SPLINT.AnimationFX.ease(progress, 2, "in");
            groupe.chrome.material.opacity = (a)/100;
            if(groupe.chrome1 != undefined){
                groupe.chrome1.material.opacity = (a)/100;
            }

            groupe.gold.material.opacity = (100-a)/100;
            if(groupe.gold1 != undefined){
                groupe.gold1.material.opacity = (100-a)/100;
            }

            groupe.chrome_1.material.opacity = (a)/100;
            if(groupe.chrome1_1 != undefined){
                groupe.chrome1_1.material.opacity = (a)/100;
            }

            groupe.gold_1.material.opacity = (100-a)/100;
            if(groupe.gold1_1 != undefined){
                groupe.gold1_1.material.opacity = (100-a)/100;
            }
        }.bind(this);
        
        this.lighter_engraving = this.#getAnimation(0.3);
        this.lighter_engraving.onStart = function(model, name = 'lighter'){
            return this.#getGroupe(model, name);
        }.bind(this);
        this.lighter_engraving.onTick = function(model, progress, groupe){
            // groupe.rotation.z = (10 * (progress / 100)) * (Math.PI / 180);
            let f = SPLINT.AnimationFX.ease(progress, 2, "in-out");
            let d = (f / 100);
            this.instance.camera.fov = 45 + (5 * (d));
            groupe.rotation.y = (25 * d) * (Math.PI / 180);
            groupe.rotation.x = Math.PI / 2 - (30 * d) * (Math.PI / 180);
            groupe.position.y = (0.05 * d);
            // groupe.position.z = (3.2 * d);
            groupe.position.x = (0.01 * d);
            // console.log(10 + (60 * d))(-0.15, 0.18, 1)
            this.instance.camera.position.z = 1 - (0.65 * d);
            this.instance.camera.position.y = 0.18 + (0.09 * d);
            this.instance.camera.rotation.x = -0.05 - (0.1 * d);
            // this.instance.camera.position.y = 0.35 + (0.17 * d);
            this.instance.camera.updateProjectionMatrix();
        }.bind(this);

        this.lighter_engraving_mobile = this.#getAnimation(0.3);
        this.lighter_engraving_mobile.onStart = function(model, name = 'lighter'){
            return this.#getGroupe(model, name);
        }.bind(this);
        this.lighter_engraving_mobile.onTick = function(model, progress, groupe){
            // groupe.rotation.z = (10 * (progress / 100)) * (Math.PI / 180);
            let f = SPLINT.AnimationFX.ease(progress, 2, "in-out");
            let d = (f / 100);
            // this.instance.camera.fov = 10 + (5 * (d));
            groupe.rotation.y = (25 * d) * (Math.PI / 180);
            groupe.rotation.x = Math.PI / 2 - (40 * d) * (Math.PI / 180);
            groupe.position.y = (0.04 * d);
            groupe.position.z = (0.4 * d);
            groupe.position.x = (0.1 * d);
            // console.log(10 + (60 * d))
            this.instance.camera.fov = 60 + (20 * d);
            // this.instance.camera.zoom = 1.2 + (0.5 * d);
            // this.instance.camera.position.z = 4 - (3.75 * d);
            // this.instance.camera.position.y = 0.4 - (0.15 * d);
            // this.instance.camera.rotation.x = -0.05 - (0.1 * d);
            // this.instance.camera.position.y = 0.35 + (0.17 * d);
            this.instance.camera.updateProjectionMatrix();
        }.bind(this);


        this.lighter_explosion_split = this.#getAnimation(0.2);
        this.lighter_explosion_split.onStart = function(model, name = 'lighter'){
            let groupe = this.#getGroupe(model, name);
            let obj = new Object();
                obj.box_top = this.#getGroupe(groupe, "oberes_teil1");
                obj.box_bottom = this.#getGroupe(groupe, "unteres_teil1");
                obj.inner = this.#getGroupe(groupe, "Innenleben11");
                obj.bolt_wheel = this.#getGroupe(groupe, "Bolzen_Rad1");
                obj.bolt_hinge = this.#getGroupe(groupe, "Bolzen_Scharnier2");
                obj.stone_base1 = this.#getGroupe(groupe, "Feuersteinauflage1");
                obj.stone_base2 = this.#getGroupe(groupe, "Feuersteinhalter1");
                obj.wheel = this.#getGroupe(groupe, "Rad1");
                obj.screw = this.#getGroupe(groupe, "Schraube1");
                obj.stick = this.#getGroupe(groupe, "stab1");
                obj.connection_top = this.#getGroupe(groupe, "verbindung_oben1");
                obj.connection_bottom = this.#getGroupe(groupe, "verbindung_unten1");
                obj.feather = this.#getGroupe(groupe, "Feder1");
                obj.stone = this.#getGroupe(groupe, "Feuerstein1");
                obj.hinge = this.#getGroupe(groupe, "Scharnier1");
                obj.wick = this.#getGroupe(groupe, "docht1");
            return obj;
        }.bind(this);
        this.lighter_explosion_split.onTick = function(model, progress, groupe){
            let f = SPLINT.AnimationFX.ease(progress, 2, "in-out");
            let d = (f / 100);
            groupe.inner.position.z = -0.001                    -(0.088 * d);
            groupe.bolt_wheel.position.z = -0.0425              -(0.088 * d);
            groupe.bolt_hinge.position.z = -0.03805             -(0.088 * d);
            groupe.hinge.position.z = -0.038                    -(0.088 * d);
            groupe.wheel.position.z = -0.0425                   -(0.088 * d);
            groupe.stone_base1.position.z = -0.0357             -(0.088 * d);

            groupe.wick.position.z = -0.003                     -(0.055 * d);
            groupe.feather.position.z = -0.007                  -(0.037 * d);
            groupe.screw.position.z = -0.001                    -(0.032 * d);
            groupe.stone_base2.position.z = -0.0327             -(0.0435 * d);
            groupe.stone.position.z = -0.03725                  -(0.045 * d);

            groupe.box_top.position.z = -0.04817                +(0.01 * d);
            groupe.box_bottom.position.z =                      +(0.01 * d);
            groupe.connection_top.position.z = -0.02335         +(0.01 * d);
            groupe.connection_bottom.position.z = -0.0208       +(0.01 * d);

            groupe.stick.position.z = -0.0343      +(0.01 * d);
        }.bind(this);


        this.lighter_smooth_turn = this.#getAnimation(60);
        this.lighter_smooth_turn.onStart = function(model, name = 'lighter'){
            return this.#getGroupe(model, name);
        }.bind(this);
        this.lighter_smooth_turn.onTick = function(model, progress, groupe){
            // groupe.rotation.z = (10 * (progress / 100)) * (Math.PI / 180);
            let f = SPLINT.AnimationFX.ease(progress, 1, "in-out");
            let d = 0.5 - (f / 100);
            groupe.rotation.z = (30 * d) * (Math.PI / 180);
            // groupe.rotation.x = Math.PI / 2 - (40 * d) * (Math.PI / 180);
            // groupe.position.y = (0.25 * d);
            // groupe.position.z = -(0.4 * d);
            // groupe.position.x = (0.1 * d);
            // this.instance.camera.position.z = 3.5 + (1 * d);
            // this.instance.camera.position.y = 0.35 + (0.17 * d);
            // this.instance.camera.updateProjectionMatrix();
        }.bind(this);

        this.lighter_explosion_turn = this.#getAnimation(0.2);
        this.lighter_explosion_turn.onStart = function(model, name = 'lighter'){
            return this.#getGroupe(model, name);
        }.bind(this);
        this.lighter_explosion_turn.onTick = function(model, progress, groupe){
            // groupe.rotation.z = (10 * (progress / 100)) * (Math.PI / 180);
            let f = SPLINT.AnimationFX.ease(progress, 2, "in-out");
            let d = (f / 100);
            groupe.rotation.y = (65 * d) * (Math.PI / 180);
            groupe.rotation.x = Math.PI / 2 - (40 * d) * (Math.PI / 180);
            groupe.position.y = (0.3 * d);
            // groupe.position.z = -(0.4 * d);(-0.15, 0.18, 1);
            groupe.position.x = (0.15 * d);
            this.instance.camera.zoom = 1.2 + (1.5 * d);
            this.instance.camera.fov = 45 + (10 * d);
            this.instance.camera.position.z = 1 + (0.5 * d);
            this.instance.camera.position.y = 0.18 + (0.15 * d);
            this.instance.camera.rotation.x = -0.05 + (0.05 * d);
            this.instance.camera.updateProjectionMatrix();
        }.bind(this);

        // this.lighter_explosion_turn_mobile = this.#getAnimation(0.2);
        // this.lighter_explosion_turn_mobile.onStart = function(model, name = 'lighter'){
        //     return this.#getGroupe(model, name);
        // }.bind(this);
        // this.lighter_explosion_turn_mobile.onTick = function(model, progress, groupe){
        //     // groupe.rotation.z = (10 * (progress / 100)) * (Math.PI / 180);
        //     let f = SPLINT.AnimationFX.ease(progress, 2, "in-out");
        //     let d = (f / 100);
        //     groupe.rotation.y = (25 * d) * (Math.PI / 180);
        //     groupe.rotation.x = Math.PI / 2 - (20 * d) * (Math.PI / 180);
        //     groupe.rotation.z = 0.2618 - (30 * d) * (Math.PI / 180);
        //     groupe.position.y = (0.15 * d);
        //     // groupe.position.z = -(0.4 * d);
        //     groupe.position.x = (0.125 * d);
        //     this.instance.camera.zoom = 1.4;
        //     // this.instance.camera.fov = 10 + (10 * d);
        //     this.instance.camera.position.z = 3.5 + (2.5 * d);
        //     this.instance.camera.position.y = 0.35 + (0.5 * d);
        //     this.instance.camera.rotation.x = -0.05 - (0.02 * d);
        //     this.instance.camera.updateProjectionMatrix();
        // }.bind(this);
        this.lighter_explosion_turn_mobile = this.#getAnimation(0.2);
        this.lighter_explosion_turn_mobile.onStart = function(model, name = 'lighter'){
            let groupe = this.#getGroupe(model, name);
            // this.instance.camera.positionLast = this.instance.camera.position.clone();
            // this.instance.camera.position_range = new THREE.THREE.Vector3();
            // this.instance.camera.position_range.x = parseFloat(this.instance.camera.positionBase.x) - parseFloat(this.instance.camera.positionLast.x);
            // this.instance.camera.position_range.y = parseFloat(this.instance.camera.positionBase.y) - parseFloat(this.instance.camera.positionLast.y);
            // this.instance.camera.position_range.z = parseFloat(this.instance.camera.positionBase.z) - parseFloat(this.instance.camera.positionLast.z);
            return groupe;
        }.bind(this);
        this.lighter_explosion_turn_mobile.onTick = function(model, progress, groupe){
            // groupe.rotation.z = (10 * (progress / 100)) * (Math.PI / 180);
            let f = SPLINT.AnimationFX.ease(progress, 2, "in-out");
            let d = (f / 100);
            groupe.rotation.y = (25 * d) * (Math.PI / 180);
            groupe.rotation.x = Math.PI / 2 - (20 * d) * (Math.PI / 180);
            groupe.rotation.z = 0.2618 - (20 * d) * (Math.PI / 180);
            groupe.position.y = (0.13 * d);
            // groupe.position.z = -(0.4 * d);
            groupe.position.x = (0.125 * d);
            // this.instance.camera.zoom = 1.5
            // this.instance.camera.fov = 10 + (5 * d);
            // this.instance.camera.position.z = 4 - (3 * d);
            // this.instance.camera.position.y = 0.4 - (0.1 * d);
            // let h = this.instance.camera;
            // this.instance.camera.position.x = h.positionLast.x + ((h.position_range.x) * d);
            // // this.instance.camera.rotation.x = -0.05 + (0.1 * d);
            // this.instance.camera.updateProjectionMatrix();
        }.bind(this);



        this.lighter_flame = this.#getAnimation(999999);
        this.lighter_flame.onStart = function(model, name = 'lighter'){
            let g = this.#getGroupe(model, name);
            let flame = this.#getGroupe(this.#getGroupe(g, 'docht1').children[0], 'flame');
                flame.visible = true;
            return flame;
        }.bind(this);
        this.lighter_flame.onTick = function(model, progress, groupe){
            groupe.material.uniforms.time.value = progress * 19999;
        }
        this.lighter_flame.onStop = function(progress, name, groupe){
            if(groupe != null){
                groupe.visible = false;
                this.instance.render();
            }
        }.bind(this);



        this.lighter_zoom = this.#getAnimation(0.2);
        this.lighter_zoom.onStart = function(model, name = 'lighter'){
            return this.#getGroupe(model, name);
        }.bind(this);
        this.lighter_zoom.onTick = function(model, progress, groupe){
            let f = SPLINT.AnimationFX.ease(progress, 1, "in-out");
            let d = (f / 100) * 0.05
            this.instance.camera.zoom = 1 + d;
            this.instance.camera.updateProjectionMatrix();
        }.bind(this);

        this.lighter_turn = this.#getAnimation(0.1);
        this.lighter_turn.onStart = function(model, name = 'lighter'){
            return this.#getGroupe(model, name);
        }.bind(this);
        this.lighter_turn.onTick = function(model, progress, groupe){
            groupe.rotation.z = (10 * (progress / 100)) * (Math.PI / 180);
        }
        this.lighter_open = this.#getAnimation(1);
        this.lighter_open.onStart = function(model, name = 'lighter'){
            return this.#getGroupe(model, name);
        }.bind(this);

        this.lighter_open.onTick = function(model, progress, groupe){
            let a =  360 - SPLINT.AnimationFX.easeOutBounce((progress) * 3.6, 0, 360, 360) * 0.45;
            let b = -(133.7648 +  a) * Math.PI / 180;
            groupe.children[0].children[0].rotation.z = b;
            groupe.children[10].children[0].rotation.x = -b;
        }

        this.lighter_close = this.#getAnimation(0.25);
        this.lighter_close.onStart = function(model, name = 'lighter'){
            return this.#getGroupe(model, name);
        }.bind(this);
        this.lighter_close.onTick = function(model, progress, groupe){
                let a =  SPLINT.AnimationFX.linear(progress * 3.6, false) * 0.45;
                let b = (-133.7648 +  a) * Math.PI / 180;//7648
                groupe.children[0].children[0].rotation.z = b;
                groupe.children[10].children[0].rotation.x = -b;
            }

        this.lever_close = this.#getAnimation(0.28);
        this.lever_close.onStart = function(model, name = 'lighter', inst){
            inst.progress = 100;
            return this.#getGroupe(model, name);
        }.bind(this);
        this.lever_close.onTick = function(model, progress, groupe){
                let a =  106.5-SPLINT.AnimationFX.linear_lever(progress * 3.6, false) * 0.3;
                let b = (-106.5 +  a) * Math.PI / 180;
                groupe.children[14].rotation.y = b;
            }

        this.lever_open = this.#getAnimation(0.5);
        this.lever_open.onStart = function(model, name = 'lighter', inst){
            inst.progress = 100;
            return this.#getGroupe(model, name);
        }.bind(this);
        this.lever_open.onTick = function(model, progress, groupe){
                let a =  106.5-SPLINT.AnimationFX.linear_lever(progress * 3.6) * 0.3;
                let b = (-106.5 +  a) * Math.PI / 180;
                groupe.children[14].rotation.y = b;
            }

        this.wheel_spinn = this.#getAnimation(0.5);
        this.wheel_spinn.onStart = function(model, name = 'lighter'){
            return this.#getGroupe(model, name);
        }.bind(this);
        this.wheel_spinn.onTick = function(model, progress, groupe){
            let f = SPLINT.AnimationFX.ease(progress, 2, "in-out");
            // let d = (f / 100);
                groupe.children[7].rotation.y = f;
            }
        this.instance.AnimationMixer.add(this.wheel_spinn);
        this.instance.AnimationMixer.add(this.lighter_open);
        this.instance.AnimationMixer.add(this.lighter_close);
        this.instance.AnimationMixer.add(this.lever_open);
        this.instance.AnimationMixer.add(this.lever_close);
        this.instance.AnimationMixer.add(this.lighter_turn);
        this.instance.AnimationMixer.add(this.lighter_explosion_turn);
        this.instance.AnimationMixer.add(this.lighter_explosion_split);
        this.instance.AnimationMixer.add(this.lighter_engraving);
        this.instance.AnimationMixer.add(this.lighter_engraving_mobile);
        this.instance.AnimationMixer.add(this.lighter_color);
        this.instance.AnimationMixer.add(this.lighter_color_double_start);
        this.instance.AnimationMixer.add(this.lighter_color_double_close);
        this.instance.AnimationMixer.add(this.lighterRotate);
        this.instance.AnimationMixer.add(this.cameraTo);
        this.instance.AnimationMixer.add(this.cameraToFOV);
        this.instance.AnimationMixer.add(this.lighter_explosion_turn_mobile);
        this.instance.AnimationMixer.add(this.lighter_flame);
        this.instance.AnimationMixer.add(this.lighter_smooth_turn);
        this.instance.AnimationMixer.add(this.lighter_turn_Back);
        this.instance.AnimationMixer.add(this.lighter_zoom);
    }
    #getAnimation(duration){
        return new SPLINT.Animation(this.scene, duration, this.instance.AnimationMixer);
    }
    #getGroupe(model, name = 'lighter'){
        return this.instance.setup.getLighterGroupe(model, name);
    }
}