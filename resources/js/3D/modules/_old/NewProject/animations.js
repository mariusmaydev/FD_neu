import SPLINT from 'SPLINT';
// import * as THREE from 'three';
import { Vector3 } from '@THREE_ROOT_DIR/src/math/Vector3.js';

export default class compressedNewProjectAnimations {
    constructor(inst){
        this.inst = inst;
        this.isExploded = false;
        this.isOpen = false;
        this.isEngraving = false;
        this.explosion_wasOpen = true;
        this.engraving_wasOpen = false;
        this.isGold = false;
        this.isFlame = false;
        this.doubleColorWasOpen = false;
        this.smoothTurn = false;
        this.turnBack_f = false;
    }
    toggleColor(){
        if(this.isGold){
            this.colorChrome();
        } else {
            this.colorGold();
        }
    }
    toggleLighterRotate(duration, delay, rot, offset = true){
        if(this.isOpen){
            rot = new Vector3(rot.x * (-1), rot.y * (-1), rot.z * (-1));
            this.lighterRotate(duration, delay, rot, offset);
        } else {
            this.lighterRotate(duration, delay, rot, offset);
        }
    }
    toggleCameraToFOV(duration, delay, value, offset = true){
        if(this.isOpen){
            // trans = new THREE.Vector3(trans.x * (-1), trans.y * (-1), trans.z * (-1));
            this.cameraToFOV(duration, delay, -value, offset);
        } else {
            this.cameraToFOV(duration, delay, value, offset);
        }
    }
    toggleCameraTo(duration, delay, trans, offset = true){
        if(this.isOpen){
            trans = new Vector3(trans.x * (-1), trans.y * (-1), trans.z * (-1));
            this.cameraTo(duration, delay, trans, offset);
        } else {
            this.cameraTo(duration, delay, trans, offset);
        }
    }
    toggleOpen(){
        if(this.isOpen){
            this.flameEx(function(){}, 200);
            this.close();
        } else {
            this.flameIgnite(function(){}, 200);
            this.open();
        }
    }
    toggleExplosion(callback = function(){}){
        if(this.isExploded){
            this.implosion(callback);
        } else {
            this.explosion(callback);
        }
    }
    delay(duration){
        return SPLINT.Utils.sleep(duration);
    }
    lighterRotate(duration, delay = 0, rotation = null, offset = true){
        return new Promise(async function(resolve, reject){
            // if(!this.smoothTurn){
                SPLINT.Utils.sleep(delay).then(async function(){
                    // await this.inst.Animations.cameraTo.start(true, duration, undefined, false, translation, rotation);
                    await this.inst.Animations.lighterRotate.start(true, duration, undefined, false, rotation, offset);
                    // this.smoothTurn = true;
                    resolve(true);
                }.bind(this));
            // } else {
                // resolve(true);
            // }
        }.bind(this));
    }
    cameraToFOV(duration, delay = 0, value = null, offset = true){
        return new Promise(async function(resolve, reject){
            // if(!this.smoothTurn){
                SPLINT.Utils.sleep(delay).then(async function(){
                    // await this.inst.Animations.cameraTo.start(true, duration, undefined, false, translation, rotation);
                    await this.inst.Animations.cameraToFOV.start(true, duration, undefined, false, value, offset);
                    // this.smoothTurn = true;
                    resolve(true);
                }.bind(this));
            // } else {
                // resolve(true);
            // }
        }.bind(this));
    }
    cameraTo(duration, delay = 0, translation = null, offset = true){
        return new Promise(async function(resolve, reject){
            // if(!this.smoothTurn){
                SPLINT.Utils.sleep(delay).then(async function(){
                    // await this.inst.Animations.cameraTo.start(true, duration, undefined, false, translation, rotation);
                    await this.inst.Animations.cameraTo.start(true, duration, undefined, false, translation, offset);
                    // this.smoothTurn = true;
                    resolve(true);
                }.bind(this));
            // } else {
                // resolve(true);
            // }
        }.bind(this));
    }
    turnBack(duration, delay = 0){
        return new Promise(async function(resolve, reject){
                SPLINT.Utils.sleep(delay).then(function(){
                    let lighter = this.inst.setup.getLighterGroupe(this.inst.scene, 'lighter');
                    let dif = lighter.rotation.z - lighter.rotationBase.z;
                    this.inst.Animations.lighter_turn_Back.start(true, duration, undefined, false, lighter.rotation.z, dif, function(){
                    }.bind(this));
                    resolve(true);
                }.bind(this));
        }.bind(this));
    }
    colorGold(callback = function(){}, duration){
        return new Promise(async function(resolve, reject){
            if(!this.isGold){
                this.inst.Animations.lighter_color.onStop = function(){
                    this.isGold = true;
                    callback(this.isGold);
                    resolve(this.isGold);
                }.bind(this);
                this.inst.Animations.lighter_color.start(true, duration);
            } else {
                resolve(this.isGold);
            }
        }.bind(this));
    }
    colorChrome(callback = function(){}, duration){
        return new Promise(async function(resolve, reject){
            if(this.isGold){
                this.inst.Animations.lighter_color.onStop = function(){
                    this.isGold = false;
                    callback(this.isGold);
                    resolve(this.isGold);
                }.bind(this);
                this.inst.Animations.lighter_color.start(false, duration);
            } else {
                resolve(this.isGold);
            }
        }.bind(this));
    }

