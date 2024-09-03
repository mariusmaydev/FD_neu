class drawProjectList {
    constructor(parent, name = "", data, isAdmin = false, drawNew = false){
        this.tables = new Object();
        this.parent = parent;
        this.drawNew = drawNew;
        this.isAdmin = isAdmin;
        this.id = "ProjectList_" + name + "_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("ProjectListMain");
        this.name = name;
        this.data = data;
        this.init(data)
    }
    init(data){
        switch(this.name){
            case "PUBLIC" : {
                if(this.isAdmin) {
                    this.TopMainElement("Kollektionen", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.");
                } else {
                    this.TopMainElement("Vorlagen", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.");
                }
            } break;
            case "NORMAL" : {
                this.TopMainElement("Deine Kollektion", "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.")
            } break;
        }
        if(data == null){
            this.emptyBody = new SPLINT.DOMElement(this.id + "emptyBody", "div", this.mainElement);
            this.emptyBody.Class("emptyBody");
                let headline = new SPLINT.DOMElement.SpanDiv(this.emptyBody, "headline", "Hier ist nichts");
                    headline.Class("headline");
                let BTSymbol = new SPLINT.DOMElement.Button(this.emptyBody, "BTSymbol");
                    BTSymbol.bindIcon("search")

            SPLINT.Events.onLoadingComplete.dispatch();
            return;
        }
        for(const e of data){
            this.tables[e.ID] = this.initTable(e.value, e.ID);
            this.tables[e.ID].draw();
        }
    }
    update(){

    }
    remove(){
        this.clear();
        this.mainElement.remove();
    }
    clear(){
        // if(document.getElementById("Table_Projects_" + this.name + "_main") != null){
        //   document.getElementById("Table_Projects_" + this.name + "_main").remove();
        // }
    }
    focusSection(ID){
        if(this.tables[ID] != undefined){
            this.tables[ID].mainElement.scrollIntoView();
        }
    }
    async drawTable(){

    }
    TopMainElement(Headline, text){
        let id = "topMain";
        this.topMain = new SPLINT.DOMElement(this.id + "TopMain", "div", this.mainElement);
        this.topMain.Class("TopMain");
            let headline = new SPLINT.DOMElement.SpanDiv(this.topMain, "headline_topMain", Headline);
                headline.Class("headline_TopMain");

            let expanderDiv = new SPLINT.DOMElement(id + "expander_container", "div", this.topMain);
                expanderDiv.Class("expander_container");
                let expanderContent = new SPLINT.DOMElement("expander_content", "div", expanderDiv);
                    expanderContent.Class("expander_content");
                    let paragraph = new SPLINT.DOMElement(id + "paragraph", "p", expanderContent);
                        paragraph.Class("paragraph");
                        paragraph.innerHTML = text;


                let ShadowDiv = new SPLINT.DOMElement(id + "shadow", "div", expanderDiv);
                    ShadowDiv.Class("ShadowDiv");
                let buttonExpand = new SPLINT.DOMElement.Button(ShadowDiv, "buttonExpander", "mehr anzeigen");
                    buttonExpand.Class("expander_button");
                    expanderDiv.state().unsetActive()
                    buttonExpand.onclick = function(){
                        expanderDiv.state().toggle();
                        buttonExpand.button.state().toggle();
                    }
                    buttonExpand.button.S_onStateChange = function(e, state){
                        if(!state){
                            buttonExpand.value = "weniger anzeigen";
                        } else {
                            buttonExpand.value = "mehr anzeigen";
                        }
                    }
        this.hr = new SPLINT.DOMElement.HorizontalLine(this.mainElement);
    }
    initTable(dataIn, ID){
        // this.clear();

        let table = new SPLINT.DOMElement.Table(this.mainElement, "Projects_" + ID, dataIn);
            table.func_drawListElement = async function(data, index, listElement){
                let container = new SPLINT.DOMElement(index + "_" + ID + "container", "div", listElement);
                    container.Class("container");
                let lighter = new drawLighter3D(container, index + "_" + ID, drawLighter3D.PROJECT, data.Thumbnail, false, false, data.EPType);
                
                    lighter.promise.then(async function(){
                        console.dir(data)
                        let color = await productHelper.getColorForID(data.Color);
                        if(color == null || color == undefined){
                            color = "base";
                            return;
                        }
                        lighter.send("changeColor", color);
                    })
                lighter.saveContext = false;
                    listElement.setAttribute("state", data.State);

                let buttonDiv = new SPLINT.DOMElement(index + "_" + ID + "container_buttons", "div", container);
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
                    if(!(await productHelper.isAvailable(data.Product))){
                        button_toCart.disabled = true;
                        button_toCart.setTooltip("ausverkauft", "bottom")
                    }
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
                lighter.send("zoom", true);
            }
            listElement.onmouseleave = function(){
                lighter.send("zoom", false);
            }
            let projectDetails = new ProjectDetails(data, listElement, lighter);
              listElement.onclick = function(){
                if(SPLINT.ViewPort.isMobile()){
                    projectDetails.onclose = function(){
                    }
                }
                projectDetails.show();
              }
          }.bind(this);
          table.func_drawHoverDiv = function(data, index, hoverElement){

          }.bind(this);
          return table;
    }
}