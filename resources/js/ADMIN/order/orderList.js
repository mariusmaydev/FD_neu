
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
            for(const e of this.orderData){
                e.uTime = S_Time.convertDateTimeToFormatedUnix(e.Time);
            }
            SArray.assortInt(this.orderData, "uTime", true);
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
        this.menuBody = new SPLINT.DOMElement(this.id + "menuBody", "div", this.parent);
        this.menuBody.before(this.mainElement);
        this.menuBody.Class("menuMain");

            let informationDiv = new SPLINT.DOMElement(this.id + "mainInformationMain", "div", this.menuBody);
                let table = new SPLINT.DOMElement.Table.TextTable(informationDiv, "test");
                    // table.setHead("a", "b");
        this.parent
        this.mainElement.innerHTML = "";
        await this.#getData();
        console.dir(this.orderData)
        let full = 0;
        let fullAmountEP = 0;
        let fullAmountLaser = 0;
        for(const e of this.orderData){
            for(const ei of e.Items){
                if(ei.amountFinishEP != undefined){
                    fullAmountEP += parseInt(ei.amountFinishEP);
                }
                if(ei.amountFinishLaser != undefined){
                    fullAmountLaser += parseInt(ei.amountFinishLaser);
                }
            }
            full += e.Items.length;
        }
        table.setRow(0, "offene Bestellungen:", this.orderData.length, "noch zu galvanisierende Feuerzeuge:", fullAmountEP);
        table.setRow(1, "noch zu fertigende Feuerzeuge:", full,"noch zu lasernde Feuerzeuge:", fullAmountLaser);
        // table.setRow(2, );
        // table.setRow(3, );
        table.draw();
        let bt_preRenderAll = new SPLINT.DOMElement.Button(this.menuBody, "preRenderAll", "alle modelle erstellen");
            bt_preRenderAll.setStyleTemplate(SPLINT.CONSTANTS.BUTTON_STYLES.DEFAULT)
        bt_preRenderAll.onclick = async function(){
            for(const e of this.orderData){
                for(const item of e.Items){
                    this.#modelButton(item.ProjectID, e.Items.UserID);
                    // let a = this.mainElement.querySelector("span[projectID='" + item.ProjectID + "']");
                    //     if(a.innerHTML == "close"){
                    //         let bt = this.mainElement.querySelector("button[projectID='" + item.ProjectID + "']");
                    //             a.style.display = "none";
                    //             let sp = new Spinner1(bt, item.ProjectID);
                    //         ConverterHelper.createData(e.Items.UserID, item.ProjectID).then(function(){
                    //                 sp.remove();
                    //                 a.style.display = "block";
                    //                 a.innerHTML = "check";
                    //         }.bind(this));
                    //     }
                }
            }
        }.bind(this);
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
            await this.drawTimeDiv(listElement, data);
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
                project = await ProjectHelper.getFromArchive(projectID, data.UserID, data.OrderID);
            } else {
                project = await ProjectHelper.get(projectID, data.UserID);
            }
            let productData = await productHelper.getByName(project.Product);
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
    drawTimeDiv(parent, data){
        let main = new SPLINT.DOMElement(parent.id + "_time", "div", parent);
            main.Class("timeDiv");
            let time = new formatUnix_S(data.uTime * 1000);
            let inner = new SPLINT.DOMElement.SpanDiv(main, "inner", time.date() + " " + time.time());
    }
    drawButtonsDiv(parent, data){
        let main = new SPLINT.DOMElement(parent.id + "_buttons", "div", parent);
            main.Class("buttonsDiv");
            let button_View = new SPLINT.DOMElement.Button(main, "View");
                button_View.bindIcon("search");
                button_View.button.setTooltip("öffnen", "bottom");
                button_View.button.onclick = function(){
                    S_Location.setHash(ADMIN_orders.VIEW, data.OrderID, this.fromArchive);
                    let newMain = new ADMIN_orders();
                        newMain.locationBack = PATH_A.location.orders;
                }.bind(this);

            if(!this.fromArchive){

                let button_sended = new SPLINT.DOMElement.Button(main, "sended", "versendet");
                    button_sended.bindIcon("check");
                    button_sended.button.setTooltip("Archivieren", "bottom");
                    button_sended.button.onclick = function(){
                        let confirmWindow = new SPLINT.DOMElement.popupWindow("a1", true);
                            let confirmText1 = new SPLINT.DOMElement.SpanDiv(confirmWindow.element, "confirmWindow1", "Bestellung archivieren bestätigen");
                            let confirmText2 = new SPLINT.DOMElement.SpanDiv(confirmWindow.element, "confirmWindow2", "Dies kann nicht rückgängig gemacht werden!");
                            let buttonEnter = new SPLINT.DOMElement.Button(confirmWindow.element, "subwindow_enter", "bestätigen");
                                buttonEnter.onclick = async function(){
                                    let r = await order.finish(data);

                                    console.dir(r);
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
            let tableElement = new SPLINT.DOMElement.Table.Grid(parent, parent.id + "_projectTable", items.length, 5);
                tableElement.mainElement.Class("projectTable");
                tableElement.getHead();
                let gen = SPLINT.DOMElement.SpanDiv.get;
                gen(tableElement.getData2Head(0), "", "Farbe");
                gen(tableElement.getData2Head(1), "", "Preis");
                gen(tableElement.getData2Head(2), "", "gefertigt");
                gen(tableElement.getData2Head(3), "", "beschichtet");
                gen(tableElement.getData2Head(4), "", "Modell");
                //tableElement.addRow("Galvanik", "Preis", "Laser");
            for(const index in items){
                let item = items[index];
                let projectID = item.ProjectID;
                let project;
                let projectPATH;
                if(this.fromArchive){
                    project = await ProjectHelper.getFromArchive(projectID, data.UserID, data.OrderID);
                    projectPATH = ProjectHelper.getPath2ProjectArchive(data.UserID, projectID, data.OrderID);
                } else {
                    project = await ProjectHelper.get(projectID, data.UserID);
                    projectPATH = ProjectHelper.getPath2Project(data.UserID, projectID);
                }
                new SPLINT.DOMElement.SpanDiv(tableElement.getData(index, 0), "", project.EPType);
                // LIGHTER_GOLD
                // console.log(project)
                let productData = await productHelper.getByName(project.Product);
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
                if(SPLINT.Utils.Files.doesExist(projectPATH + "/Full.nc", true)){
                    let bt = new SPLINT.DOMElement.Button(tableElement.getData(index, 4), "bt");
                        bt.button.setAttribute("projectID", projectID)
                        bt.span.setAttribute("projectID", projectID)
                        bt.bindIcon("check");
                        bt.setTooltip("Modell erstellt", "right");
                        bt.onclick = function(){
                        }
                } else {
                    let bt = new SPLINT.DOMElement.Button(tableElement.getData(index, 4), "bt");
                        bt.button.setAttribute("projectID", projectID)
                        bt.span.setAttribute("projectID", projectID)
                        bt.bindIcon("close");
                        bt.setTooltip("Modell erstellen", "right");
                        bt.onclick = function(){
                            this.#modelButton(projectID, data.UserID);
                        }.bind(this);
                }
            }
            // resolve("ok");
            return true;
    }
    #modelButton(ProjectID, UserID){                            
        let a = this.mainElement.querySelector("span[projectID='" + ProjectID + "']");
        if(a.innerHTML == "close"){
            let bt = this.mainElement.querySelector("button[projectID='" + ProjectID + "']");
                a.style.display = "none";
                let sp = new Spinner1(bt, ProjectID);
            ConverterHelper.createData(UserID, ProjectID).then(function(){
                    sp.remove();
                    a.style.display = "block";
                    a.innerHTML = "check";
            }.bind(this));
        }

    }
}