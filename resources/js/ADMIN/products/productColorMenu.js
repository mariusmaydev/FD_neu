
class AdminProductColorMenu {
    constructor(instance){
        this.instance = instance;
        this.colors = instance.colors;
        this.draw();
    }
    async draw(){
        let btColors = new SPLINT.DOMElement.Button(this.instance.head, "BTChangeColor", "Farben");
            btColors.Class("btColors");
            btColors.onclick = async function(){
                await this.instance.getColors();
                let popup = new SPLINT.DOMElement.popupWindow("ChangeColors", true);
                    popup.Class("changeColorWindow");

                    let table = new SPLINT.DOMElement.Table(popup.content, "tableColors", this.instance.colors);
                        table.func_drawFirstListElement = function(listElement){
                            let colorBody = new SPLINT.DOMElement("newProdcutColor_popup", "div", listElement);
                                colorBody.Class("colorBody");
                                let headline = new SPLINT.DOMElement.SpanDiv(colorBody, "headline", "Farbe hinzufügen");
                                    headline.Class("headline");

                                let colorContent = new SPLINT.DOMElement(colorBody.id + "content", "div", colorBody);
                                    colorContent.Class("NewColorContent");
                                    let inputColorID = new SPLINT.EX.DOMElement.Input(colorContent, "ID");
                                        inputColorID.onEnter = function(){buttonSubmit.click()};

                                    let inputColorName = new SPLINT.EX.DOMElement.Input(colorContent, "Name der Farbe");
                                        inputColorName.onEnter = function(){buttonSubmit.click()};

                                    let inputColorHex = new SPLINT.EX.DOMElement.Input(colorContent, "HEX-code");
                                        inputColorHex.onEnter = function(){buttonSubmit.click()};

                                let buttonSubmit = new SPLINT.DOMElement.Button(colorBody, "submit", "speichern");
                                    buttonSubmit.onclick = async function(){
                                        let flag = true;
                                        if(inputColorName.isEmpty()){
                                            inputColorName.invalid();
                                            flag = false;
                                        }
                                        if(inputColorHex.isEmpty()){
                                            inputColorHex.invalid();
                                            flag = false;
                                        }
                                        if(inputColorID.isEmpty()){
                                            inputColorID.invalid();
                                            flag = false;
                                        }
                                        if(flag){
                                            this.instance.colors[inputColorID.value] = new Object();
                                            this.instance.colors[inputColorID.value].name   = inputColorName.value;
                                            this.instance.colors[inputColorID.value].hex    = inputColorHex.value;
                                            await productHelper.saveColors(this.instance.colors);
                                            table.update(this.instance.colors);
                                        }
                                    }.bind(this);
                        }.bind(this);
                        table.func_drawListElement = function(data, index, listElement){
                            let color = this.instance.colors[index];
                            let show = new SPLINT.DOMElement(listElement.id + "showDiv", "div", listElement);
                                show.Class("showDiv");
                                show.style.backgroundColor = color.hex.replace('0x', '#');

                            let ID = new SPLINT.DOMElement.SpanDiv(listElement, "ColorID", index);
                                ID.Class("colorID");
                            let name = new SPLINT.DOMElement.SpanDiv(listElement, "ColorName", color.name);
                                name.Class("colorName");
                            let hex = new SPLINT.DOMElement.SpanDiv(listElement, "ColorHex", color.hex);
                                hex.Class("colorHex");

                            let btRemove = new SPLINT.DOMElement.Button(listElement, "remove");
                                btRemove.bindIcon("delete");
                                btRemove.onclick = async function(){
                                    delete this.instance.colors[index];
                                    await productHelper.saveColors(this.instance.colors);
                                    table.update(this.instance.colors);
                                }.bind(this);
                        }.bind(this);
                        table.draw();
                    // for(const [key, value] of Object.entries(colors)){
                    //     let bt = new SPLINT.DOMElement.Button
                    // }
            }.bind(this)
    }
}