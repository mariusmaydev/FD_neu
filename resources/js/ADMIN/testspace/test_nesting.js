
class ADMIN_test_Nesting {
    constructor(parent){
        this.parent = parent;
        this.id = "ADMIN_test_Nesting__";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("ADMIN_testSpace_NestingMain");
        this.draw();
    }
    async draw(){
        let datas = await CategoryHelper.get_Examples();
        console.log(datas);
        let a = new nS_Nesting(document.body, "test", datas)
    }
}

class nS_Nesting {
    constructor(parent, name, nestingData){
        this.parent = parent;
        this.name   = name;
        this.data   = nestingData;
        this.id     = "nS_Nesting_" + name + "_"; 
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.#buildTree();
    }
    #getObject(container, id, callback) {
        for(const item of container){
            if(item.name === id){
                callback(item, container);
            }
            if(item.tree) {
                this.#getObject(item.tree, id, callback);
            }
        }
    }
    #buildTree(){
        let build_f = function(tree, container) {
            for(const item of tree){
                let newContainer = document.createElement('div');

                    let button1 = document.createElement('button');
                    button1.id = item.name;
                    button1.innerHTML = item.name;
                    button1.onclick = function(e){
                        console.dir(button1)
                        this.#getObject(this.data.tree, e.target.id, function (target, container) {
                            // console.log(container, target)
                            // delete container[0];
                            // console.log(container, target)
                            // delete target.tree;
                            // target.tree = this.genTree("test"  + Math.random());
                            this.mainElement.innerHTML = "";
                            this.#buildTree(this.data, this.mainElement);
                        }.bind(this));
                    }.bind(this);
                    newContainer.appendChild(button1);


                    let button = document.createElement('button');
                    button.id = item.name;
                    button.innerHTML = item.name;
                    button.onclick = function(e){
                        this.#getObject(this.data.tree, e.target.id, function (target, container) {
                            target.name = 'newName ' + Math.random();
                            let newTree = this.genTree("test"  + Math.random());
                            if(Array.isArray(container.tree)){
                                container.tree.concat(newTree);
                            } else {
                                container.tree = newTree;
                            }
                            // target.tree = this.genTree("test"  + Math.random());
                            this.mainElement.innerHTML = "";
                            this.#buildTree(this.data, this.mainElement);
                        }.bind(this));
                    }.bind(this);
                    newContainer.appendChild(button);
                let nameText = document.createTextNode(item.name);
                newContainer.appendChild(nameText);
        
                container.appendChild(newContainer);
                if(item.tree) {
                    build_f(item.tree, newContainer);
                }
            }
        }.bind(this);
        build_f(this.data.tree, this.mainElement);
        CategoryHelper.edit_Examples(this.data);
    }
    genTree(name){
        let obj = new Object();
            obj.name = name;
        let ar = [];
            ar.push(obj);
        return ar;
    }

}

// class NestingData {
//     #attributes;
//     constructor(name, attributes = new Object){
//         this.#attributes    = attributes;
//         this.name           = name;
//     }
//     toJSON(){
//         let obj = new Object();
//             obj.tree = [];
//             obj.tree.push()
//     }
//     add(name, attributes){
        
//     }

// }