    open(duration, expanded = true){
        return new Promise(async function(resolve, reject){
            if(!this.isOpen){
                this.inst.Animations.lighter_close.stop();
                this.inst.Animations.lever_close.stop();
                // this.inst.Animations.lighter_open.onStop = function(){
                    this.isOpen = true;
                //     resolve(this.isOpen);
                // }.bind(this);
                    if(expanded && SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
                        let translation = new Vector3(-0.08, +0.07, +0.3);
                        this.inst.Animations.cameraTo.start(true, duration, undefined, false, translation, true);
                        // this.inst.Animations.cameraToFOV.start(true, duration, undefined, false, 40, true);
                        let rot = new Vector3(0, 0, 10);
                        this.inst.Animations.lighterRotate.start(true, duration, undefined, false, rot, true);
                    }
                this.inst.Animations.lighter_open.start(true, duration);
                this.inst.Animations.lever_open.start(false, duration);
            
                resolve();
            } else {
                resolve(this.isOpen);
            }
        }.bind(this));
    }
    close(duration, expanded = true){
        return new Promise(async function(resolve, reject){
            if(this.isOpen){
                this.inst.Animations.lighter_open.stop();
                this.inst.Animations.lever_open.stop();
                // this.inst.Animations.lighter_close.onStop = function(){
                    this.isOpen = false;
                // }.bind(this);
                    if(expanded && SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
                        let translation = new Vector3(0.08, -0.07, -0.3);
                        this.inst.Animations.cameraTo.start(true, duration, undefined, false, translation, false);
                        // this.inst.Animations.cameraToFOV.start(true, duration, undefined, false, -40, false);
                        let rot = new Vector3(0, 0, -10);
                        this.inst.Animations.lighterRotate.start(true, duration, undefined, false, rot, false);
                    }
                this.inst.Animations.lighter_close.start(false, duration);
                this.inst.Animations.lever_close.start(true, duration);
                
                resolve(this.isOpen);
                // resolve(this.isOpen);
            } else {
                resolve(this.isOpen);
            }
        }.bind(this));
    }
    wheel(duration, delay = 0){
        SPLINT.Utils.sleep(delay).then(function(){
            this.inst.Animations.wheel_spinn.start(true, duration);
        }.bind(this));
    }
    explosion(callback = function(){}){
        return new Promise(async function(resolve, reject){
            if(!this.isExploded){
                if(!this.isOpen){
                    this.open(undefined, false);
                }
                let translation = new Vector3(0.01, 0.2, 0.35);
                this.inst.Animations.cameraTo.start(true, 0.2, undefined, false, translation, true);
                if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
                    this.inst.Animations.lighter_explosion_turn_mobile.onStop = function(){
                        this.inst.Animations.lighter_explosion_split.onStop = function(){
                            this.isExploded = true;
                            callback(this.isExploded);
                            resolve(this.isExploded);
                        }.bind(this);
                        this.inst.Animations.lighter_explosion_split.start();
                        this.isExploded = false;
                    }.bind(this);
                    this.inst.Animations.lighter_explosion_turn_mobile.start();
                } else {
                    this.inst.Animations.lighter_explosion_turn.onStop = function(){
                        this.inst.Animations.lighter_explosion_split.onStop = function(){
                            this.isExploded = true;
                            callback(this.isExploded);
                            resolve(this.isExploded);
                        }.bind(this);
                        this.inst.Animations.lighter_explosion_split.start();
                        this.isExploded = false;
                    }.bind(this);
                    this.inst.Animations.lighter_explosion_turn.start();
                }
            } else { 
                resolve(this.isExploded);
            }
        }.bind(this));
    }
    implosion(callback = function(){}){
        return new Promise(async function(resolve, reject){
            if(this.isExploded){
                if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
                    let translation = new Vector3(0.01, 0.2, 0.35);
                    this.inst.Animations.cameraTo.start(true, 0.2, undefined, false, translation, false);
                    this.inst.Animations.lighter_explosion_split.onStop = function(){
                        this.inst.Animations.lighter_explosion_turn_mobile.onStop = function(){
                            this.isExploded = false;
                            callback(this.isExploded);
                            resolve(this.isExploded);
                        }.bind(this);
                        this.inst.Animations.lighter_explosion_turn_mobile.start(false);
                        this.close(undefined, false);
                        this.isExploded = false;
                        this.inst.Animations.wheel_spinn.start();
                    }.bind(this);
                    this.inst.Animations.lighter_explosion_split.start(false);

                } else {
                    this.inst.Animations.lighter_explosion_split.onStop = function(){
                        this.inst.Animations.lighter_explosion_turn.onStop = function(){
                            this.isExploded = false;
                            callback(this.isExploded);
                            resolve(this.isExploded);
                        }.bind(this);
                        this.inst.Animations.lighter_explosion_turn.start(false);
                        this.close(undefined, false);
                        this.isExploded = false;
                        this.inst.Animations.wheel_spinn.start();
                    }.bind(this);
                    this.inst.Animations.lighter_explosion_split.start(false);
                }
            
            } else {
                resolve(this.isExploded);
            }
        }.bind(this));
    }
}