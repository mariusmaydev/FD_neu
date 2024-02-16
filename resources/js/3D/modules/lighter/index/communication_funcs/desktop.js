
export default class indexCommunication_funcsDesktop {
    constructor(instance){
        this.inst = instance;
    }
    delay(time){
        return this.inst.compressedAnimations.delay(1000);
    }
    toggle(type, delay = 0, duration, elements){
        return (this.inst.compressedAnimations.delay(delay).then(function(){
            switch(type){
                case "engraving" : {
                    return this.inst.compressedAnimations.toggleEngraving(function(){}, duration);
                } break;
                case "explosion" : {
                    return this.inst.compressedAnimations.toggleExplosion();
                } break;
                case "cover" : {
                    return this.inst.compressedAnimations.toggleOpen();
                } break;
                case "color" : {
                    return this.inst.compressedAnimations.toggleColor();
                } break;
                case "flame" : {
                    return this.inst.compressedAnimations.toggleFlame();
                } break;
                case "smoothTurn" : {
                    return this.inst.compressedAnimations.toggleSmoothTurn(duration);
                } break;
                case "turnBack" : {
                    return this.inst.compressedAnimations.turnBack();
                } break;
                case "wheel" : {
                    return Promise.resolve('');
                } break;
                default : {
                    return Promise.resolve('');
                } break;
            }
        }.bind(this)));
    }
    close(type, delay = 0, duration){
        return (this.inst.compressedAnimations.delay(delay).then(function(){
            switch(type){
                case "engraving" : {
                    return this.inst.compressedAnimations.engravingOut(function(){}, duration);
                    // return this.inst.compressedAnimations.engravingOut();
                } break;
                case "explosion" : {
                    return this.inst.compressedAnimations.implosion();
                } break;
                case "cover" : {
                    return this.inst.compressedAnimations.close();
                } break;
                case "color" : {
                    return this.inst.compressedAnimations.colorChrome();
                } break;
                case "colors_double" : {
                    return this.inst.compressedAnimations.colors_doubleClose();
                } break;
                case "smoothTurn" : {
                    return this.inst.compressedAnimations.smoothTurnStop();
                } break;
                case "turnBack" : {
                    return this.inst.compressedAnimations.turnBack();
                } break;
                case "wheel" : {
                    return Promise.resolve('');
                } break;
                case "flame" : {
                    return this.inst.compressedAnimations.flameEx();
                } break;
                default : {
                    return Promise.resolve('');
                } break;
            }
        }.bind(this)));
    }
    open(type, delay = 0, duration){
        return (this.inst.compressedAnimations.delay(delay).then(function(){
            switch(type){
                case "engraving" : {
                    return this.inst.compressedAnimations.engravingIn(function(){}, duration);
                } break;
                case "explosion" : {
                    return this.inst.compressedAnimations.explosion();
                } break;
                case "cover" : {
                    return this.inst.compressedAnimations.open();
                } break;
                case "color" : {
                    return this.inst.compressedAnimations.colorGold();
                } break;
                case "colors_double" : {
                    return this.inst.compressedAnimations.colors_doubleStart();
                } break;
                case "flame" : {
                    return this.inst.compressedAnimations.flameIgnite();
                } break;
                case "smoothTurn" : {
                    return this.inst.compressedAnimations.smoothTurnStart(duration, delay);
                } break;
                case "turnBack" : {
                    return this.inst.compressedAnimations.turnBack();
                } break;
                case "wheel" : {
                    return Promise.resolve('');
                } break;
                default : {
                    return Promise.resolve('');
                } break;
            }
        }.bind(this)));
    }
}