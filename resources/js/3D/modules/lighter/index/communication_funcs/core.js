import desktop from './desktop.js';
import mobile from'./mobile.js';

export default class indexCommunication_funcsCore {
    constructor(instance){
        this.inst = instance;
        this.mobile = new mobile(instance);
        this.desktop = new desktop(instance);
    }
    toggle(type, delay = 0, duration, elements){
        if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
            return this.mobile.toggle(type, delay, duration, elements);
        } else {
            return this.desktop.toggle(type, delay, duration, elements);
        }
    }
    close(type, delay = 0, duration){
        if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
            return this.mobile.close(type, delay, duration);
        } else {
            return this.desktop.close(type, delay, duration);
        }
    }
    open(type, delay = 0, duration){
        if(SPLINT.ViewPort.getSize() == "mobile-small" || SPLINT.ViewPort.getSize() == "mobile"){
            return this.mobile.open(type, delay, duration);
        } else {
            return this.desktop.open(type, delay, duration);
        }
    }
}