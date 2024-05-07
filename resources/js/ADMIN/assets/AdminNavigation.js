
class ADMIN_NavigationMenu {
    constructor(parent){
      this.parent       = parent;
      this.mainElement  = new SPLINT.DOMElement("NavigationMenu", "div", parent);
      this.mainElement.Class("NavigationMenu");
      this.list         = [];
      this.ClassActive  = "active";
      this.ClassPassive = "passive";
      this.elements = new Object();
    }
    draw(){
        this.createSubElement("products", "Produkte");
        this.createSubElement("orders", "Bestellungen");
        let orderCount = new SPLINT.DOMElement.SpanDiv(this.elements["orders"].button, "orderCount", "");
            orderCount.Class("orderCount");
        async function f(){
            let res = await order.get();
            if(res != null){
                orderCount.value = res.length;
            }
        }
        f();
        
        
        this.createSubElement("statistics", "Statistiken");
        this.createSubElement("engraving", "Fräsen");
        this.createSubElement("index", "Startseite");
        this.createSubElement("designs", "Designs");
        this.createSubElement("testSpace", "TestSpace");
        this.createSubElement("couponCodes", "Rabattcodes");
        this.createSubElement("login", "Administratorkonten");
        this.createSubElement("userAccounts", "Nutzerkonten");
        this.createSubElement("MultiConverter", "MultiConverter", async function(){
            await SPLINT.SessionsPHP.set("USER_ID", "ADMIN", false);
            await SPLINT.SessionsPHP.set("USER_NAME", "ADMIN", false);
            await SPLINT.SessionsPHP.set("ADMIN", true, false);
            await SPLINT.SessionsPHP.set("GUEST", false, false);
            ProjectHelper.new('ADMIN', "LIGHTER_BASE_GOLD_custom", true, false, true).then(S_Location.goto(PATH.location.converter).setHash("ADMINPLUS").call());
        });
      // this.createSubElement("management", "Verwaltung");
    }
    #computeParentID(name){
      return "ADMIN_" + name;
    }
    createSubElement(name, value, func = null){
      this.elements[name] = new SPLINT.DOMElement.Button(this.mainElement, name, value);
      this.elements[name].Class(name);
          if(this.parent.id == this.#computeParentID(name)){
            this.elements[name].button.Class(this.ClassActive);
          } else {
            this.elements[name].button.Class(this.ClassPassive);
          }
          this.elements[name].button.onclick = function(){
            if(func != null){
                func();
                return;
            }
            S_Location.goto(PATH_A.location[name]).call();
          }
      this.list.push(this.elements[name]);
      return this.elements[name];
    }
    set classActive(Class){
      this.ClassActive = Class;
    }
    set classPassive(Class){
      this.ClassPassive = Class;
    }
  }