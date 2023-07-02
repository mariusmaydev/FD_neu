import SPLINT from 'SPLINT';
import * as THREE from 'three';

export default class compressedIndexAnimations {
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
    }
    toggleSmoothTurn(duration, delay = 0){
        if(this.smoothTurn){
            this.smoothTurnStop(duration, delay);
        } else {
            this.smoothTurnStart(duration, delay);
        }
    }
    toggleFlame(){
        if(this.isFlame){
            this.flameEx();
        } else {
            this.flameIgnite();
        }
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
            rot = new THREE.Vector3(rot.x * (-1), rot.y * (-1), rot.z * (-1));
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
            trans = new THREE.Vector3(trans.x * (-1), trans.y * (-1), trans.z * (-1));
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
    toggleEngraving(callback = function(){}, duration){
        if(this.isEngraving){
            return this.engravingOut(callback, duration);
        } else {
            return this.engravingIn(callback, duration);
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
    smoothTurnStart(duration, delay = 0){
        return new Promise(async function(resolve, reject){
            if(!this.smoothTurn){
                SPLINT.Utils.sleep(delay).then(function(){
                    this.inst.Animations.lighter_smooth_turn.start(true, duration, undefined, true);
                    this.smoothTurn = true;
                    resolve(true);
                }.bind(this));
            } else {
                resolve(true);
            }
        }.bind(this));
    }
    smoothTurnPause(){
        this.inst.Animations.lighter_smooth_turn.pause();
    }
    smoothTurnStop(delay = 0){
        return new Promise(async function(resolve, reject){
            if(this.smoothTurn){
                SPLINT.Utils.sleep(delay).then(function(){
                    this.inst.Animations.lighter_smooth_turn.stop();
                    this.smoothTurn = false;
                    resolve(true);
                }.bind(this));
            } else {
                resolve(true);
            }
        }.bind(this));
    }
    flameIgnite(callback = function(){}, delay = 0){
        return new Promise(async function(resolve, reject){
            if(!this.isFlame){
                this.isFlame = true;
                SPLINT.Utils.sleep(delay).then(function(){
                    this.inst.Animations.lighter_flame.start(true);
                    callback(this.isFlame);
                    resolve(this.isFlame);
                }.bind(this));
            } else {
                resolve(this.isFlame);
            }
        }.bind(this));
    }
    flameEx(callback = function(){}, delay = 0){
        return new Promise(async function(resolve, reject){
            if(this.isFlame){
                this.isFlame = false;
                SPLINT.Utils.sleep(delay).then(function(){
                    this.inst.Animations.lighter_flame.stop(true);
                    callback(this.isFlame);
                    resolve(this.isFlame);
                }.bind(this));
            } else {
                resolve(this.isFlame);
            }
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
    engravingIn(callback = function(){}, duration){
        return new Promise(async function(resolve, reject){
            if(!this.isEngraving){
                if(this.isOpen){
                    this.close(undefined, false);
                    this.engraving_wasOpen = true;
                } else {
                    this.engraving_wasOpen = false;
                }
                if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
                    this.inst.Animations.lighter_engraving_mobile.onStop = function(){
                        this.isEngraving = true;
                        callback(this.isEngraving);
                        resolve(this.isEngraving);
                    }.bind(this);
                    this.inst.Animations.lighter_engraving_mobile.start(true, duration);
                } else {
                    this.inst.Animations.lighter_engraving.onStop = function(){
                        this.isEngraving = true;
                        callback(this.isEngraving);
                        resolve(this.isEngraving);
                    }.bind(this);
                    this.inst.Animations.lighter_engraving.start(true, duration);

                }
            } else {
                resolve(this.isEngraving);
            }
        }.bind(this));
    }
    engravingOut(callback = function(){}, duration){
        return new Promise(async function(resolve, reject){
            if(this.isEngraving){
                if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
                    this.inst.Animations.lighter_engraving_mobile.onStop = function(){
                        this.isEngraving = false;
                        callback(this.isEngraving);
                        resolve(this.isEngraving);
                    }.bind(this);
                    this.inst.Animations.lighter_engraving_mobile.start(false, duration);
                    if(this.engraving_wasOpen == true){
                        this.open(undefined, false);
                        this.engraving_wasOpen = false;
                    }
                } else {
                    this.inst.Animations.lighter_engraving.onStop = function(){
                        this.isEngraving = false;
                        callback(this.isEngraving);
                        resolve(this.isEngraving);
                    }.bind(this);
                    this.inst.Animations.lighter_engraving.start(false, duration);
                    if(this.engraving_wasOpen == true){
                        this.open(undefined, false);
                        this.engraving_wasOpen = false;
                    }
                }
            } else {
                resolve(this.isEngraving);
            }
        }.bind(this));
    }
    // return new Promise(async function(resolve, reject){
    //     if(this.isEngraving){
    //         SPLINT.Utils.sleep(delay).then(function() {
    //             this.inst.Animations.lighter_engraving.onStop = function(){
    //                 this.isEngraving = false;
    //                 callback(this.isEngraving);
    //                 resolve(this.isEngraving);
    //             }.bind(this);
    //             this.inst.Animations.lighter_engraving.start(false);
    //         }.bind(this));
    //     } else {
    //         resolve(this.isEngraving);
    //     }
    // }.bind(this));
// }

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
                        let translation = new THREE.Vector3(-0.08, +0.07, +0.3);
                        this.inst.Animations.cameraTo.start(true, duration, undefined, false, translation, true);
                        // this.inst.Animations.cameraToFOV.start(true, duration, undefined, false, 40, true);
                        let rot = new THREE.Vector3(0, 0, 10);
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
                    this.flameEx()
                // }.bind(this);
                    if(expanded && SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
                        let translation = new THREE.Vector3(0.08, -0.07, -0.3);
                        this.inst.Animations.cameraTo.start(true, duration, undefined, false, translation, false);
                        // this.inst.Animations.cameraToFOV.start(true, duration, undefined, false, -40, false);
                        let rot = new THREE.Vector3(0, 0, -10);
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
    colors_doubleClose(callback = function(){}, duration){
        return new Promise(async function(resolve, reject){
            if(this.isDoubleColor){
                let translation = new THREE.Vector3(-0.01, 0, -0.1);
                this.inst.Animations.cameraTo.start(true, duration, undefined, false, translation, false);
                this.inst.Animations.lighter_color_double_close.onStop = function(){
                    if(this.doubleColorWasOpen){
                        // this.flameIgnite(function(){}, 800);
                        // this.wheel(0.5, 500);
                        // this.open();
                        this.doubleColorWasOpen = false;
                    }
                    this.isDoubleColor = false;
                    resolve(this.isDoubleColor);
                }.bind(this);
                this.inst.Animations.lighter_color_double_close.start(false, duration);
            } else {
                resolve(this.isDoubleColor);
            }
        }.bind(this));
    }
    colors_doubleStart(callback = function(){}, duration){
        return new Promise(async function(resolve, reject){
            if(!this.isDoubleColor){
                let translation = new THREE.Vector3(0.01, 0, 0.1);
                this.inst.Animations.cameraTo.start(true, duration, undefined, false, translation, true);
                if(this.isOpen){
                    this.close();
                    this.doubleColorWasOpen = true;
                } else {
                    this.doubleColorWasOpen = false;
                }
                this.inst.Animations.lighter_color_double_start.onStop = function(){
                    this.isDoubleColor = true;
                    resolve(this.isDoubleColor);
                }.bind(this);
                this.inst.Animations.lighter_color_double_start.start(true, duration);
            } else {
                resolve(this.isDoubleColor);
            }
        }.bind(this));
    }
    explosion(callback = function(){}){
        return new Promise(async function(resolve, reject){
            if(!this.isExploded){
                if(!this.isOpen){
                    this.open(undefined, false);
                    this.explosion_wasOpen = false;
                } else {
                    this.flameEx();
                    this.explosion_wasOpen = true;
                }
                let translation = new THREE.Vector3(0.01, 0.2, 0.35);
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
                    let translation = new THREE.Vector3(0.01, 0.2, 0.35);
                    this.inst.Animations.cameraTo.start(true, 0.2, undefined, false, translation, false);
                    this.inst.Animations.lighter_explosion_split.onStop = function(){
                        this.inst.Animations.lighter_explosion_turn_mobile.onStop = function(){
                            this.isExploded = false;
                            callback(this.isExploded);
                            resolve(this.isExploded);
                        }.bind(this);
                        this.inst.Animations.lighter_explosion_turn_mobile.start(false);
                        if(!this.explosion_wasOpen){
                            this.close(undefined, false);
                        } else {
                            this.flameIgnite();
                        }
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
                        if(!this.explosion_wasOpen){
                            this.close(undefined, false);
                        } else {
                            this.flameIgnite();
                        }
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