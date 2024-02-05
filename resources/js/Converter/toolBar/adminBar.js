
class ConverterAdminBar {
    constructor() {
        this.parent = document.getElementById("NavigationBar");
        this.parent.classList.add("ADMINPLUS");
        this.id = "ConverterAdminBar_";
        this.contentElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.contentElement.Class("content");
        this.drawSizing();
        this.drawPointZero();
        this.drawGrayscaleButton();
    }    
    drawSizing(){
        let container = new SPLINT.DOMElement(this.id + "sizing_Container", "div", this.contentElement);
            container.Class("sizing_Container");

            let label = new SPLINT.DOMElement.SpanDiv(container, "headline", "Größe");
                label.Class("label");

            let inputXContainer = new SPLINT.DOMElement(this.id + "inputXContainer", "div", container);
                inputXContainer.Class("inputContainer");
                let inputX = new SPLINT.DOMElement.InputAmount(inputXContainer, "inputX", DSProject.Storage[DSProject.SQUARE].widthMM, "mm");
                    inputX.oninput = function(amount){
                        LighterWidth = amount;
                        DSProject.Storage[DSProject.SQUARE].width = amount *16.4;
                        DSProject.Storage[DSProject.SQUARE].widthMM = amount;
                        AdjustSquareBorder();
                    }
                let labelInputX = new SPLINT.DOMElement.Label(inputXContainer, inputX.mainElement, "X" );
                    labelInputX.before();

            let inputYContainer = new SPLINT.DOMElement(this.id + "inputYContainer", "div", container);
                inputYContainer.Class("inputContainer");
                let inputY = new SPLINT.DOMElement.InputAmount(inputYContainer, "inputY", DSProject.Storage[DSProject.SQUARE].heightMM, "mm");
                    inputY.oninput = function(amount){
                        LighterHeight = amount;
                        DSProject.Storage[DSProject.SQUARE].height = amount *16.4;
                        DSProject.Storage[DSProject.SQUARE].heightMM = amount;
                        AdjustSquareBorder();
                    }
                let labelInputY = new SPLINT.DOMElement.Label(inputYContainer, inputY.mainElement, "Y" );
                    labelInputY.before();
    }
    drawPointZero(){
        let container = new SPLINT.DOMElement(this.id + "X0_Container", "div", this.contentElement);
            container.Class("X0_Container");

            let label = new SPLINT.DOMElement.SpanDiv(container, "headline", "Nullpunkt");
                label.Class("label");

            let inputXContainer = new SPLINT.DOMElement(this.id + "inputX0Container", "div", container);
                inputXContainer.Class("inputContainer");
                let inputX = new SPLINT.DOMElement.InputAmount(inputXContainer, "inputX0", 10, "mm");
                    inputX.oninput = function(amount){
                        DSProject.Storage[DSProject.SQUARE].PointZeroX = amount *16.4;
                    }
                let labelInputX = new SPLINT.DOMElement.Label(inputXContainer, inputX.mainElement, "X" );
                    labelInputX.before();

            let inputYContainer = new SPLINT.DOMElement(this.id + "inputY0Container", "div", container);
                inputYContainer.Class("inputContainer");
                let inputY = new SPLINT.DOMElement.InputAmount(inputYContainer, "inputY0", 10, "mm");
                    inputY.oninput = function(amount){
                        DSProject.Storage[DSProject.SQUARE].PointZeroY = amount *16.4;
                    }
                let labelInputY = new SPLINT.DOMElement.Label(inputYContainer, inputY.mainElement, "Y" );
                    labelInputY.before();
            
            DSProject.Storage[DSProject.SQUARE].PointZeroX = inputX.amount *16.4;
            DSProject.Storage[DSProject.SQUARE].PointZeroY = inputY.amount *16.4;

    }
    drawGrayscaleButton(){
        let container = new SPLINT.DOMElement(this.id + "grayscaleButtonContainer", "div", this.contentElement);
            let button = new SPLINT.DOMElement.Button(container, "grayscale", "Graustufen");
                button.onclick = function(){
                    ConverterHelper.filerGrayscale();
                }.bind(this);
    }
}