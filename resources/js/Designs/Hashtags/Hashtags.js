class Hashtags{
  static GET    = "GET";
  static REMOVE = "REMOVE";
  static ADD    = "ADD";
  static PATH   = PATH.php.hashtags;
  static get(){
    let data = SPLINT.Data.CallPHP_OLD.getCallObject(Hashtags.GET);
    let a = SPLINT.Data.CallPHP_OLD.call(Hashtags.PATH, data).toObject();
    if(a == null){
      a = [];
    }
    return a;
  }
  static add(name){
    let data = SPLINT.Data.CallPHP_OLD.getCallObject(Hashtags.ADD);
        data.HashtagName = name;
        SPLINT.Data.CallPHP_OLD.call(Hashtags.PATH, data);
  }
  static remove(hashtagName){
    let data = SPLINT.Data.CallPHP_OLD.getCallObject(Hashtags.REMOVE);
        data.HashtagName = hashtagName;
        SPLINT.Data.CallPHP_OLD.call(Hashtags.PATH, data);
  }
}

class drawHashtags {
  constructor(parent){
    this.parent = parent;
    this.onsearch = function(){};
  }
  drawMenuSmall(hashtags){
    this.mainElementS = new SPLINT.DOMElement(this.parent.id + "HashtagMenuSmall", "div", this.parent);
    this.mainElementS.Class("HashtagMenuSmall");

    if(typeof hashtags == 'object'){
    } else if(typeof hashtags == 'string' && hashtags != ""){
      hashtags = JSON.parse(hashtags);
    } else {
      return;
    }

    for(let i = 0; i < hashtags.length; i++){
      let hashtag = hashtags[i];
      let hashtagElement = new SPLINT.DOMElement.SpanDiv(this.mainElementS, "hashtagElement_" + i, "#" + hashtag);
    }
  }
  drawListMenu(type = "PUBLIC"){
    this.mainElementL = new SPLINT.DOMElement(this.parent.id + "HashtagListMenu", "div", this.parent);
    this.mainElementL.Class("HashtagListMenu");

    let hashtags = Hashtags.get();
    for(let i = 0; i < hashtags.length; i++){
      let listElement = new SPLINT.DOMElement.SpanDiv(this.mainElementL, "hashtagElement_" + i, "#" + hashtags[i].HashtagName);
          listElement.div.onclick = function(){
            // this.state().toggle()
            this.onsearch(hashtags[i].HashtagName);
          }.bind(this);
          // let button_remove = new Button(listElement.div, "remove");
          //     button_remove.bindIcon("delete");
    }

  }

}

