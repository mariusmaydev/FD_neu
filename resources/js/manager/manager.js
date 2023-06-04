

class manager extends SPLINT.autoObject {
    static {
        this.STORAGE = new SPLINT.autoObject(false);
        this.STORAGE.Page.TimeStart;
        this.STORAGE.Page.TimeEnd;
        this.STORAGE.Page.name;
        this.STORAGE.interactions.click = [];
    }
    static async dir(){
        console.dir(this.prototype.parseToObject.call(this))
    }
    static async log(){
        console.log(this.prototype.parseToObject.call(this))
    }
    static registerClick(element, x, y){
        let obj = new Object();
            obj.element = new Object();
            obj.element.ID = element.id;
            obj.element.pos = new Object();
            obj.element.pos.x = x;
            obj.element.pos.y = y;
            obj.time = S_DateTime.parseToMySqlDateTime((new Date()));
            obj.screenSize = new Object();
            obj.screenSize.x = window.innerWidth;
            obj.screenSize.y = window.innerHeight;
        this.STORAGE.interactions.click.push(obj);
    }
    
}
// let a = document.getElementById("elementId")
//     a.onclick
Object.defineProperty(HTMLElement.prototype, "_onclick", {
    value : function(event){}
})
Object.defineProperty(HTMLElement.prototype, "onclick", {
    set : function(func){
        this._onclick = func;
        this.addEventListener('click', function(event) {
            // if (/* your disabled check here */) {
              // Kill the event
              event.preventDefault();
              event.stopPropagation();
            // }
            manager.registerClick(event.target, event.x, event.y);
            func(event);
        
            // Doing nothing in this method lets the event proceed as normal
          },
          true  // Enable event capturing!
        );
    },
    get : function(){
        return this._onclick;
    }
})

        // SPLINT.require('@PROJECT_ROOT/manager/managerCallPHP.js');
        // SPLINT.require('@PROJECT_ROOT/manager/managerHelper.js');