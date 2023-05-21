

class manager extends SPLINT.autoObject {
    static {
        this.STORAGE = new SPLINT.autoObject(false);
        this.STORAGE.Page.TimeStart;
        this.STORAGE.Page.TimeEnd;
        this.STORAGE.Page.name;
    }
    static async dir(){
        console.dir(this.prototype.parseToObject.call(this))
    }
    static async log(){
        console.log(this.prototype.parseToObject.call(this))
    }
}
        // SPLINT.require('@PROJECT_ROOT/manager/managerCallPHP.js');
        // SPLINT.require('@PROJECT_ROOT/manager/managerHelper.js');