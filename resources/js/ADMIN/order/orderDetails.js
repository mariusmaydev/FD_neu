class ADMIN_order_view {
    constructor(parent, orderID, fromArchive){
        this.parent     = parent;
        this.orderID    = orderID;
        this.fromArchive = (fromArchive == 'true');
        this.id = "orderOverview_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
        this.mainElement.Class("orderOverview");
        this.contentElement = new SPLINT.DOMElement(this.id + "content", "div", this.mainElement);
        this.contentElement.Class("content");
        this.getData();
    }
    async getData(){
        if(this.fromArchive){
            this.data = await order.getFromArchive(this.orderID);
        } else {
            this.data = await order.get(this.orderID);
        }
        this.data = this.data[0];
        this.data.uTime = S_Time.convertDateTimeToFormatedUnix(this.data.Time, false);
        this.items = this.data.Items;
        this.draw();
    }
    draw(){
        this.drawMainInfoDiv();
        this.drawProjectsDiv();
        this.drawAddressDiv();
        this.drawPDFDiv();
        // this.drawRightDiv();
    }
    drawRightDiv(){
        this.rightDiv = new SPLINT.DOMElement(this.id + "rightDiv", "div", this.mainElement);
        this.rightDiv.Class("rightBar");

    }
    drawMainInfoDiv(){
        this.mainInfoDiv = new SPLINT.DOMElement(this.id + "mainInfoDiv", "div", this.contentElement);
        this.mainInfoDiv.Class("mainInfoDiv");
            let time = new formatUnix_S(this.data.uTime);
            const f = S_ANSI.use;
                console.log(f.i + "test" + f.cBG.green + f.cFG.red + "test2");
            let dateBody = new SPLINT.DOMElement(this.id + "dateBody", "div", this.mainInfoDiv);
                dateBody.Class("dateBody");
                let date_i1 = new SPLINT.DOMElement.SpanDiv(dateBody, "date_i1", "Bestellt am&nbsp;");
                    date_i1.identifier = 0;
                let date_i2 = new SPLINT.DOMElement.SpanDiv(dateBody, "date_i2", time.date());
                    date_i2.identifier = 1;
                let date_i3 = new SPLINT.DOMElement.SpanDiv(dateBody, "date_i3", "&nbsp;um&nbsp;");
                    date_i3.identifier = 2;
                let date_i4 = new SPLINT.DOMElement.SpanDiv(dateBody, "date_i4", time.time());
                    date_i4.identifier = 3;

            let timeBody = new SPLINT.DOMElement(this.id + "timeBody", "div", this.mainInfoDiv);
            
            let b = S_DateTime.timeDiff(this.data.uTime, S_DateTime.getUnixTime(false), true);
                timeBody.Class("timeBody");
                let time_i1 = new SPLINT.DOMElement.SpanDiv(timeBody, "time_i1", "Bestellung offen seit&nbsp;");
                    time_i1.identifier = 0;
                let time_i2 = new SPLINT.DOMElement.SpanDiv(timeBody, "time_i2", b);
                    time_i2.identifier = 1;

            // let span = new SPLINT.DOMElement.SpanDiv(this.mainInfoDiv, "date", time);
        console.dir(this.data);
    }
    async drawProjectsDiv(){
        this.projectDiv = new SPLINT.DOMElement(this.id + "projectDiv", "div", this.contentElement);
        this.projectDiv.Class("projectsDiv");
        for(const index in this.items){
            let projectID = this.items[index].ProjectID;
            let project;
            if(this.fromArchive){
                project = await ProjectHelper.getFromArchive(projectID, this.data.UserID, this.data.OrderID);
            } else {
                project = await ProjectHelper.get(projectID, this.data.UserID);
            }
            let projectPATH;
            if(this.fromArchive){
                projectPATH = ProjectHelper.getPath2ProjectArchive(this.data.UserID, project.ProjectID, this.data.OrderID);
            } else {
                projectPATH = ProjectHelper.getPath2Project(this.data.UserID, project.ProjectID);
            }

            let listElement = new SPLINT.DOMElement(this.id + "project_listElement_" + index, "div", this.projectDiv);
                listElement.Class("listElement");
                let lighter = new drawLighter3D(listElement, "lighter_" + index, drawLighter3D.PROJECT, project.Thumbnail);
                
                let informationDiv = new SPLINT.DOMElement("projectListElement_information_Div_" + index, "div", listElement);
                    informationDiv.Class("informationDiv");

                    let laserDiv = new SPLINT.DOMElement("projectListElement_laser_Div_" + index, "div", informationDiv);
                        laserDiv.Class("laserDiv");
                        let laserSpanDiv_head = new SPLINT.DOMElement.SpanDiv(laserDiv, "laser_SpanDiv_head", "Laser");
                            laserSpanDiv_head.div.Class("laser_head");
                        let amountFinishLaser = 0;
                        if(this.items[index].amountFinishLaser != undefined){
                            amountFinishLaser = this.items[index].amountFinishLaser;
                            if(amountFinishLaser >= this.items[index].amount){
                                laserDiv.state().setActive();
                            }
                        }
                        let amountInputLaser = new SPLINT.DOMElement.InputAmount(laserDiv, "amountInputLaser", amountFinishLaser, " / " + this.items[index].amount);
                            amountInputLaser.min = 0;
                            amountInputLaser.oninput = function(amount){
                                this.items[index].amountFinishLaser = amount;
                                order.edit(this.data);
                                if(amount >= this.items[index].amount){
                                    laserDiv.state().setActive();
                                } else {
                                    laserDiv.state().unsetActive();
                                }
                                if(laserDiv.state().isActive() && EP_div.state().isActive()){
                                    listElement.state().setActive();
                                } else {
                                    listElement.state().unsetActive();
                                }
                            }.bind(this);
                        
                        let buttonsContainer = new SPLINT.DOMElement("projectListElement_laser_Div_buttons" + index, "div", laserDiv);
                            buttonsContainer.Class("buttons");
                            if(!this.fromArchive){

                                    let button_render = new SPLINT.DOMElement.Button(buttonsContainer, "render", "Model erstellen");
                                        button_render.setStyleTemplate(S_Button.STYLE_NONE);
                                        button_render.button.onclick = async function(){
                                            let sp = new SPLINT.DOMElement.Spinner(button_render.button, "test");
                                                // sp.
                                            console.log(this.data.UserID, project.ProjectID);
                                            let Args = new Object();
                                                Args.type = "laser";
                                                console.log(project);
                                                // Args.PointZero = new Object();
                                                // Args.PointZero.X = DSProject.Storage[DSProject.SQUARE].PointZeroX;
                                                // Args.PointZero.Y = DSProject.Storage[DSProject.SQUARE].PointZeroY;
                                            let res = (await ConverterHelper.createData(this.data.UserID, project.ProjectID, Args));
                                            sp.remove();
                                            button_download_NC.button.disabled = false;
                                            button_startEngraving.button.disabled = false;
                                        }.bind(this);
                                        
                                        if(SPLINT.Utils.Files.doesExist(projectPATH + "/Full.nc", true)){
                                            button_render.span.innerHTML = "Model erneut erstellen";
                                        }
                            }


                                let button_download_NC = new SPLINT.DOMElement.Button(buttonsContainer, "downloadNC", "Model herunterladen");
                                    button_download_NC.setStyleTemplate(S_Button.STYLE_NONE);
                                    button_download_NC.button.onclick = function(){
                                        if(SPLINT.Utils.Files.doesExist(projectPATH + "/Full.nc", true)){
                                            download_S.download(projectPATH + "/Full.nc", this.orderID + "_" + (parseInt(index) + 1) + "_Model.nc");
                                        } else {
                                            ConverterHelper.createData(this.data.UserID, project.ProjectID);
                                            download_S.download(projectPATH + "/Full.nc", this.orderID + "_" + (parseInt(index) + 1) + "_Model.nc");
                                        }
                                    }.bind(this);
                                    if(!SPLINT.Utils.Files.doesExist(projectPATH + "/Full.nc", true)){
                                        button_download_NC.button.disabled  = true;
                                    } else {
                                        button_download_NC.button.disabled  = false;
                                    }

                                let button_startEngraving = new SPLINT.DOMElement.Button(buttonsContainer, "startEngraving", "Model Fräsen");
                                    button_startEngraving.setStyleTemplate(S_Button.STYLE_NONE);
                                    button_startEngraving.button.onclick = async function(){
                                        if(SPLINT.Utils.Files.doesExist(projectPATH + "/Full.nc", true)){
                                            
                                            let res = await SPLINT.API.Moonraker.printFile(projectPATH + "/Full.nc");
                                            // let name = this.orderID + "_" + (parseInt(index) + 1) + "_Model";
                                            // let code = (await SPLINT.API.Moonraker.loadGCode(projectPATH + "/Full.nc"));
                                            // await SPLINT.API.Moonraker.uploadGCode(code, name);
                                            // let g = SPLINT.API.Moonraker.startPrint(name);
                                            // console.log(code);
                                        }
                                    }.bind(this);
                                    if(!SPLINT.Utils.Files.doesExist(projectPATH + "/Full.nc", true)){
                                        button_startEngraving.button.disabled  = true;
                                    } else {
                                        button_startEngraving.button.disabled  = false;
                                    }

                    let EP_div = new SPLINT.DOMElement("EPTypeDiv_" + index, "div", informationDiv);
                        EP_div.Class("EPDiv");
                        
                        let EP_SpanDiv_head = new SPLINT.DOMElement.SpanDiv(EP_div, "EP_SpanDiv_head", "Galvanik");
                            EP_SpanDiv_head.div.Class("EP_head");

                            let amountFinishEP = 0;
                            if(this.items[index].amountFinishEP != undefined){
                                amountFinishEP = this.items[index].amountFinishEP;
                                if(amountFinishEP >= this.items[index].amount){
                                    EP_div.state().setActive();
                                }
                                if(laserDiv.state().isActive() && EP_div.state().isActive()){
                                    listElement.state().setActive();
                                } else {
                                    listElement.state().unsetActive();
                                }
                            }
                            let amountInputEP = new AmountInput(EP_div, "amountInputEP", amountFinishEP, " / " + this.items[index].amount);
                                amountInputEP.min = 0;
                                amountInputEP.oninput = function(amount){
                                    this.items[index].amountFinishEP = amount;
                                    order.edit(this.data);
                                    if(amount >= this.items[index].amount){
                                        EP_div.state().setActive();
                                    } else {
                                        EP_div.state().unsetActive();
                                    }
                                    if(laserDiv.state().isActive() && EP_div.state().isActive()){
                                        listElement.state().setActive();
                                    } else {
                                        listElement.state().unsetActive();
                                    }
                                }.bind(this);



                        let EP_SpanDiv = new SPLINT.DOMElement.SpanDiv(EP_div, "EP_SpanDiv", project.EPType);
                            EP_SpanDiv.div.Class("EPColor");
                            EP_SpanDiv.span.setAttribute("type", project.EPType);
                let indexDiv = new SPLINT.DOMElement(this.id + "indexDiv_" + index, "div", listElement);
                    indexDiv.Class("indexDiv");

                    let indexSpan = new SPLINT.DOMElement.SpanDiv(indexDiv, "indexSpan", (parseInt(index) + 1));

                    
        }
    }
    drawAddressDiv(){
        this.addressDiv = new SPLINT.DOMElement(this.id + "addressDiv", "div", this.contentElement);
        this.addressDiv.Class("addressDiv");

            let addressElementShippingHeadline = new SPLINT.DOMElement.SpanDiv(this.addressDiv, "headline_Shipping", "Sendungsadresse");
            let addressElementShipping = new drawAddressElement(this.addressDiv, this.data.Address.sending, 0);
                let buttonDownloadShippingCSV = new SPLINT.DOMElement.Button(addressElementShipping.buttonDiv, "downloadShippingCSV");
                    buttonDownloadShippingCSV.bindIcon("download");
                    buttonDownloadShippingCSV.button.onclick = function(){
                        CSV_S.save(this.orderID + "_Adresse_Sendung.csv", order.createAddressCSV(this.orderID, this.data.Address.sending));
                    }.bind(this);
            
            if(!S_ObjectTools.is_equal(this.data.Address.sending, this.data.Address.invoice)){
                let addressElementInvoiceHeadline = new SPLINT.DOMElement.SpanDiv(this.addressDiv, "headline_Invoice", "Rechnungsadresse");
                let addressElementInvoice = new drawAddressElement(this.addressDiv, this.data.Address.invoice, 1);
                    let buttonDownloadInvoiceCSV = new SPLINT.DOMElement.Button(addressElementInvoice.buttonDiv, "downloadInvoiceCSV");
                        buttonDownloadInvoiceCSV.bindIcon("download");
                        buttonDownloadInvoiceCSV.button.onclick = function(){
                            CSV_S.save(this.orderID + "_Adresse_Rechnung.csv", order.createAddressCSV(this.orderID, this.data.Address.sending));
                        }.bind(this);
            }
    }
    drawPDFDiv(){
        this.PDFDiv = new SPLINT.DOMElement(this.id + "PDFDiv", "div", this.contentElement);
        this.PDFDiv.Class("PDFDiv");
            let PDF1 = new SPLINT.DOMElement(this.id + "PDF1", "iframe", this.PDFDiv);
            PDF1.scrolling = "no";
                PDF1.src = this.data.Path_PDF + "Invoice.pdf";

            let PDF2 = new SPLINT.DOMElement(this.id + "PDF2", "iframe", this.PDFDiv);
                PDF2.src = this.data.Path_PDF + "DeliveryNote.pdf";
    }
}