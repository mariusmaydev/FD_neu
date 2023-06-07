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
        // let lastTop = null;
        // let lastRow = 0;
        // let lastList = [];
        this.table = new Table(this.mainElement, "Projects_" + this.name, this.data);
        let isAdmin = await SPLINT.SessionsPHP.get("ADMIN", false);
          if(this.drawNew){
            this.table.func_drawFirstListElement = function(listElement){
              listElement.onclick = async function(){
                await ProjectHelper.new("neues Projekt", "Lighter_Gold_custom", false, false);
                S_Location.goto(PATH.location.converter).call();
              }
              let container = new SPLINT.DOMElement("new_" + this.name + "container", "div", listElement);
                  container.Class("container");
                  let lighter = new drawLighter3D(container, "new_" + this.name, drawLighter3D.PROJECT_NEW);
                      // listElement.setAttribute("state", data.State);
                  listElement.setAttribute("align", "left");
            }.bind(this);
          }
          this.table.func_drawListElement = function(data, index, listElement){
            let container = new SPLINT.DOMElement(index + "_" + this.name + "container", "div", listElement);
                container.Class("container");
              let lighter = new drawLighter3D(container, index + "_" + this.name, drawLighter3D.PROJECT, data.Thumbnail);
              lighter.saveContext = true;
                  listElement.setAttribute("state", data.State);

              let buttonDiv = new SPLINT.DOMElement(index + "_" + this.name + "container_buttons", "div", container);
                  buttonDiv.Class("buttonDiv");
                  let button_edit = new SPLINT.DOMElement.Button(buttonDiv, index + "_edit");
                  button_edit.bindIcon("edit");
                  button_edit.button.onclick = async function(e){
                    e.stopPropagation();
                    if(this.isAdmin){
                      let pID = await ProjectHelper.copy(data.ProjectID, "admin");
                      console.log(pID)
                    //   return;

                      if(data.State == ProjectHelper.STATE_CART){
                        ProjectHelper.CONVERTER_startProject(pID, true);
                      } else {
                        ProjectHelper.CONVERTER_startProject(pID, false);
                      }
                    } else {
                      if(data.State == ProjectHelper.STATE_CART){
                        ProjectHelper.CONVERTER_startProject(data.ProjectID, true);
                      } else {
                        ProjectHelper.CONVERTER_startProject(data.ProjectID, false);
                      }
                    }
                  }.bind(this);
              if(isAdmin){
                let button_remove = new SPLINT.DOMElement.Button(buttonDiv, index + "_remove");
                    button_remove.bindIcon("delete");
                    button_remove.onclick = function(e){
                      e.stopPropagation();
                      ProjectHelper.remove(data.ProjectID);
                      if(data.State == ProjectHelper.STATE_CART){
                        ShoppingCart.removeItem(data.ProjectID);
                      }
                      buttonDiv.parentNode.remove();
                      // this.draw();
                    }.bind(this);
              }
              let button_toCart = new SPLINT.DOMElement.Button(buttonDiv, index + "_toCart");
                  button_toCart.bindIcon("add_shopping_cart");
                  button_toCart.button.onclick = async function(e){
                      e.stopPropagation();
                      let projectID = data.ProjectID;
                      if(data.State != ProjectHelper.STATE_CART){
                        projectID = await ProjectHelper.copy(data.ProjectID, await SPLINT.SessionsPHP.get("USER_ID", false));
                        await ProjectHelper.changeState(projectID, ProjectHelper.STATE_CART);
                      }
                      if(data.EPType == "GOLD"){
                        ShoppingCart.addItem(projectID, productHelper.LIGHTER_GOLD, 1);
                      } else {
                        ShoppingCart.addItem(projectID, productHelper.LIGHTER_CHROME, 1);
                      }
                  }.bind(this);
              let button_remove = new SPLINT.DOMElement.Button(buttonDiv, index + "_remove");
                  button_remove.bindIcon("delete");
                  button_remove.onclick = function(e){
                    e.stopPropagation();
                    ProjectHelper.remove(data.ProjectID);
                    if(data.State == ProjectHelper.STATE_CART){
                      ShoppingCart.removeItem(data.ProjectID);
                    }
                    buttonDiv.parentNode.parentNode.remove();
                    // this.draw();
                  }.bind(this);
            
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