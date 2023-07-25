
class ADMIN_NavigationMenu {
    constructor(parent){
      this.parent       = parent;
      this.mainElement  = new SPLINT.DOMElement("NavigationMenu", "div", parent);
      this.mainElement.Class("NavigationMenu");
      this.list         = [];
      this.ClassActive  = "active";
      this.ClassPassive = "passive";
    }
    draw(){
      //this.createSubElement("inventory", "Inventar");
      this.createSubElement("products", "Produkte");
      this.createSubElement("orders", "Bestellungen");
      this.createSubElement("statistics", "Statistiken");
      this.createSubElement("engraving", "Fräsen");
      this.createSubElement("index", "Startseite");
      this.createSubElement("designs", "Designs");
      this.createSubElement("testSpace", "TestSpace");
      this.createSubElement("couponCodes", "Rabattcodes");
      this.createSubElement("login", "Administratorkonten");
      this.createSubElement("userAccounts", "Nutzerkonten");
      // this.createSubElement("management", "Verwaltung");
    }
    #computeParentID(name){
      return "ADMIN_" + name;
    }
    createSubElement(name, value){
      let element = new SPLINT.DOMElement.Button(this.mainElement, name, value);
          if(this.parent.id == this.#computeParentID(name)){
            element.button.Class(this.ClassActive);
          } else {
            element.button.Class(this.ClassPassive);
          }
          element.button.onclick = function(){
            console.log(PATH_A.location[name]);
            // window.location.href = PATH_A.location[name];
            // console.log(Location_S.goto(PATH_A.location[name]).location);
            S_Location.goto(PATH_A.location[name]).call();
          }
      this.list.push(element);
      return element;
    }
    set classActive(Class){
      this.ClassActive = Class;
    }
    set classPassive(Class){
      this.ClassPassive = Class;
    }
  }