
class ImageMenuFilter {
  constructor(parent, index = 0, ImageMenuInstance = null){
    this.ImageMenuInstance = ImageMenuInstance;
    this.parent = parent;
    this.index = index;
    this.id = "ImageMenuFilter_" + index;
    this.mainElement = new SPLINT.DOMElement(this.id + "_MAIN", "div", parent);
    this.mainElement.Class("ImageMenuFilter");
    this.onsearch = function(){};
    this.draw();
  }
  draw(){
    // this.drawModeSwitch();
    let buttonClose = new SPLINT.DOMElement.Button(this.mainElement, this.id + "close");
        buttonClose.bindIcon("close");
        buttonClose.onclick = function(){
            this.ImageMenuInstance.close();
        }.bind(this);
    this.searchBar = new SPLINT.DOMElement.InputDiv(this.mainElement, "searchBar", "suche");
    this.searchBar.type = "search";
    let sugg = new SPLINT.DOMElement("sugg", "datalist", this.searchBar.mainElement);
        let opt1 = new SPLINT.DOMElement(null, "option", sugg);
            opt1.innerHTML = "BMW";
            let opt2 = new SPLINT.DOMElement(null, "option", sugg);
                opt2.innerHTML = "DFR";
    this.searchBar.input.autocomplete = true;
    this.searchBar.input.setAttribute("list", "sugg");
      let bt = this.searchBar.drawToggleButton();
          bt.bindIcon("search");
          bt.onchange = function(){
            this.onsearch(this.searchBar.value);
          }.bind(this);
        KeyInput.new(this.searchBar.input, KeyInput.KEY_DOWN, function(e){
          if(e.key == 'Enter'){
            bt.button.click();
          }
        });
        let hashtagMenu = new drawHashtags(this.mainElement);
            hashtagMenu.onsearch = function(s){
              this.onsearch(s);
            }.bind(this)
            hashtagMenu.drawListMenu();
        // DrawHashtagUI_list(this.mainElement);
  }
  drawModeSwitch(){
  }
}











function DrawFilter(parent){
  let main = getElement("ImageMenuFilterDiv", "div", parent.id);
      main.className = "ImageMenuFilter";

      DrawModeSwitch(main);
      DrawSearchBar(main);
      // DrawHashtagUI_Menu_USER(main, "image");
      DrawCategoryMenu(main);
}

function DrawModeSwitch(parent){
  // let main = getElement("ImageFilterModeSwitchDiv", "div", parent.id);
  //     main.className = "ImageFilterModeSwitch";
  //     createSwitch(main, "privat", "Funkendesign", 
  //       function(e, switchState){
  //         MenuSession.mode("PRIVATE");
  //         switchState();
  //         DrawImageList(document.getElementById("ImageMenuMain"));
  //       }, 
  //       function (e, switchState){
  //         MenuSession.mode("");
  //         switchState();
  //         DrawImageList(document.getElementById("ImageMenuMain"));
  //       },
  //       function (parent){
  //         let mode = getMenuSessions("image").mode;
  //         console.log(mode)
  //         if(mode == "PRIVATE"){
  //           return parent.querySelector('[index="1"]');
  //         } else {
  //           return parent.querySelector('[index="2"]');
  //         }
  //       });
}

function DrawCategoryMenu(parent){
  let main = getElement("ImageFilterCategoryDiv", "div", parent.id);

      let button_latest = getElement("ImageFilterCategoryButton_latest", "button", main.id);
          button_latest.innerHTML = "neuste";
          button_latest.onclick = function(){
            setMenuSession("image", undefined, undefined, "latest");
            DrawImageList(document.getElementById("ImageMenuMain"));
          }
}

function DrawSearchBar(parent){
  let main = getElement("ImageFilterSearchBarDiv", "div", parent.id);
      main.className = "ImageFilterSearchBar";
      let headerDiv = getElement("ImageFilterSearchBarHeaderDiv", "div", main.id);
          let header = getElement("ImageFilterSearchBarHeader", "span", headerDiv.id);
              header.innerHTML = "Suche";

      let input = getElement("ImageFilterSearchBarInput", "input", main.id);
          input.oninput = function(){

          }
}

function sortForCategory(imageJSON, category){
  let newJSON = [];
  if(false && category == 'latest'){
    let DateArray = [];
    for(let i = 0; i < imageJSON.length; i++){
      let Data = imageJSON[i];
      DateArray[i] = Data.Date;
    }
    DateArray.sort(function(a, b) {
      return parseFloat(b) - parseFloat(a);
    });
    for(let i = 0; i < DateArray.length; i++){
      newJSON[i] = getJSONindexForParameter(imageJSON, "Date", DateArray[i]);
    }
  } else {
    newJSON = imageJSON;
  }
  if(typeof newJSON == 'string'){
    return JSON.parse(newJSON);
  } else {
    return newJSON;
  }
}


