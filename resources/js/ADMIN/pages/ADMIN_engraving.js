
class ADMIN_engraving extends ADMIN_DrawTemplate {
    constructor(){
        super("engraving");
        this.draw();
    }
    draw(){
        let bt = new SPLINT.DOMElement.Button(this.mainElement, "openMailsail", "öffne Mailsail");
            bt.onclick = function(){
                window.open(SPLINT.API.Moonraker.domain, '_blank').focus();
            }
        let bt1 = new SPLINT.DOMElement.Button(this.mainElement, "showState", "state");
            bt1.onclick = function(){
                let k1 = SPLINT.API.Moonraker.getServerInfo();
                console.log(k1);
                let k = SPLINT.API.Moonraker.deleteFile("4d625e801e_1_Model.gcode");
                console.log(k);
                // window.open(SPLINT.API.Moonraker.domain, '_blank').focus();
            }

        
    }
}