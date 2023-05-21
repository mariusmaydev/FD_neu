
class Authentification {
  constructor(parent = document.body){
    this.parent = parent;
    this.id = "Auth_";
    this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
    this.draw();
    this.check();
  }
  draw(){

  }
  check(){
    login.verifyAccount(S_Location.getHashes());
  }
}
function DrawAuthentification(){
  let main = getElement("AuthMain", "div", document.body.id);
      main.Class("AuthMain");

      let span1 = new SPLINT.DOMElement.SpanDiv(main, "confirmation", "Deine Emailadresse wurde bestätigt.");
      let span2 = new SPLINT.DOMElement.SpanDiv(main, "hint", "Dieser Tab schließt sich gleich.");
      
      verifyAccount(location.hash.replace("#", ""));
      asyncSleep(5, function(){close()});
}