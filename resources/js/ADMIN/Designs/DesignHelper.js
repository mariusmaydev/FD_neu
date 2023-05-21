
function ADMIN_DesignList(parent){
  let main = getElement(parent.id + "_DesignListMain", "div", parent.id);
      main.Class("DesignListMain");
      let list = getElement(parent.id + "_DesignListDiv", "div", main.id);
      draw("ALL");
  function draw(filter){
    list.clear();
    let designData = JSON.parse(DesignHelper.get(undefined, [], filter));
    if(designData == null){
      return;
    }
    for(let i = 0; i < designData.length; i++){
      let design = designData[i];
      let hashtags = design.DesignHashtags;
      if(design.DesignHashtags != ""){
        hashtags = JSON.parse(hashtags);
      } else {
        hashtags = [];
      }
      console.log(hashtags);

      let listElement = getElement(parent.id + "_DesignListElement_" + i, "div", list.id);
          listElement.Class("ListElement");
          // let nameElement = new SPLINT.DOMElement.SpanDiv(listElement, "name", design.DesignName);
          
          let thumbnailDiv = getElement(parent.id + "_DesignListThumbnailDiv_" + i, "div", listElement.id);
              let thumbnailElement = getElement(parent.id + "_DesignListThumbnail_" + i, "img", thumbnailDiv.id);
                  thumbnailElement.src = design.PATH_thumbnail; 

          let informationDiv = getElement(parent.id + "_DesignListInformationDiv_" + i, "div", listElement.id);
              let hashtagsDiv = new ADMIN_HashtagMenu(informationDiv, hashtags);
                  hashtagsDiv.draw();
                  hashtagsDiv.onHashtagChange(function(flag, HashtagName){
                    if(!flag){
                      hashtags.splice(hashtags.indexOf(HashtagName), 1);
                    } else {
                      hashtags.push(HashtagName);
                    }
                    design.DesignHashtags = JSON.stringify(hashtags);
                    DesignHelper.edit(design);
                  });
              let StatusDiv = getElement(parent.id + "StatusDiv" + i, "div", informationDiv.id);
                  StatusDiv.Class("StatusDiv");
                  let obj = [];
                  
                  obj[0] = new Object();
                  obj[0].id     = "BLOCKED";
                  obj[0].name   = "blockieren";
            
                  obj[1] = new Object();
                  obj[1].id     = "OPEN";
                  obj[1].name   = "freigeben";
              
                  let radio = new radioButton(StatusDiv, "Status" + i, obj);
                      radio.onChange(function(e){
                        design.DesignStatus = radio.getValue();
                        DesignHelper.edit(design);
                      });
                      radio.preventLines(true);
                      if(design.DesignStatus == "BLOCKED"){
                        radio.getInput(0).checked = true;
                      } else if(design.DesignStatus == "OPEN"){
                        radio.getInput(1).checked = true;
                      }
    }
  }

  this.setFilter = function(filter){
    draw(filter);
  }
  this.draw = function(){
    draw();
  }
}

function DesignFilter(parent){
  let func_onChange = function(){};
  let main = getElement(parent.id + "_DesignFilterMain", "div", parent.id);
      main.Class("DesignFilterMain");
      let headline = new SPLINT.DOMElement.SpanDiv(main, "headline", "Filter");

      new SPLINT.DOMElement.HorizontalLine(main);

      let FilterDiv = getElement(parent.id + "_DesignFilterDiv", "div", main.id);
          let obj = [];
              obj[0] = new Object();
              obj[0].id     = "NEW";
              obj[0].name   = "Neue";
              
              obj[1] = new Object();
              obj[1].id     = "BLOCKED";
              obj[1].name   = "Blockiert";
        
              obj[2] = new Object();
              obj[2].id     = "OPEN";
              obj[2].name   = "Freigegeben";

              obj[3] = new Object();
              obj[3].id     = "ALL";
              obj[3].name   = "Alle";
          
          let radio = new radioButton(FilterDiv, "Filter", obj);
              radio.onChange(function(e){
                func_onChange(e, radio);
              });
              radio.preventLines(true);
  this.onChange = function(func){
    func_onChange = func;
  }
}

function ADMIN_DesignNavBar(parent){
  let main = getElement(parent.id + "_DesignNavBar", "div", parent.id);
      main.Class("DesignNavBarMain");    
      let buttonsDiv = getElement(parent.id + "_DesignNavBarButtonsDiv", "div", main.id);
      draw();

  function draw(){
    let buttonDesigns = getButton(buttonsDiv, "designs", "Designs");
        buttonDesigns.onclick = function(){
          window.location.hash = "designs";
        }
    let buttonImages = getButton(buttonsDiv, "images", "Bilder");
        buttonImages.onclick = function(){
          window.location.hash = "images";
        }
    let buttonHashtags = getButton(buttonsDiv, "hashtags", "Hashtags");
        buttonHashtags.onclick = function(){
          window.location.hash = "hashtags";
        }
    let buttonNewDesign = new SPLINT.DOMElement.Button(buttonsDiv, "newDesign", "neues Design");
        buttonNewDesign.onclick = function(){
          S_Location.setHash("newDesign");
        }
  }      
  this.draw = function(){
    draw();
  }  
}

