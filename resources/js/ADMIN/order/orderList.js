
class ADMIN_order_list {
    constructor(parent, fromArchive = false){
        this.parent = parent;
        this.id = "orderList_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("orderListMain");
        this.projects = [];
        this.fromArchive = (fromArchive == 'true');
        this.draw();
    }
    async #getData(){
        return new Promise(async function(resolve){
            if(this.fromArchive){
                this.orderData = await order.getFromArchive();
            } else {
                this.orderData = await order.get();
            }
            resolve(true);
        }.bind(this));
    }
    #getProjectData(projectID){
        for(const project of this.projects){
            if(project.ProjectID === projectID){
                return project;
            }
        }
        return ProjectHelper.get(projectID);
    }    
    async draw(){
        this.mainElement.innerHTML = "";
        await this.#getData();

        for(const index in this.orderData){
            await this.drawListElement(index, this.orderData[index]);
        }
        // if(this.orderData == null){
        //     let emptyElement = new SPLINT.DOMElement.SpanDiv(this.mainElement, "emptyElement", "keine Bestellungen vorhanden");
        // }
    }
    async drawListElement(i, data){
            let items   = data.Items;
            let address = data.Address;
            
            let listElement = new SPLINT.DOMElement(this.id + "listElement_" + i, "div", this.mainElement);
                listElement.Class("listElement");
                let flag = true;
                for(const index in items){
                    let item = items[index];
                    if(item.amountFinishEP == undefined || item.amountFinishEP < item.amount || item.amountFinishLaser == undefined || item.amountFinishLaser < item.amount){
                        flag = false;
                    }
                }
                if(flag == true){
                    listElement.state().setActive();
                }
            await this.drawProjectsDiv(listElement, data);
            await this.drawInformationDiv(listElement, data);
            await this.drawAddressDiv(listElement, data, i);
            await this.drawButtonsDiv(listElement, data);
            // resolve(true);
    }
    async drawInformationDiv(parent, data){
        let items = data.Items;
        let fullPrice = 0;
        let fullAmount = 0;
        for(const index in items){
            let item = items[index];
            let projectID = item.ProjectID;
            let project;
            if(this.fromArchive){
                project = await ProjectHelper.getFromArchive(projectID, this.orderData[0].UserID, this.orderData[0].OrderID);
            } else {
                project = await ProjectHelper.get(projectID, this.orderData[0].UserID);
            }
            console.log(project)
            let productData = await productHelper.getByName(project.Product);
            console.dir(productData);
                fullPrice = S_Math.add(fullPrice, S_Math.multiply(productData.price, item.amount));
            fullAmount += parseInt(item.amount);
        }
        let main = new SPLINT.DOMElement(parent.id + "_information", "div", parent);
            main.Class("informationDiv");
            let tableElement = new Table2D(parent, parent.id + "_informationTable", 3, 2);
                tableElement.mainElement.Class("infoTable");
                new SPLINT.DOMElement.SpanDiv(tableElement.getData(0, 0), "", "Anzahl");
                new SPLINT.DOMElement.SpanDiv(tableElement.getData(0, 1), "", fullAmount);

                new SPLINT.DOMElement.SpanDiv(tableElement.getData(1, 0), "", "Einnahmen");
                new SPLINT.DOMElement.SpanDiv(tableElement.getData(1, 1), "", fullPrice);
        return true;
    }
    drawAddressDiv(parent, data, index){
        let main = new drawAddressElement(parent, data.Address.sending, index);
    }
    drawButtonsDiv(parent, data){
        let main = new SPLINT.DOMElement(parent.id + "_buttons", "div", parent);
            // if(!this.fromArchive){
            //     let button_remove = new Button(main, "remove");
            //         button_remove.bindIcon("delete");
            //         button_remove.button.onclick = function(){
            //             order.remove(data.OrderID);
            //             this.draw();
            //         }.bind(this);
            // }
            
            let button_View = new SPLINT.DOMElement.Button(main, "View");
                button_View.bindIcon("search");
                button_View.button.setTooltip("öffnen", "bottom");
                button_View.button.onclick = function(){
                    S_Location.setHash(ADMIN_orders.VIEW, data.OrderID, this.fromArchive);
                    let newMain = new ADMIN_orders();
                        newMain.locationBack = PATH_A.location.orders;
                }.bind(this);

            if(!this.fromArchive){
                /*let button_stateCLOSE = new Button(main, "State_Close", "close");
                    button_stateCLOSE.button.onclick = function(){
                        order.setState(data.OrderID, order.STATE_CLOSED);
                    }
                
                let button_stateOPEN = new Button(main, "State_Open", "open");
                    button_stateOPEN.button.onclick = function(){
                        order.setState(data.OrderID, order.STATE_OPEN);
                    }*/

                let button_sended = new SPLINT.DOMElement.Button(main, "sended", "versendet");
                    button_sended.bindIcon("check");
                    button_sended.button.setTooltip("Archivieren", "bottom");
                    button_sended.button.onclick = function(){
                        let confirmWindow = new SPLINT.DOMElement.popupWindow("a1", true);
                            let confirmText1 = new SPLINT.DOMElement.SpanDiv(confirmWindow.element, "confirmWindow1", "Bestellung archivieren bestätigen");
                            let confirmText2 = new SPLINT.DOMElement.SpanDiv(confirmWindow.element, "confirmWindow2", "Dies kann nicht rückgängig gemacht werden!");
                            let buttonEnter = new SPLINT.DOMElement.Button(confirmWindow.element, "subwindow_enter", "bestätigen");
                                buttonEnter.button.onclick = function(){
                                    order.finish(data);
                                    confirmWindow.close();
                                    parent.remove();
                                }
                            let buttonReject = new SPLINT.DOMElement.Button(confirmWindow.element, "subwindow_reject", "abbrechen");
                                buttonReject.button.onclick = function(){
                                    confirmWindow.close();
                                }
                                confirmWindow.append(confirmText1.div);
                                confirmWindow.append(confirmText2.div);
                                confirmWindow.append(buttonEnter.button);
                                confirmWindow.append(buttonReject.button);
                    }.bind(this);
            }
            return true;
    }
    async drawProjectsDiv(parent, data){
            let items = data.Items;
            let tableElement = new SPLINT.DOMElement.Table.Grid(parent, parent.id + "_projectTable", items.length, 4);
                tableElement.mainElement.Class("projectTable");
                tableElement.getHead();
                let gen = SPLINT.DOMElement.SpanDiv.get;
                gen(tableElement.getData2Head(0), "", "Farbe");
                gen(tableElement.getData2Head(1), "", "Preis");
                gen(tableElement.getData2Head(2), "", "gefertigt");
                gen(tableElement.getData2Head(3), "", "beschichtet");
                //tableElement.addRow("Galvanik", "Preis", "Laser");
            for(const index in items){
                let item = items[index];
                let projectID = item.ProjectID;
                let project;
                if(this.fromArchive){
                    project = await ProjectHelper.getFromArchive(projectID, this.orderData[0].UserID, this.orderData[0].OrderID);
                    console.log(projectID, this.orderData[0].UserID, this.orderData[0].OrderID)
                } else {
                    project = await ProjectHelper.get(projectID, this.orderData[0].UserID);
                }
                new SPLINT.DOMElement.SpanDiv(tableElement.getData(index, 0), "", project.EPType);
                // LIGHTER_GOLD
                // console.log(project)
                let productData = await productHelper.getByName(project.Product);
                console.log(productData)
                // if(project.EPType == "GOLD"){
                    new SPLINT.DOMElement.SpanDiv(tableElement.getData(index, 1), "", productData.price);
                // } else {
                    // new SPLINT.DOMElement.SpanDiv(tableElement.getData(index, 1), "", productHelper.LIST.lighter.chrome.price);
                // }
                if(item.amountFinishLaser != undefined){
                    new SPLINT.DOMElement.SpanDiv(tableElement.getData(index, 2), "", item.amountFinishLaser + "/" + item.amount);
                } else {
                    new SPLINT.DOMElement.SpanDiv(tableElement.getData(index, 2), "", 0 + "/" + item.amount);
                }
                if(item.amountFinishEP != undefined){
                    new SPLINT.DOMElement.SpanDiv(tableElement.getData(index, 3), "", item.amountFinishEP + "/" + item.amount);
                } else {
                    new SPLINT.DOMElement.SpanDiv(tableElement.getData(index, 3), "", 0 + "/" + item.amount);
                }
                if(item.amountFinishEP != undefined && item.amountFinishLaser != undefined){
                    if(item.amountFinishEP >= item.amount && item.amountFinishLaser >= item.amount){
                        tableElement.getRow(index-1).state().setActive();
                    }
                }
            }
            // resolve("ok");
            return true;
    }
}