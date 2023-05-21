
function ADMIN_drawImageList(parent){
  draw();
  function draw(filter){
        let imageData = ImageHelper.get(undefined, [], undefined, filter).toObject(true);
        if(imageData == null){
          return;
        }
    let test = new AdaptiveTable(parent);
        test.generate("DesignImageList", imageData, function(columnElement, index, resolveFunc){
          let imageObj = imageData[index];
          let hashtags = imageObj.Hashtags;
              if(hashtags != ""){
                hashtags = JSON.parse(hashtags);
              } else {
                hashtags = [];
              }
          let element = getElement("DesignList_" + test.name + "_Element_" + index, "div", columnElement.id);
              element.Class("DesignListImageElement");
              let img = getElement("DesignList_" + test.name + "_ElementImg_" + index, "img", element.id);
                  img.src = imageObj.ImageScalePath;
                  img.onload = function(){
                    resolveFunc();
                  }
              element.onmouseenter = function(){
                if(document.getElementById("DesignList_" + test.name + "_HoverDiv_") != null){
                  document.getElementById("DesignList_" + test.name + "_HoverDiv_").remove();
                }
                let hoverDiv = getElement("DesignList_" + test.name + "_HoverDiv_", "div", element.id);
                    hoverDiv.Class("hoverDiv");
                    hoverDiv.onmouseleave = function(){
                      hoverDiv.remove();
                    }
                    let informationDiv = getElement(parent.id + "_DesignListInformationDiv_" + index, "div", hoverDiv.id);
                        let hashtagsDiv = new ADMIN_HashtagMenu(informationDiv, hashtags);
                            hashtagsDiv.draw();
                            hashtagsDiv.onHashtagChange(function(flag, HashtagName){
                              if(!flag){
                                hashtags.splice(hashtags.indexOf(HashtagName), 1);
                              } else {
                                hashtags.push(HashtagName);
                              }
                              imageObj.Hashtags = JSON.stringify(hashtags);
                              ImageHelper.edit(imageObj);
                            });
                    let StatusDiv = getElement(parent.id + "StatusDiv" + index, "div", informationDiv.id);
                        StatusDiv.Class("StatusDiv");
                        let obj = [];
                  
                            obj[0] = new Object();
                            obj[0].id     = "BLOCKED";
                            obj[0].name   = "blockieren";
                                    
                            obj[1] = new Object();
                            obj[1].id     = "OPEN";
                            obj[1].name   = "freigeben";

                        let radio = new radioButton(StatusDiv, "Status" + index, obj);
                            radio.onChange(function(e){
                              imageObj.ImageStatus = radio.getValue();
                              ImageHelper.edit(imageObj);
                            });
                            radio.preventLines(true);
                            if(imageObj.ImageStatus == "BLOCKED"){
                              radio.getInput(0).checked = true;
                            } else if(imageObj.ImageStatus == "OPEN"){
                              radio.getInput(1).checked = true;
                            }
              }
        });
  }

  this.setFilter = function(filter){
    draw(filter);
  }
  this.draw = function(){
    draw();
  }
}

// function ADMIN_drawImageList(parent){
//   let main = getElement(parent.id + "_DesignListMain", "div", parent.id);
//       main.Class("DesignListMain");
//       let list = getElement(parent.id + "_DesignListDiv", "div", main.id);
//       draw("ALL");
//   function draw(filter){
//     list.clear();
//     let imageData = ImageHelper.get();
//     if(imageData == null){
//       return;
//     }

//     for(let i = 0; i < imageData.length; i++){
//       let imageObj = imageData[i];
//       let hashtags = imageObj.Hashtags;
//       if(hashtags != ""){
//         hashtags = JSON.parse(hashtags);
//       } else {
//         hashtags = [];
//       }

//       let listElement = getElement(parent.id + "_DesignListElement_" + i, "div", list.id);
//           listElement.Class("ListElement");
          
//           let thumbnailDiv = getElement(parent.id + "_DesignListThumbnailDiv_" + i, "div", listElement.id);
//               let thumbnailElement = getElement(parent.id + "_DesignListThumbnail_" + i, "img", thumbnailDiv.id);
//                   thumbnailElement.src = srcBase64(imageObj.ImageScale); 

//           let informationDiv = getElement(parent.id + "_DesignListInformationDiv_" + i, "div", listElement.id);
//               let hashtagsDiv = new ADMIN_HashtagMenu(informationDiv, hashtags);
//                   hashtagsDiv.draw();
//                   hashtagsDiv.onHashtagChange(function(flag, HashtagName){
//                     if(!flag){
//                       hashtags.splice(hashtags.indexOf(HashtagName), 1);
//                     } else {
//                       hashtags.push(HashtagName);
//                     }
//                     imageObj.Hashtags = JSON.stringify(hashtags);
//                     ImageHelper.edit(imageObj);
//                   });
//               let StatusDiv = getElement(parent.id + "StatusDiv" + i, "div", informationDiv.id);
//                   StatusDiv.Class("StatusDiv");
//                   let obj = [];
                  
//                   obj[0] = new Object();
//                   obj[0].id     = "BLOCKED";
//                   obj[0].name   = "blockieren";
            
//                   obj[1] = new Object();
//                   obj[1].id     = "OPEN";
//                   obj[1].name   = "freigeben";
              
//                   let radio = new radioButton(StatusDiv, "Status" + i, obj);
//                       radio.onChange(function(e){
//                         imageObj.ImageStatus = radio.getValue();
//                         ImageHelper.edit(imageObj);
//                       });
//                       radio.preventLines(true);
//                       if(imageObj.ImageStatus == "BLOCKED"){
//                         radio.getInput(0).checked = true;
//                       } else if(imageObj.ImageStatus == "OPEN"){
//                         radio.getInput(1).checked = true;
//                       }
//     }
//   }

//   this.setFilter = function(filter){
//     draw(filter);
//   }
//   this.draw = function(){
//     draw();
//   }
// }