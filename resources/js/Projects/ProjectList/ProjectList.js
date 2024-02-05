class drawProjectList {
    constructor(parent, name = "", data, isAdmin = false, drawNew = false){
        this.parent = parent;
        this.drawNew = drawNew;
        this.isAdmin = isAdmin;
        this.id = "ProjectList_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("ProjectListMain");
        this.name = name;
        this.data = data;
        this.draw();
    }
    update(){

    }
    remove(){
        this.clear();
        this.mainElement.remove();
    }
    clear(){
        if(document.getElementById("Table_Projects_" + this.name + "_main") != null){
          document.getElementById("Table_Projects_" + this.name + "_main").remove();
        }
    }
    async draw(){
        this.clear();
        this.table = new SPLINT.DOMElement.Table(this.mainElement, "Projects_" + this.name, this.data);
          if(this.drawNew){
            this.table.func_drawFirstListElement = async function(listElement){
              listElement.onclick = async function(){
                await ProjectHelper.new("neues Projekt", "Lighter_Gold_custom", false, false);
                S_Location.goto(PATH.location.converter).call();
              }
              let container = new SPLINT.DOMElement("new_" + this.name + "container", "div", listElement);
                  container.Class("container");
                  let lighter = new drawLighter3D(container, "new_" + this.name, drawLighter3D.PROJECT_NEW);
                  listElement.setAttribute("align", "left");
            }.bind(this);
          }
          this.table.func_drawListElement = async function(data, index, listElement){
            let container = new SPLINT.DOMElement(index + "_" + this.name + "container", "div", listElement);
                container.Class("container");
              let lighter = new drawLighter3D(container, index + "_" + this.name, drawLighter3D.PROJECT, data.Thumbnail);
              lighter.saveContext = true;
                  listElement.setAttribute("state", data.State);

              let buttonDiv = new SPLINT.DOMElement(index + "_" + this.name + "container_buttons", "div", container);
                  buttonDiv.Class("buttonDiv");
                  if(data.Original != "true"){
                    let button_edit = new SPLINT.DOMElement.Button(buttonDiv, index + "_edit");
                        button_edit.setTooltip("bearbeiten", "bottom");
                    if(data.State == "ADMIN"){
                      button_edit.value = "verwenden";
                    } else {
                      button_edit.bindIcon("edit");
  
                    }
                    button_edit.button.onclick = async function(e){
                      e.stopPropagation();
                        if(data.State == ProjectHelper.STATE_NORMAL){
                          ProjectHelper.CONVERTER_startProject(data.ProjectID, false);
                        } else if(data.State == "ADMIN"){
                          let projectID = await ProjectHelper.copy(data.ProjectID, "admin");
                          ProjectHelper.CONVERTER_startProject(projectID, false);
                        }
                    }.bind(this);
                  }
              let button_toCart = new SPLINT.DOMElement.Button(buttonDiv, index + "_toCart");
                  button_toCart.bindIcon("add_shopping_cart");
                  button_toCart.setTooltip("in dem Warenkorb", "bottom");
                  button_toCart.onclick = async function(e){
                        e.stopPropagation();
                      let projectID = data.ProjectID;
                      if(data.State != ProjectHelper.STATE_CART){
                        if(data.State == "ADMIN"){
                            projectID = await ProjectHelper.copy(data.ProjectID, "admin");
                        } else {
                            projectID = await ProjectHelper.copy(data.ProjectID);
                        }
                        await ProjectHelper.changeState(projectID, ProjectHelper.STATE_CART);
                      }
                    ShoppingCart.addItem(projectID, data.Product, 1);
                  }.bind(this);
                if(data.State == ProjectHelper.STATE_NORMAL){
                    let button_copy = new SPLINT.DOMElement.Button(buttonDiv, index + "_copy");
                        button_copy.bindIcon("content_copy");
                        button_copy.setTooltip("kopieren", "bottom");
                        button_copy.onclick = async function(e){
                            e.stopPropagation();
                            await ProjectHelper.copy(data.ProjectID);
                            this.data = (await ProjectHelper.getAll("NORMAL"));
                            this.draw();
                        }.bind(this);
                }
                  
                if(data.State == ProjectHelper.STATE_NORMAL){
                    let button_remove = new SPLINT.DOMElement.Button(buttonDiv, index + "_remove");
                        button_remove.bindIcon("delete");
                        button_remove.setTooltip("löschen", "bottom");
                        button_remove.onclick = function(e){
                            e.stopPropagation();
                            if(data.State == ProjectHelper.STATE_NORMAL){
                                ProjectHelper.remove(data.ProjectID);
                                buttonDiv.parentNode.parentNode.remove();
                            }
                        }.bind(this);
                }
            
            listElement.onmouseenter = function(){
                lighter.send("turn", true);
            }
            listElement.onmouseleave = function(){
                lighter.send("turn", false);
            }
            let projectDetails = new ProjectDetails(data, index, listElement);
              listElement.onclick = function(){
                projectDetails.show();
              }
          }.bind(this);
          this.table.func_drawHoverDiv = function(data, index, hoverElement){

          }.bind(this);
          this.table.draw();
    }
}