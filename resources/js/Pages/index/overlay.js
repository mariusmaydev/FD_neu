
class indexOverlay {
    static  calls = {
        cover:          "cover",
        color:          "color",
        colors_double:  "colors_double",
        smoothTurn:     "smoothTurn",
        flame:          "flame",
        wheel:          "wheel",
        explosion:      "explosion",
        engraving:      "engraving"
    }
    constructor(parentInstance) {
        this.parentInst = parentInstance;
        this.parent = parentInstance.mainElement;
        this.id = "indexOverlay_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("indexOverlayMain");
        this.contentElement = new SPLINT.DOMElement(this.id + "content_main", "div", this.mainElement);
        this.contentElement.Class("indexOverlayContent");
        this.draw();
        this.activePart = 1;
        this.max = 4;
        this.calls = indexOverlay.calls;
        this.lastCall = null;
        this.waiters = [];
        this.wait = new PromiseTimeout("test", 10, false);
        this.base = 0;
    }
    draw(){
        this.drawPart1();
        this.drawPart2();
        this.drawPart3();
        this.drawPart4();
    }
    drawPart1(){

        this.part1 = new indexOverlayPart(this.contentElement, "start");
        //412x828
        //2048x991
        this.part1.addText("part1_1", "", null, "part1_1");
        // this.part1.addText("part1_2", JSON.stringify(window.innerWidth), null, "part1_1");
    }
    drawPart2(){
        this.part2 = new indexOverlayPart(this.contentElement, "colors");
        this.part2.addText("part2_1", "Feingold oder Chrom. Du hast die Wahl.", null, "part2_1");
        // this.part2.drawNavigatorButtons();
        // this.part2.text = "Feingold oder Chrom. Du hast die Wahl.";
        // this.part1.setText(); 
    }
    drawPart3(){
        this.part3 = new indexOverlayPart(this.contentElement, "engraving");
        this.part3.addText("part3_1", "Die Gravur", "Die CNC gefräßte Gravur bietet eine besondere Haptik. Zudem ist sie um ein vielfaches beständiger als herkömmliche Laser-Gravuren.", "part3_1");
        this.part3.addText("part3_2", "Die Beschichtung", "Das Feuerzeug liegt durch die bis 800°C beständige Pulverbeschichtung gut in der Hand und ist garantiert kratzfest.", "part3_2");

        // this.part3.drawNavigatorButtons();
        // this.part1.setText(); 
    }
    drawPart4(){
        this.part4 = new indexOverlayPart(this.contentElement, "surface");        
        this.part4.addText("part4_1", "Reparieren statt wegschmeißen.", 
        "Unsere Feuerzeuge bestehen fast komplett aus Metal, was für eine deutlich längere Haltbarkeit sorgt.<br>"+
        "Muss dennoch ein Bauteil getauscht werden, so ist dies durch den einfachen, modularen Aufbau schnell und einfach getan.<br>", 
        "part4_1");
        let footer_body = new SPLINT.DOMElement("footer_body", "div", this.part4.contentElement);
            footer_body.Class("footer");
        let footer_imprint = new SPLINT.DOMElement.Button(footer_body, "footer_imprint", "Impressum");
            footer_imprint.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_STANDARD);
            footer_imprint.Class("imprint");
            footer_imprint.onclick = function(){
                S_Location.goto(PATH.location.imprint).call();
            }
        let footer_Contact = new SPLINT.DOMElement.Button(footer_body, "footer_contact", "Kontakt");
            footer_Contact.setStyleTemplate(SPLINT.DOMElement.Button.STYLE_STANDARD);
            footer_Contact.Class("contact");
            footer_Contact.onclick = function(){
                S_Location.goto(PATH.location.imprint).call();
            }
        // this.part4.drawNavigatorButtons();