function HashtagMenu(parent){
  let func_hashtagChange;
  let Flag_buttonRemove = false;
  let main = getElement(parent.id + "_HashtagMenuMain", "div", parent.id);
      main.Class("HashtagMenuMain");

      draw();

  function draw(){
    let data = Hashtags.get();
    for(let i = 0; i < data.length; i++){
      let button = new snapButton(main, data[i].HashtagName);
          button.OnClick(function(flag){
            if(flag){
              PHP_sessions.hashtags().add(data[i].HashtagName);
            } else {
              PHP_sessions.hashtags().remove(data[i].HashtagName);
            }
            func_hashtagChange(flag);
          });
          let buttonRemove = false;
          if(Flag_buttonRemove){
            buttonRemove = getButton(button.button, "remove", "X");
            buttonRemove.onclick = function(){
              Hashtags.remove(data[i].HashtagName);
              draw();
              button.button.remove();
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
}

function getHashtags(){
  let data = SPLINT.Data.CallPHP_OLD.getCallObject("GET");
  let a = SPLINT.Data.CallPHP_OLD.call(PATH.php.hashtags, data).toObject();
  if(a == null){
    a = [];
  }
  return a;
}

function newHashtag(name, type){
  let data = SPLINT.Data.CallPHP_OLD.getCallObject("ADD");
      data.HashtagName = name;
  let output = SPLINT.Data.CallPHP_OLD.call(PATH.php.hashtags, data).text;
  console.log(output);
  if(output != ""){
    return JSON.parse(output);
  } else {
    return [];
  }
}

function removeHashtag(HashtagName){
  let data = SPLINT.Data.CallPHP_OLD.getCallObject("REMOVE");
      data.HashtagName = HashtagName
  return SPLINT.Data.CallPHP_OLD.call(PATH.php.hashtags, data);
}

function DrawHashtagUI_new(parent, type){
  let HashtagUI_new = getElement("HashtagUI_new", "div", parent.id);
      HashtagUI_new.classList.add("HashtagUI_new");
      let HashtagInput = getElement("HashtagUI_new_input", "input", HashtagUI_new.id);
      let buttonSave = getElement("HashtagUI_new_buttonSave", "button", HashtagUI_new.id);
          buttonSave.innerHTML = "Speichern";
          buttonSave.onclick = function(){
            newHashtag(HashtagInput.value, type);
            HashtagUI_new.remove();
            if(type == "image"){
              DrawImagesMAIN();
            }
          }
}

function DrawHashtagUI_list(parent, type = "image"){
  let HashtagUI_list = getElement("HashtagUI_list", "div", parent.id);
      HashtagUI_list.classList.add("HashtagUI_list");
      let hashtags = getHashtags(undefined, type);
      for(let i = 0; i < hashtags.length; i++){
        let listElement = getElement("HashtagUI_list_element" + i, "div", HashtagUI_list.id);
            let name = getElement("HashtagUI_list_element_name" + i, "span", listElement.id);
                name.innerHTML = hashtags[i].HashtagName;
            let buttonRemove = getElement("HashtagUI_list_element_buttonRemove" + i, "button", listElement.id);
                buttonRemove.innerHTML = "x";
                buttonRemove.onclick = function(){
                  removeHashtag(hashtags[i].HashtagName, type);
                  if(type == "image"){
                    DrawImagesMAIN();
                  }
                }
      }
}

function DrawHashtagUI_Menu_USER(parent, type){
  
  let s_hashtags = MenuSession.get().filter;
      console.log(s_hashtags);
  let Main = getElement("HashtagUI_Menu_USER", "div", parent.id);
      Main.className = "HashtagMenuUser";
  let hashtags = getHashtags(undefined, type);
  for(let i = 0; i < hashtags.length; i++){
    let listElement = getElement("HashtagUI_list_element" + i, "div", Main.id);
        if(s_hashtags != "" && JSON.parse(s_hashtags).includes(hashtags[i].HashtagName)){
          listElement.className = "activeHashtag";
        } else {
          listElement.className = "passiveHashtag";
        }
        let name = getElement("HashtagUI_list_element_name" + i, "span", listElement.id);
            name.innerHTML = hashtags[i].HashtagName;
        listElement.onclick = function(){
          let s_hashtags = MenuSession.get().filter;
          let array = [];
          if(listElement.classList.contains("passiveHashtag")){
            listElement.className = "activeHashtag";
            if(s_hashtags != ""){
              array = JSON.parse(s_hashtags);
              array.push(hashtags[i].HashtagName);
            } else {
              array = [hashtags[i].HashtagName];
            }
            MenuSession.filter(JSON.stringify(array));
          } else {
            listElement.className = "passiveHashtag";
            if(s_hashtags != ""){
              array = JSON.parse(s_hashtags);
              array = SPLINT.Tools.removeFromArray(array, hashtags[i].HashtagName);
            } else {
              array = [];
            }
            MenuSession.filter(JSON.stringify(array));
          }

          if(type == "image"){
            DrawImageList(document.getElementById("ImageMenuMain"));
          } else {
            // DrawDesignList(document.getElementById("DesignMenuMain"));
          }
        }
  }
  // organizeElements(Main, hashtags.length);
}

// function organizeElements(parent, length){
//   let parentWidth = parent.clientWidth;
//       // console.log(getInnerWidth(parent), parentWidth);
//   let widthList = [];
//   for(let i = 0; i < length; i++){
//     let hashtag = document.getElementById("HashtagUI_list_element" + i);
//     // console.log(hashtag.clientWidth);
//     // console.log(getDistanceToParent(parent, hashtag));
//     // console.log("button", getInnerWidth(hashtag));
//     widthList[i] = new Object();
//     widthList[i].width = hashtag.getBoundingClientRect().width;
//   }
//   console.log(widthList);

// }

// function getDistanceToParent(parent, child){
//   let parentLeft = parent.getBoundingClientRect().left;
//   let childRight = child.getBoundingClientRect().right;
//   return childRight - parentLeft;
// }

// function getInnerWidth( elm ){
//   var computed = getComputedStyle(elm),
//       padding = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);

//   return elm.clientWidth - padding
// }
