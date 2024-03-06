
export default class indexCommunication {
    constructor(instance){
        this.inst = instance;
        this.progress = false;
        this.dataStack = [];
        this.init();
    }
    init(){
        this.inst.canvas.S_toModule = function(event, element, LighterData){
            // this.dataStack.push(JSON.stringify({type: "delay", time: 1000}));
            let data = JSON.parse(LighterData);
            if(element.type == "changeColor"){
                if(element.value.name == "Basis"){
                    this.inst.changeColor("base", element.value.hex.replace('0x', '#'));
                    return;
                }
                this.inst.changeColor(element.value.name, element.value.hex.replace('0x', '#'));

            } else if(data.type == "addImage"){
                for(const index in data.data){
                    let img = data.data[index];
                    this.inst.renderImages.addImage(img);
                    // console.log(img)
                }
            }
            // if(data.type == "remove"){
            //     if(this.dataStack.length >= data.amount){
            //         if(data.start == "right"){
            //             this.dataStack.splice(-data.amount);
            //         } else {
            //             this.dataStack.splice(0, data.amount);
            //         }
            //     }
            // } else if(data.type == "animation"){
            //     if(!this.progress){
            //         this.progress = true;
            //         this.work(data);
            //     } else {
            //         if(this.dataStack.length >= 3){
            //             this.dataStack.splice(0, 1);
            //             this.dataStack.splice(0, 1);
            //             this.dataStack.push(JSON.stringify({close: {name : "engraving", delay: 0}, open: {name : null, delay: 0}, elements : []}));
            //             this.dataStack.push(JSON.stringify({close: {name : "explosion", delay: 0}, open: {name : null, delay: 0}, elements : []}));
            //         }
            //         this.dataStack.push(LighterData);
            //     }
            // }
        }.bind(this);
    }
    work(data){
        if(data.mode == "toggle"){
            this.toggle(data.name, data.delay, data.duration, data.elements).then(function(){
                if(this.dataStack.length > 0){
                    let obj = this.dataStack[0];
                    let data = JSON.parse(obj);
                    this.dataStack.splice(0, 1);
                    this.work(data);
                } else {
                    this.progress = false;
                }

            }.bind(this));
        } else {
            let process = this.close(data.close.name, data.close.delay, data.close.duration, data.elements);
                process.then(function(){
                    this.open(data.open.name, data.open.delay, data.open.duration, data.elements).then(function(){
                        if(this.dataStack.length > 0){
                            let obj = this.dataStack[0];
                            let data = JSON.parse(obj);
                            this.dataStack.splice(0, 1);
                            this.work(data);
                        } else {
                            this.progress = false;
                        }

                    }.bind(this));
                }.bind(this));
        }

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