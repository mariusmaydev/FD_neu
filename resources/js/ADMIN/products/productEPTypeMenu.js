
class AdminProductEPTypeMenu {
    constructor(instance){
        this.instance = instance;
        this.colors = instance.colors;
        this.draw();
    }
    async draw(){
        let btEPType = new SPLINT.DOMElement.Button(this.instance.head, "BTChangeEPType", "Galvanisierung");
            btEPType.Class("btEPType");
            btEPType.onclick = async function(){
                await this.instance.getEPTypes();
                let popup = new SPLINT.DOMElement.popupWindow("ChangeEPTypes", true);
                    popup.Class("changeEPTypeWindow");

                    let table = new SPLINT.DOMElement.Table(popup.content, "tableEPType", this.instance.EPTypes);
                        table.func_drawFirstListElement = function(listElement){
                            let EPTypeBody = new SPLINT.DOMElement("newProdcutEPType_popup", "div", listElement);
                                EPTypeBody.Class("EPTypeBody");
                                let headline = new SPLINT.DOMElement.SpanDiv(EPTypeBody, "headline", "Galvanik hinzufügen");
                                    headline.Class("headline");

                                let EPTypeContent = new SPLINT.DOMElement(EPTypeBody.id + "content", "div", EPTypeBody);
                                    EPTypeContent.Class("NewEPTypeContent");
                                    let inputEPTypeID = new SPLINT.EX.DOMElement.Input(EPTypeContent, "ID");
                                        inputEPTypeID.onEnter = function(){buttonSubmit.click()};

                                    let inputEPTypeName = new SPLINT.EX.DOMElement.Input(EPTypeContent, "Name der Galvanik");
                                        inputEPTypeName.onEnter = function(){buttonSubmit.click()};

                                    let inputEPTypeHex = new SPLINT.EX.DOMElement.Input(EPTypeContent, "HEX-code");
                                        inputEPTypeHex.onEnter = function(){buttonSubmit.click()};

                                let buttonSubmit = new SPLINT.DOMElement.Button(EPTypeBody, "submit", "speichern");
                                    buttonSubmit.onclick = async function(){
                                        let flag = true;
                                        if(inputEPTypeName.isEmpty()){
                                            inputEPTypeName.invalid();
                                            flag = false;
                                        }
                                        if(inputEPTypeHex.isEmpty()){
                                            inputEPTypeHex.invalid();
                                            flag = false;
                                        }
                                        if(inputEPTypeID.isEmpty()){
                                            inputEPTypeID.invalid();
                                            flag = false;
                                        }
                                        if(flag){
                                            this.instance.EPTypes[inputEPTypeID.value] = new Object();
                                            this.instance.EPTypes[inputEPTypeID.value].name   = inputEPTypeName.value;
                                            this.instance.EPTypes[inputEPTypeID.value].hex    = inputEPTypeHex.value;
                                            await productHelper.saveEPTypes(this.instance.EPTypes);
                                            table.update(this.instance.EPTypes);
                                        }
                                    }.bind(this);
                        }.bind(this);
                        table.func_drawListElement = function(data, index, listElement){
                            let EPType = this.instance.EPTypes[index];
                            let show = new SPLINT.DOMElement(listElement.id + "showDiv", "div", listElement);
                                show.Class("showDiv");
                                show.style.backgroundEPType = EPType.hex.replace('0x', '#');

                            let ID = new SPLINT.DOMElement.SpanDiv(listElement, "EPTypeID", index);
                                ID.Class("EPTypeID");
                            let name = new SPLINT.DOMElement.SpanDiv(listElement, "EPTypeName", EPType.name);
                                name.Class("EPTypeName");
                            let hex = new SPLINT.DOMElement.SpanDiv(listElement, "EPTypeHex", EPType.hex);
                                hex.Class("EPTypeHex");

                            let btRemove = new SPLINT.DOMElement.Button(listElement, "remove");
                                btRemove.bindIcon("delete");
                                btRemove.onclick = async function(){
                                    delete this.instance.EPTypes[index];
                                    await productHelper.saveEPTypes(this.instance.EPTypes);
                                    table.update(this.instance.EPTypes);
                                }.bind(this);
                        }.bind(this);
                        table.draw();
                    // for(const [key, value] of Object.entries(EPTypes)){
                    //     let bt = new SPLINT.DOMElement.Button
                    // }
            }.bind(this)
    }
}