        // this.part4.text =   "Reparieren statt wegschmeißen.<br>"+
        //                     "Unsere Feuerzeuge bestehen fast komplett aus Metal, was für eine deutlich längere Haltbarkeit sorgt.<br>"+
        //                     "Muss dennoch ein Bauteil getauscht werden, so ist dies durch den einfachen, modularen Aufbau schnell und einfach getan.<br>";
        // this.part1.setText(); 
    }
    send(type, value){
        this.parentInst.Lighter.send(type, value);
    }
    call3D_remove(amount = 1, start = "right"){
        let obj = new Object();
            obj.type        = "remove";
            obj.start       = start;
            obj.amount      = amount;
        this.parentInst.Lighter.send(obj);
    }
    call3D_toggle(call = null, delayIn = 0, durationIn, ...elements){
        let obj = new Object();
            obj.type        = "animation"; 
            obj.name            = call;
            obj.delay           = delayIn;
            obj.duration        = durationIn;
            obj.mode            = "toggle";
            obj.elements        = elements;
        this.parentInst.Lighter.send(obj);
        // this.lastCall = call;
    }
    call3D(call = null, delayOpen = 0, delayClose = 0, durationOpen, durationClose){
        if(call == this.lastCall){
            return;
        }
        let obj = new Object();
            obj.type        = "animation"; 
            obj.close       = new Object();
            obj.close.name      = this.lastCall;
            obj.close.delay     = delayClose;
            obj.close.duration  = durationClose;
            obj.open            = new Object();
            obj.open.name       = call;
            obj.open.delay      = delayOpen;
            obj.open.duration   = durationOpen;
        this.parentInst.Lighter.send(obj);
        this.lastCall = call;
    }
    animateScroll(indexBefore, index){
        timeTools.sleep(400).then(function(){
            if(index == this.activePart){

                switch(index) {
                    case 1 : {
                        this.send("interaction", true)
                        this.send("mouseTurn", true)
                        this.call3D();
                    } break;
                    case 2 : {      
                        this.send("interaction", true)
                        this.send("mouseTurn", false)
                        this.send("smoothTurn", false);
                        this.call3D_toggle("turnBack");
                        setTimeout(function(){
                            this.call3D(this.calls.colors_double, 0, 0);
                        }.bind(this), 100)    
                    } break;
                    case 3 : {
                        this.send("interaction", false)
                        this.send("mouseTurn", true)
                        this.call3D_toggle("turnBack");
                        setTimeout(function(){
                            this.call3D(this.calls.engraving, 0, 0);
                        }.bind(this), 100)    
                    } break;
                    case 4 : {
                        this.send("interaction", false)
                        this.send("mouseTurn", true)
                        this.call3D_toggle("turnBack");
                        setTimeout(function(){
                            this.call3D(this.calls.explosion, 0, 0);
                        }.bind(this), 100)    
                    } break;
                }
                this.animate();
            }
        }.bind(this));
        let height = this.contentElement.clientHeight;
        if(index == 5 || (index == 4 && this.scrollFlag == "up")){
            this.scrollDelta = parseInt(S_Math.divide(parseInt(Footer.mainElement.clientHeight), 10));
            if(this.scrollFlag == "up"){
                this.scrollAim = parseInt(S_Math.multiply((index - 1), height));
            } else {
                this.scrollAim = parseInt(S_Math.multiply((index - 2), height)) + parseInt(Footer.mainElement.clientHeight);

            }
        } else {
            this.scrollDelta = parseInt(S_Math.divide(height, 20));
            this.scrollAim = parseInt(S_Math.multiply((index - 1), height));
        }
        this.animate();
    }
    animate(){
        if(this.scrollFlag == 'up'){
            if(this.contentElement.scrollTop > this.scrollAim){
                this.contentElement.scrollTop = S_Math.add(this.contentElement.scrollTop, - this.scrollDelta);
                if(this.contentElement.scrollTop < this.scrollAim){
                    this.contentElement.scrollTop = this.scrollAim;
                    return;
                }
            } else {
                return;
            }
        } else if(this.scrollFlag == 'down'){
            if(this.contentElement.scrollTop < this.scrollAim){
                this.contentElement.scrollTop = S_Math.add(this.contentElement.scrollTop, this.scrollDelta);
                if(this.contentElement.scrollTop > this.scrollAim){
                    this.contentElement.scrollTop = this.scrollAim;
                    return;
                }
            } else {
                return;
            }
        } 
        if(Math.abs(this.contentElement.scrollHeight - this.contentElement.clientHeight - this.contentElement.scrollTop) < 1){
            return;
        }
        requestAnimationFrame(this.animate.bind(this));
    }
    addScrollHeight(){

    }
    setScrollHeight(indexBefore, index){
        this.contentElement.scrollTop = (index - 1) * this.contentElement.getBoundingClientRect().height;
    }
    scrollDown(){
        let index = parseInt(this.activePart);
        if(index < 4){
            this.activePart = index + 1;
        }
        this.scrollFlag = 'down';
        this.animateScroll(index, this.activePart);
    }
    scrollUp(){
        let index = parseInt(this.activePart);
        if(index > 1){
            this.activePart = index - 1;
        }
        this.scrollFlag = 'up';
        this.animateScroll(index, this.activePart);
    }
    scrollBack(scrollFlag){
        let index = parseInt(this.activePart);
        this.scrollFlag = scrollFlag;
        this.animateScroll(index, this.activePart);
    }
    dynamicScroll(rate){
        if(this.wait.resolved){
            let b = window.innerHeight / 100 * rate;
            this.contentElement.scrollTop = this.base - (b);
            if(rate > 60){
                this.scrollUp();
                this.wait = new PromiseTimeout("test", 300, false);
                return true;
            } else if(rate < -60) {
                this.scrollDown();
                this.wait = new PromiseTimeout("test", 300, false);
                return true;
            }
            return false;
        }
        this.base = this.contentElement.scrollTop;
        return true;
    }
    dynamicScrollStart(){
        this.base = this.contentElement.scrollTop;
    }
    dynamicScrollEnd(){
        let dif = this.base - this.contentElement.scrollTop;
        let rate = -100 / window.innerHeight * (this.contentElement.scrollTop - this.base);
        console.log(rate)
        if(rate >= 30){
            this.scrollUp();
        } else if(rate <= -30) {
            this.scrollDown();
        } else {
            if(rate >0){
                this.scrollBack('down');
            } else {
                this.scrollBack('up');
            }
        }
    }

}

