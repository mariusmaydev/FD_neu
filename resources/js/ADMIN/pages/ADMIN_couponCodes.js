

class ADMIN_couponCodes extends ADMIN_DrawTemplate {
    constructor(){
        super("couponCodes");
        this.mainElement.Class("main");
        // this.draw();
    }
    draw(){
        this.drawNewCouponCode();
        this.drawCouponCodeList();
    }
    drawNewCouponCode(){
        this.newCodeBody = new SPLINT.DOMElement(this.id + "_newBody", "div", this.mainElement);
        this.newCodeBody.Class("newBody");
            let headline = new SPLINT.DOMElement.SpanDiv(this.newCodeBody, "headline", "neuen Code erstellen");

            let valueInputDiv = new SPLINT.DOMElement(this.id + "new_valueInputDiv", "div", this.newCodeBody);
                valueInputDiv.Class("valueInputBody");
                
                let input_value = new SPLINT.DOMElement.InputDiv(valueInputDiv, "value", "Wert");
                    input_value.type = "number";
                let mode_switch = new S_toggleButton(valueInputDiv, "mode_switch");
                    mode_switch.addElement("%", "percent", function(){

                    });
                    mode_switch.addElement("€", "euro");
                    mode_switch.setActive("percent");

            let input_code = new SPLINT.DOMElement.InputDiv(this.newCodeBody, "code", "Code");

            let button_submit = new SPLINT.DOMElement.Button(this.newCodeBody, "submit", "speichern");
                button_submit.onclick = async function(){
                    let flag = true;
                    if(input_value.value == ""){
                        flag = false;
                        input_value.invalid("bitte gib einen Wert ein")
                    }
                    if(input_code.value == ""){
                        flag = false;
                        input_code.invalid("bitte gib einen Namen ein");
                    }
                    if(flag){
                        await functionsCouponCodes.add(input_code.value, mode_switch.value, input_value.value);
                        this.drawCouponCodeList();
                    }
                }.bind(this);

    }
    async drawCouponCodeList(){
        let data = await functionsCouponCodes.get();
        console.log(data);
        this.listCodeBody = new SPLINT.DOMElement(this.id + "listCodeBody", "div", this.mainElement);
        this.listCodeBody.Class("listCodeBody");
            let headline = new SPLINT.DOMElement.SpanDiv(this.listCodeBody, "headline", "Codes");
            if(data == null){
                return;
            }
            let table = new Table2D(this.listCodeBody, "listCodeTable", data.length, 3);
                table.getHead();
                new SPLINT.DOMElement.SpanDiv(table.getData2Head(0), "", "Code");
                new SPLINT.DOMElement.SpanDiv(table.getData2Head(1), "", "Wert");
                new SPLINT.DOMElement.SpanDiv(table.getData2Head(2), "", "");
                for(const index in data){
                    let code = data[index];
                    new SPLINT.DOMElement.SpanDiv(table.getData(index, 0), "code_" + index, code.code);
                    let value = code.value;
                    if(code.type == "percent"){
                        value += "%";
                    } else {
                        value += "€";
                    }
                    new SPLINT.DOMElement.SpanDiv(table.getData(index, 1), "value_" + index, value);

                    let buttonDiv = new SPLINT.DOMElement(this.id + "listCodeElementButtonDiv_" + index, "div", table.getData(index, 2));
                        let button_remove = new SPLINT.DOMElement.Button(buttonDiv, "remove_" + index);
                            button_remove.bindIcon("delete");
                            button_remove.onclick = async function(){
                                await functionsCouponCodes.remove(code.code);
                                this.listCodeBody.remove();
                                this.drawCouponCodeList();
                            }.bind(this);
                }
                // table.draw();
    }
}