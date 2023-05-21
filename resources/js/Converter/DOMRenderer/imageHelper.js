
class ConverterDOMRendererImageHelper {
    constructor(instance){
        this.instance_main = instance;
        this.id = this.instance_main.id + "IMG_";
        this.HELPER = this.instance_main.HELPER;
    }
    addImage(imgData){
        let obj = new Object();
            obj.data = imgData;
        let index = this.instance_main.elements.length;    
        console.log(index);   
             
            obj.DOMElements = this.newImgElement(index, obj);
            this.instance_main.elements.push(obj);
    }
    removeImage(){

    }
    editImage(){
        // this.
    }
    newImgElement(index, imgObj){
        console.log(imgObj);
        imgObj.identClass = "DOMConverter_IMG_DIV" + index;
        let DOMElements = new Object();
            DOMElements.div = new SPLINT.DOMElement(this.id + "container_" + index, "div", this.instance_main.mainDiv);
            DOMElements.div.Class("imgContainer");
            DOMElements.div.Class(imgObj.identClass);
            DOMElements.div.style.width = this.HELPER.ScaleDown(imgObj.data.ImageWidth) + "px";
            DOMElements.div.style.height = this.HELPER.ScaleDown(imgObj.data.ImageHeight) + "px";
            DOMElements.div.style.left = this.HELPER.ScaleDown(imgObj.data.ImagePosX) + "px";
            DOMElements.div.style.top = this.HELPER.ScaleDown(imgObj.data.ImagePosY) + "px";
            DOMElements.div.style.transform = "translate(-50%, -50%)";
            DOMElements.div.setAttribute("draggable", "true");

            DOMElements.img = new SPLINT.DOMElement(this.id + "src_" + index, "img", DOMElements.div);
            DOMElements.img.src = imgObj.data.images.view;

            
            DOMElements.edgesDiv = new SPLINT.DOMElement(DOMElements.div.id + "EDGES_DIV", "div", DOMElements.div);
            DOMElements.edgesDiv.Class("EdgesDiv");
            imgObj.startDrag = function(e){
                
                let edgeDivs = document.getElementsByClassName("EdgesDiv");
                    for(let i = 0; i < edgeDivs.length; i++){
                        edgeDivs[i].style.display = "none";
                    }
                if(e.target.getAttribute("direction") != null){
                    imgObj.dragType = e.target.getAttribute("direction");
                } else {
                    imgObj.dragType = "move";
                }
                let Mpos = this.HELPER.getMousePos(e);
                imgObj.dragFlag = true;
                imgObj.drag = new Object();
                imgObj.drag.pos = new Object();
                imgObj.drag.pos.start = new Object();
                imgObj.drag.pos.start = Mpos;
                imgObj.drag.offset = new Object();
                imgObj.drag.offset.X = Mpos.X - imgObj.DOMElements.div.offsetLeft;
                imgObj.drag.offset.Y = Mpos.Y - imgObj.DOMElements.div.offsetTop;
                DOMElements.div.drawEdges();
            }.bind(this);
            imgObj.stopDrag = function(){
                if(imgObj.dragFlag === true){
                    imgObj.DOMElements.div.parentNode.appendChild(imgObj.DOMElements.div);
                    imgObj.dragFlag = false;
                }
            }.bind(this);


            DOMElements.div.onmousedown = function(e){
                e.preventDefault();
                e.stopPropagation();
                imgObj.startDrag(e);
            }.bind(this);
            document.body.addEventListener("click", function(e){
                e.preventDefault();
                e.stopPropagation();
                imgObj.stopDrag();
                if(!e.target.hasParentWithClass(imgObj.identClass)){
                    DOMElements.div.removeEdges();
                }
            })
            document.body.addEventListener("mousemove", function(e){
                e.preventDefault();
                // e.stopPropagation();
                if(imgObj.dragFlag === true){
                    let Mpos = this.HELPER.getMousePos(e);
                    let posX = S_Math.add(Mpos.X, -imgObj.drag.offset.X);
                    let posY = S_Math.add(Mpos.Y, -imgObj.drag.offset.Y);
                    if(posY > 0 && posY < this.instance_main.mainDiv.offsetHeight){
                        DOMElements.div.style.top = posY + "px";
                    }
                    if(posX > 0 && posX < this.instance_main.mainDiv.offsetWidth){
                        DOMElements.div.style.left = posX + "px";
                    }
                }
            }.bind(this));
            DOMElements.div.onmouseup = function(e){
                e.preventDefault();
                e.stopPropagation();
                imgObj.stopDrag();
            }.bind(this);

            DOMElements.div.drawEdges = function(){
                DOMElements.edgesDiv.style.display = "block";
                this.HELPER.getEdge(imgObj, "LT");
                this.HELPER.getEdge(imgObj, "MT");
                this.HELPER.getEdge(imgObj, "RT");
                
                this.HELPER.getEdge(imgObj, "RM");

                this.HELPER.getEdge(imgObj, "RB");
                this.HELPER.getEdge(imgObj, "MB");
                this.HELPER.getEdge(imgObj, "LB");
                
                this.HELPER.getEdge(imgObj, "LM");
            }.bind(this);

            DOMElements.div.removeEdges = function(){
                DOMElements.edgesDiv.style.display = "none";
            }.bind(this);
        return DOMElements;
    }
    drag(){
        
    }
}