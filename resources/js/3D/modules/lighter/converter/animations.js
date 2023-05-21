import SPLINT from 'SPLINT';

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
                SPLINT.Utils.sleep(delay).then(function(){
                    this.inst.Animations.lighter_flame.start(true);
                    this.isFlame = true;
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
                SPLINT.Utils.sleep(delay).then(function(){
                    this.inst.Animations.lighter_flame.stop(true);
                    this.isFlame = false;
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
                    this.close();
                    this.engraving_wasOpen = true;
                } else {
                    this.engraving_wasOpen = false;
                }
                this.inst.Animations.lighter_engraving.onStop = function(){
                    this.isEngraving = true;
                    callback(this.isEngraving);
                    resolve(this.isEngraving);
                }.bind(this);
                this.inst.Animations.lighter_engraving.start(true, duration);
            } else {
                resolve(this.isEngraving);
            }
        }.bind(this));
    }
    engravingOut(callback = function(){}, duration){
        return new Promise(async function(resolve, reject){
            if(this.isEngraving){
                this.inst.Animations.lighter_engraving.onStop = function(){
                    this.isEngraving = false;
                    callback(this.isEngraving);
                    resolve(this.isEngraving);
                }.bind(this);
                this.inst.Animations.lighter_engraving.start(false, duration);
                if(this.engraving_wasOpen == true){
                    this.open();
                    this.engraving_wasOpen = false;
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

    open(duration){
        return new Promise(async function(resolve, reject){
            if(!this.isOpen){
                this.inst.Animations.lighter_close.stop();
                this.inst.Animations.lever_close.stop();
                // this.inst.Animations.lighter_open.onStop = function(){
                    this.isOpen = true;
                //     resolve(this.isOpen);
                // }.bind(this);
                this.inst.Animations.lighter_open.start(true, duration);
                this.inst.Animations.lever_open.start(false, duration);
            
                resolve();
            } else {
                resolve(this.isOpen);
            }
        }.bind(this));
    }
    close(duration){
        return new Promise(async function(resolve, reject){
            if(this.isOpen){
                this.inst.Animations.lighter_open.stop();
                this.inst.Animations.lever_open.stop();
                // this.inst.Animations.lighter_close.onStop = function(){
                    this.isOpen = false;
                //     // this.flameEx()
                // }.bind(this);
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
                    this.open();
                    this.explosion_wasOpen = false;
                } else {
                    this.flameEx();
                    this.explosion_wasOpen = true;
                }
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
            } else {
                resolve(this.isExploded);
            }
        }.bind(this));
    }
    implosion(callback = function(){}){
        return new Promise(async function(resolve, reject){
            if(this.isExploded){
                this.inst.Animations.lighter_explosion_split.onStop = function(){
                    this.inst.Animations.lighter_explosion_turn.onStop = function(){
                        this.isExploded = false;
                        callback(this.isExploded);
                        resolve(this.isExploded);
                    }.bind(this);
                    this.inst.Animations.lighter_explosion_turn.start(false);
                    if(!this.explosion_wasOpen){
                        this.close();
                    } else {
                        this.flameIgnite();
                    }
                    this.isExploded = false;
                    this.inst.Animations.wheel_spinn.start();
                }.bind(this);
                this.inst.Animations.lighter_explosion_split.start(false);
            
            } else {
                resolve(this.isExploded);
            }
        }.bind(this));
    }
}