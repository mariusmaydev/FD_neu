
class ProjectCategoryMenu {
    constructor(parent, isOriginal, hide = false){
        this.parent = parent;
        this.isOriginal = isOriginal;
        this.id = "ProjectCategoryMenu_" + parent.id + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent)
        this.mainElement.Class("ProjectCategoryMenu");
        this.hide = hide;
        this.callBack = function(data){};
        this.draw();
    }
    move(newParent){
        newParent.appendChild(this.mainElement);
    }
    async draw(){
        if(this.isOriginal){
            this.data = await CategoryHelper.get_Originals();
        } else {
            this.data = await CategoryHelper.get_Examples();
        }
        let nestingElement = new SPLINT.DOMElement.Nesting(this.mainElement, this.id + "Nesting_", this.data);
            nestingElement.callBack = function(ele, path, key, index, id, obj){
                if(typeof obj[key].attr == 'object' && typeof obj[key].attr.data == 'object'){
                    let sign = new SPLINT.DOMElement.SpanDiv(ele, "sign", obj[key].attr.data.length);
                        sign.Class("sign");
                    let entries = Object.entries(obj[key]); 
                    let hasAttr = Object.hasOwn(obj[key], "attr");
                    if((hasAttr && entries.length > 1) || (!hasAttr && entries.length > 0)){
                        ele.state().unsetActive();
                        ele.classList.add("extensible");
                    }
                } else {
                    let sign = new SPLINT.DOMElement.SpanDiv(ele, "sign", 0);
                        sign.Class("sign");
                }
                ele.onclick = function(event){
                    event.stopPropagation();
                        for(const child of ele.children){
                            if(child.classList.contains("I_expander")){
                                ele.state().toggle();
                                break;
                            }
                        }
                    let c = ele.attributes.ivalue.value;
                    this.activeCategory = c;
                    let path = c.split(".");
                        path.splice(0, 1);
                    let last = nestingElement.obj;
                    for(const entry of path){
                        if(Object.hasOwn(last[entry], entry) && typeof last[entry] != 'object'){
                            last[entry] = new Object();
                        }
                        last = last[entry];
                    }
                    if(typeof last.attr != 'object'){
                        last.attr = new Object();
                    }
                    if(typeof last.attr.data != 'object'){
                        last.attr.data = [];
                    }

                    let elements = document.querySelectorAll("[connected=true]")
                    for(const element of elements){
                        element.removeAttribute("connected");
                    }
                    ele.setAttribute("connected", true)
                    let promises = []
                    for(const d of last.attr.data){
                        if(d != null){
                            promises.push(ProjectHelper.get(d, "admin").then(function(r){
                                return r;
                            }));
                        }
                    }
                    let stack = [];
                    Promise.all(promises).then(function(r){
                        for(const e of r){
                            if(typeof e == 'object'){
                                if(this.isOriginal){
                                    if(e.Original == "true"){
                                        stack.push(e);
                                    }
                                } else {
                                    if(e.Original == "false"){
                                        stack.push(e);
                                    }
                                }
                            }
                        }
                        this.callBack(stack);
                        // console.log(r);
                    }.bind(this))
                    // console.log(last.attr.data);
                    // ele.style.backgroundColor = "red";
                    // this.draw(last.attr.data);
                    // CategoryHelper.edit(nestingElement.obj).then(function(a){});
                    // console.log(last.attr.data);
                }.bind(this);
                ele.onmouseover = function(event){
                    event.stopPropagation()
                    // ele.state().setActive();
                }
                ele.onmouseout = function(event){
                    event.stopPropagation()
                    // ele.state().unsetActive();
                }
            }.bind(this);
            nestingElement.draw();

            // let element = document.querySelector('[ivalue="' + this.activeCategory + '"]');
            // if(element != null){
            //   element.style.backgroundColor = "red";
            // }
    }
    remove(){
        this.mainElement.remove();
    }
    set hide(v){
        this.mainElement.setAttribute('isHidden', v);
    }
}