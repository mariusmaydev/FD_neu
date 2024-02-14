
class CheckoutHead {
    constructor(parent){
      this.parent = parent;
      this.id = "checkoutHead_";
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", parent);
      this.mainElement.Class("CheckoutHead");
      this.drawLogo();
      this.draw();
    }
    drawLogo(){
        let logoContainer = new SPLINT.DOMElement("CheckoutLogoContainer", "div", this.mainElement);
            logoContainer.Class("CheckoutLogoContainer");
            this.logo = new SPLINT.DOMElement("CheckoutLogo_img", "img", logoContainer);
            this.logo.name = "CheckoutLogo";
            this.logo.onerror = function(){
                this.logo.src = PATH.images.errorSRC;
              }.bind(this);
            this.logo.src = PATH.images.logo;
    }
    
    draw(){
      this.progressDiv = new SPLINT.DOMElement(this.id + "progress", "div", this.mainElement);
      this.progressDiv.Class("progressDivMain");
        let addressDiv  = new SPLINT.DOMElement.SpanDiv(this.progressDiv, "addressDiv", "Adresse");
            addressDiv.div.Class("Field");
            addressDiv.div.onclick = async function(){
              if((await CheckoutHelper.progress(CheckoutHelper.ADDRESS))){
                CheckoutHelper.goto(CheckoutHelper.ADDRESS);
              }
            }
            this.DrawAnimationLine(this.progressDiv, 0);
  
        let sendingDiv  = new SPLINT.DOMElement.SpanDiv(this.progressDiv, "sendingDiv", "Versand");
            sendingDiv.div.Class("Field");
            sendingDiv.div.onclick = async function(){
              if((await CheckoutHelper.progress(CheckoutHelper.SENDING))){
                CheckoutHelper.goto(CheckoutHelper.SENDING);
              }
            }
            this.DrawAnimationLine(this.progressDiv, 1);
  
        let paymentDiv  = new SPLINT.DOMElement.SpanDiv(this.progressDiv, "paymentDiv", "Zahlung");
            paymentDiv.div.Class("Field");
            paymentDiv.div.onclick = async function(){
              if((await CheckoutHelper.progress(CheckoutHelper.PAYMENT))){
                CheckoutHelper.goto(CheckoutHelper.PAYMENT);
              }
            }
            this.DrawAnimationLine(this.progressDiv, 2);
  
        let overviewDiv = new SPLINT.DOMElement.SpanDiv(this.progressDiv, "overviewDiv", "Übersicht");
            overviewDiv.div.Class("Field");
            overviewDiv.div.onclick = async function(){
              if((await CheckoutHelper.progress(CheckoutHelper.CHECKORDER))){
                CheckoutHelper.goto(CheckoutHelper.CHECKORDER);
              }
            }
            // this.DrawAnimationLine(this.progressDiv, 3);
  
  
    }
    DrawAnimationLine(parent, index){
      let LineDiv = new SPLINT.DOMElement("LineDiv_" + index, "div", parent.id);
           LineDiv.classList.add("LineDiv");
        return new SPLINT.DOMElement("Line_" + index, "hr", LineDiv.id);
   }
   static refresh(index){
        for(let e = 0; e < index; e++){
          let line = document.getElementById("Line_" + e);
          line.style.width = "100%";
        
      }
      let i = index;
      animate(i, index);
      function animate(i, index){
        setTimeout(function() {
          let line = document.getElementById("Line_" + i);
          line.style.animationName = "NavBarLine";
          i++;
          if(i <= index){
            animate(i, index);
          } else {
            // line.parentNode.nextSibling.classList.add("bold");
          }
        }, 800);
      }
    }
  }
  
  
  