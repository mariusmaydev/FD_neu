
// class Element3D {
//     constructor(parent, name){
//         this.parent         = parent;
//         this.name           = name;
//         this.id             = "Element3D_"
//         this.saveContext    = false;
//         this.attributes     = new SPLINT.autoObject();
//         this.mainElement    = new SPLINT.DOMElement(this.id + "main", "div", this.parent)
//         // this.mainElement.Class();
//         this.init();
//         this.initObserver();
//     }
//     set(name, value){
//         this.attributes[name] = value;
//         this.mainElement.setAttribute(name, value);
//     }
//     get(name){
//         return this.mainElement.getAttribute(name);
//     }
//     init(){
//         this.canvas = new SPLINT.DOMElement(this.id + "canvas", "div", this.mainElement);
//     }
//     initObserver(){
//       this.observer = new MutationObserver(function(a, b, c, d){
//         console.log(arguments)
//       });
//       this.observer.observe(this.mainElement, {
//         childList: true,
//         attributes: true,
//         characterData: true,
//         subtree: true
//       });
//     }
// }