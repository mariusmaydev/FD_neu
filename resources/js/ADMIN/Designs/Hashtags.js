function ADMIN_HashtagMenu(parent, hashtags = []){
  let func_hashtagChange;
  let func_onDraw = function(){};
  let Flag_drawInput = false;
  let Flag_buttonRemove = false;
  let main = getElement(parent.id + "_HashtagMenuMain", "div", parent.id);
      main.Class("HashtagMenuMain");
      let headline = new SPLINT.DOMElement.SpanDiv(main, "headline", "Hashtags");

      new SPLINT.DOMElement.HorizontalLine(main);
      let scrollDiv = getElement(parent.id + "_HashtagMenuScrollDiv", "div", main.id);
      let list = getElement(parent.id + "_HashtagMenuList", "div", scrollDiv.id);
          list.Class("list");

          new SPLINT.DOMElement.HorizontalLine(main);

  function draw(){
    list.clear();
    if(Flag_drawInput){
      let submitDiv = getElement(parent.id + "_HashtagInputDiv", "div", main.id);
          submitDiv.Class("submitDiv");
          let input = new InputDiv(submitDiv, "HashtagInput", "neues Hashtag");
          let buttonSubmit = getButton(submitDiv, "submit", "speichern");
              buttonSubmit.onclick = function(){
                Hashtags.add(input.getValue());
                func_onDraw();
                draw();
              }
    }
    let data = Hashtags.get();
    for(let i = 0; i < data.length; i++){
      let ele = null;
      if(Flag_drawInput){
        let showDiv = new SPLINT.DOMElement.SpanDiv(list, "show" + i, data[i].HashtagName);
            showDiv.Class("showDiv").set();
        ele = showDiv.div;
      } else {
        let button = new snapButton(list, data[i].HashtagName);
            button.OnClick(function(flag){
              func_hashtagChange(flag, data[i].HashtagName, button);
            });
        ele = button.button;
      }
      if(hashtags.includes(data[i].HashtagName)){
        ele.classList.add("button-active");
      } else {
        ele.classList.remove("button-active");
      }
      if(Flag_buttonRemove){
        let buttonRemove = new SPLINT.DOMElement.Button(ele, "remove");
            buttonRemove.disableStandard(false);
            buttonRemove.bindIcon("delete");
            buttonRemove.button.onclick = function(){
              Hashtags.remove(data[i].HashtagName);
              // buttonRemove.remove();
              draw();
            }
      }
    }
    
  }
  this.onHashtagChange = function(func){
    func_hashtagChange = func;
  }
  this.drawButtonRemove = function(value){
    Flag_buttonRemove = value;
    draw();
  }
  this.drawInput = function(value){
    Flag_drawInput = value;
    draw();
  }
  this.draw = function(){
    draw();
  }
  this.onDraw = function(func){
    func_onDraw = func;
  }
}