class indexOverlayPart {
    constructor(parent, name){
        this.parent = parent;
        this.name   = name;
        this.id     = parent.id + "_part_" + name + "_";
        this._text  = "";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("part");
        this.mainElement.setAttribute("index", name);
        this.contentElement = new SPLINT.DOMElement(this.id + "content_main", "div", this.mainElement);
        this.contentElement.Class("content");
    }
    addText(name, headline = null, text = null, CSSclass){
        let textBody = new SPLINT.DOMElement(this.id + "textBodyEle_" + name, "div", this.contentElement); 
            textBody.Class(CSSclass);
            textBody.Class("textBody");
            if(headline != null){
                let textHeadline = new SPLINT.DOMElement(this.id + "textHeadlineEle_" + name, "p", textBody);
                    textHeadline.Class("headline");
                    textHeadline.innerHTML = headline;
            }
            if(text != null){
                let textContent = new SPLINT.DOMElement(this.id + "textContentEle_" + name, "p", textBody);
                    textContent.Class("content");
                    textContent.innerHTML = text;
            }
        return textBody;
    }
    drawNavigatorButtons(){
        this.NavigatorBottomContainer = new SPLINT.DOMElement(this.id + "NavigatorBottomContainer", "div", this.mainElement);
        this.NavigatorBottomContainer.Class("NavigatorBottomContainer");
            let button = new SPLINT.DOMElement.Button(this.NavigatorBottomContainer, "navigatorBottom");
                button.bindIcon("arrow_back_ios_new");
    }
    hideText(){
        this.textBody.style.visibility = "hidden";
    }
    showText(){
        this.textBody.style.visibility = "visible";
    }
    removeText(){
        this.textBody.remove();
    }

}