
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
    }
}