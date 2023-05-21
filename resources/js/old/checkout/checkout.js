
class drawCheckout extends Pages_template {
    constructor() {
        super("checkout");
    }
    draw(){
        this.innerMainElement = new SPLINT.DOMElement(this.id + "_inner_main", "div", this.mainElement);
        this.innerMainElement.Class("inner");
            this.leftPart = new SPLINT.DOMElement(this.id + "left", "div", this.innerMainElement);
            this.leftPart.Class("left");


            this.rightPart = new SPLINT.DOMElement(this.id + "right", "div", this.innerMainElement);
            this.rightPart.Class("right");

            this.drawLeftPart();
            this.drawRightPart();
    }
    drawRightPart(){
        this.rightPartInnerBody = new SPLINT.DOMElement(this.id + "right_innerBody", "div", this.rightPart);
        this.rightPartInnerBody.Class("innerBody");

        let contentBody = new SPLINT.DOMElement(this.id + "right_contentBody", "div", this.rightPartInnerBody);
            contentBody.Class("contentBody");

            this.contentRight = new SPLINT.DOMElement(this.id + "right_content", "div", contentBody); 
            this.contentRight.Class("content");
    }
    drawLeftPart(){
        this.leftPartInnerBody = new SPLINT.DOMElement(this.id + "left_innerBody", "div", this.leftPart);
        this.leftPartInnerBody.Class("innerBody");
            let head = new SPLINT.DOMElement(this.id + "left_head", "div", this.leftPartInnerBody);
                head.Class("head");

                let logoBody = new SPLINT.DOMElement(this.id + "logo_Body", "div", head);
                    logoBody.Class("logo");
                    let logo = new SPLINT.DOMElement(this.id + "logo", "img", logoBody);
                        logo.src = PATH.images.logo;

                let progress = new SPLINT.DOMElement(this.id + "progress", "div", head);
                    progress.Class("progress");

            let contentBody = new SPLINT.DOMElement(this.id + "left_contentBody", "div", this.leftPartInnerBody);
                contentBody.Class("contentBody");

                this.contentLeft = new SPLINT.DOMElement(this.id + "left_content", "div", contentBody); 
                this.contentLeft.Class("content");

                let t = new drawCheckoutAddress(this.contentLeft);
                this.drawControls();
    }
    drawControls(){
        this.controlsBody = new SPLINT.DOMElement(this.id + "controlsBody", "div", this.contentLeft);
        this.controlsBody.Class("controlsBody");
            this.btNext = new SPLINT.DOMElement.Button(this.controlsBody, "next", "next");
            this.btNext.button.Class("next");
    }
}