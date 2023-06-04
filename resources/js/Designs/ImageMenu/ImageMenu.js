
      //window.onresize = StartupImageMenu;

class ImageMenu {
  constructor(parent, index = 0){
    this.index  = index;
    this.id     = "ImageMenu_" + index;
    this.parent = parent;
    this.mainElement = new SPLINT.DOMElement(this.id + "_MAIN_" + this.parent.id, "div", this.parent);
    this.mainElement.Class("ImageMenu_MAIN");
    this.onClose = function(){};
    this.drawFilter();
    // this.draw();
  }
  drawBackground(){
    this.background = new SPLINT.DOMElement(this.id + "background", "div", this.parent);
    this.background.Class("Background");
    return this.background;
  }
  close(){
    this.background.remove();
    this.mainElement.remove();
    this.onClose();
  }
  drawFilter(){
    this.Filter = new ImageMenuFilter(this.mainElement, this.index, this);
    this.Filter.onsearch = function(searchValue){
      this.Filter.searchBar.value = searchValue;
      this.drawUnsplash(searchValue);
    }.bind(this);
  }
  async drawUnsplash(searchValue){
    unsplash.search(searchValue).callback = draw.bind(this);
    function draw(imageData, instance){

      //let verticalLine = new SPLINT.DOMElement(this.id + "_VerticalLine", "div", this.mainElement);
      //verticalLine.Class("divider");
  
      let session = MenuSession.get();
      let s_hashtags  = session.filter;
      let s_category  = session.category;
      let s_mode      = session.mode;
      if(document.getElementById("AdaptiveTable_test_main") != null){
        document.getElementById("AdaptiveTable_test_main").remove();
      }
      let table = new SPLINT.DOMElement.Table.Masonry(this.mainElement, "test", imageData);
          table.onDrawListElement = function(listElement, index, func_resolve){
            let data = imageData[index -((instance.page-1) * imageData.length)];
            let imgElement = new ImageElement(index, listElement);
                imgElement.onload = function(){
                  func_resolve();
                }
                imgElement.src = data.urls.small;


                let hoverDiv = new SPLINT.DOMElement("hoverDiv_" + index, "div", listElement);
                    hoverDiv.Class("hoverDiv");
                    // console.log(data);
                    let buttonDiv = new SPLINT.DOMElement("buttonDiv_" + index, "div", hoverDiv);
                        buttonDiv.Class("buttonDiv");
                    let buttonUse = new SPLINT.DOMElement.Button(buttonDiv, "use", "verwenden");
                        // buttonUse.bindIcon("done");
                        buttonUse.button.onclick = function(){
                          unsplash.download(data);
                          this.close();
                        }.bind(this);
                    let buttonView = new SPLINT.DOMElement.Button(buttonDiv, "view");
                        buttonView.bindIcon("search");
                        buttonView.onclick = function(){
                        //   unsplash.download(data);
                        //   this.close();
                        }.bind(this);
                    let informationDiv = new SPLINT.DOMElement("informationDiv_" + index, "div", hoverDiv);
                        informationDiv.Class("informationDiv");
                    let tagsDiv = new SPLINT.DOMElement("tagsDiv_" + index, "div", hoverDiv);
                        tagsDiv.Class("tagsDiv");
                        if(data.tags != undefined){
                          for(const ind in data.tags){
                            let name = data.tags[ind];
                            let button = new SPLINT.DOMElement.Button(tagsDiv, "tag_" + index + "_" + ind, name);
                                button.setStyleTemplate(S_Button.STYLE_DEFAULT);
                                button.button.onclick = function(){
                                  this.Filter.searchBar.input.value = name;
                                  this.drawUnsplash(name);
                                }.bind(this);
                            // console.log(img);
                          }
                        }
                    let bottomDiv = new SPLINT.DOMElement("bottomDiv_" + index, "div", listElement);
                        bottomDiv.Class("bottomDiv");
                        let bt_use = new SPLINT.DOMElement.Button(bottomDiv, "use", "verwenden");
                            bt_use.onclick = function(){

                            }
                    
                    hoverDiv.onmouseenter = function(){
                        bottomDiv.SPLINT.state.setActive();
                        listElement.SPLINT.state.setActive();
                    }.bind(this);
                    hoverDiv.onmouseleave = function(){
                        bottomDiv.SPLINT.state.setPassive();
                        listElement.SPLINT.state.setPassive();
                    }.bind(this);
                }.bind(this);

          table.draw();
          table.mainElement.addEventListener("scroll", function(e){
            if(table.mainElement.getScrollHeight() == 1){
              instance.callback = async function(data){
                console.log(data)
                imageData = data;
                await table.expand(data, (instance.page -1) * data.length);
                instance.progress = false;
              };
              instance.next();
            }
          });
          // let table = new AdaptiveTable(this.mainElement);
    //           table.generate(this.id, imageData, function(columnElement, index, resolveFunc){
    //             console.log("draw");
    //           let ID = this.id + "_listElement_" + index;
    //           let data = imageData[index -((instance.page-1) * imageData.length)];
    //           let listElement = new SPLINT.DOMElement(ID, "div", columnElement);
    //               listElement.Class("DesignListImageElement");
    //               let img = new SPLINT.DOMElement(ID + "_img", "img", listElement);
    //                   img.onload = function(){
    //                     resolveFunc();
    //                   }
    //                   img.src = data.urls.small;
                        
    //               let div = new SPLINT.DOMElement(ID + "_hoverDiv", "div", listElement);
    //                   div.Class("hoverDiv");
    //                   if(s_mode == "PRIVATE"){
    //                     let button_use = new Button(div, "use");
    //                         button_use.bindIcon("edit");
    //                         button_use.button.onclick = function(){
    //                           // ImageHelper.copyToProject(data.ImageID, "PRIVATE");
    //                           this.close();
    //                         }.bind(this)
                      
    //                     let button_remove = new Button(div, "remove");
    //                         button_remove.bindIcon("delete");
    //                         button_remove.button.onclick = function(){
    //                           // listElement.delete();
    //                           // ImageHelper.remove(data.ImageID, "PRIVATE");
    //                         }
    //                   } else {
    //                     let informationDiv = new SPLINT.DOMElement(ID + "_informationDiv", "div", div);
    //                         informationDiv.Class("informationDiv");
    //                         let imageName = new SPLINT.DOMElement.SpanDiv(informationDiv, "imageName", "data.ImageName");
    //                             imageName.Class("name").set();
    //                         let other = new SPLINT.DOMElement.SpanDiv(informationDiv, "other", data.Creator + " - " + data.likes + " mal benutzt");
    //                             other.Class("other").set();
  
    //                     let hashtagMenu = new drawHashtags(div);
    //                         hashtagMenu.drawMenuSmall(data.tags);
    //                   }
    //                   let button_favorite = new Button(div, "favorite");
    //                       button_favorite.bindIcon("star");
    //                   let button_use = new Button(div, "use");
    //                       button_use.bindIcon("done");
    //                       button_use.button.onclick = function(){
    //                         // console.log(data);
    //                         unsplash.download(data);
    //                         this.close();
    //                         // ImageHelper.copyToProject(data.ImageID, "PRIVATE");
    //                       }.bind(this);
    //         }.bind(this));
    //         table.mainCover.addEventListener("scroll", function(e){
    //           if(table.mainCover.getScrollHeight() == 1){
    //             instance.callback = async function(data){
    //               imageData = data;
    //               await table.expand(data, (instance.page -1) * data.length);
    //               instance.progress = false;
    //             };
    //             instance.next();
    //           }
    //         });
    };

  }
  draw(){
    this.drawUnsplash();
    return;
    let verticalLine = new SPLINT.DOMElement(this.id + "_VerticalLine", "div", this.mainElement);
        verticalLine.Class("divider");

    let session = MenuSession.get();
    let s_hashtags  = session.filter;
    let s_category  = session.category;
    let s_mode      = session.mode;
    let imageData = ImageHelper.get(undefined, s_hashtags, s_mode, undefined).toObject(true);
    console.log(imageData);
    let table = new AdaptiveTable(this.mainElement);
        table.generate(this.id, imageData, function(columnElement, index, resolveFunc){
          let ID = this.id + "_listElement_" + index;
          let data = imageData[index];
          let listElement = new SPLINT.DOMElement(ID, "div", columnElement);
              listElement.Class("DesignListImageElement");
              let img = new SPLINT.DOMElement(ID + "_img", "img", listElement);
                  img.onload = function(){
                    resolveFunc();
                  }
                  img.src = data.ImageScalePath;
                    
              let div = new SPLINT.DOMElement(ID + "_hoverDiv", "div", listElement);
                  div.Class("hoverDiv");
                  if(s_mode == "PRIVATE"){
                    let button_use = new SPLINT.DOMElement.Button(div, "use");
                        button_use.bindIcon("edit");
                        button_use.button.onclick = function(){
                          ImageHelper.copyToProject(data.ImageID, "PRIVATE");
                          this.close();
                        }.bind(this)
                  
                    let button_remove = new SPLINT.DOMElement.Button(div, "remove");
                        button_remove.bindIcon("delete");
                        button_remove.button.onclick = function(){
                          listElement.delete();
                          ImageHelper.remove(data.ImageID, "PRIVATE");
                        }
                  } else {
                    let informationDiv = new SPLINT.DOMElement(ID + "_informationDiv", "div", div);
                        informationDiv.Class("informationDiv");
                        let imageName = new SPLINT.DOMElement.SpanDiv(informationDiv, "imageName", data.ImageName);
                            imageName.Class("name").set();
                        let other = new SPLINT.DOMElement.SpanDiv(informationDiv, "other", data.Creator + " - " + data.Uses + " mal benutzt");
                            other.Class("other").set();

                    let hashtagMenu = new drawHashtags(div);
                        hashtagMenu.drawMenuSmall(data.Hashtags);
                  }
                  let button_favorite = new SPLINT.DOMElement.Button(div, "favorite");
                      button_favorite.bindIcon("star");
        }.bind(this));
  }
  update(){
    this.draw();
  }
}
















function StartupImageMenu(parent){
  if(document.getElementById("ImageMenuMain") != null){
    document.getElementById("ImageMenuMain").remove();
  }

  let main = "";
  if(parent != undefined){
    main = getElement("ImageMenuMain", "div", parent.id);
  } else {
    main = getElement("ImageMenuMain", "div", document.body.id);
  }
  let buttonClose = getElement("ImageMenuListButtonClose", "button", main.id);
      buttonClose.innerHTML = "X";
      buttonClose.onclick = function(){
        parent.remove();
      }
  DrawFilter(main);
  DrawImageList(main);
}
function DrawUploadImage(parent){
  let main = getElement("ImageMenuUploadMain", "div", parent.id);
      let button = getElement("ImageMenuUploadButton", "button", main.id);
          button.innerHTML = "Bild hochladen";
          button.onclick = function(){

          }
}

function DrawImageList(parent){
  let session = MenuSession.get();
  let hashtags  = session.filter;
  let category  = session.category;
  let mode      = session.mode;

  let mainCover = getElement("ImageMenuListCover", "div", parent.id);
  mainCover.className = "ImageMenuList";
  let main = getElement("ImageMenuList", "div", mainCover.id);

      let images = sortForCategory(ImageHelper.get(undefined, hashtags, mode), category);

      let mainWidth = main.getBoundingClientRect().width;
      let mainLeft = main.getBoundingClientRect().left;
      let innerWidth = 0;
      let ColumnCount = 0;
      while(mainWidth > innerWidth){
        let Column = getElement("ImageMenuListColumn" + ColumnCount, "div", main.id);
            Column.className = "column";

        innerWidth = Column.getBoundingClientRect().right - mainLeft;
        ColumnCount++;
      }
      renderListElements(images, ColumnCount, hashtags);
}

async function renderListElements(images, ColumnCount, hashtags){
  let index = 0;
  if(images.length <= 0){
    return false;
  }
  while(await renderImage(index, images, ColumnCount, hashtags) == 'loaded'){
    if(index < images.length - 1){
      index++;
    } else {
      break;
    }
  }
}

function renderImage(i, images, ColumnCount, hashtags){
  return new Promise(resolve => {
    let ImageHashtags = [];
    if(images[i].Hashtags != ""){
      // ImageHashtags = JSON.parse(images[i].Hashtags);
    }
    console.log(images[i]);
    let columnElement = document.getElementById("ImageMenuListColumn" + f1(ColumnCount));
    let listElement = getElement("ImageListElement" + i, "div", columnElement.id);
        let imgDiv = getElement("ImageListElement_imgDiv" + i, "div", listElement.id);
            let img = getElement("ImageListElement_img" + i, "img", imgDiv.id);
                img.src = SPLINT.Tools.srcBase64(images[i].ImageScale);
        listElement.onmouseenter = function(){
          let hoverDiv = getElement("ImageListElementHoverDiv", "div", imgDiv.id);
              hoverDiv.onmouseleave = function(){
                getElement("ImageListElementHoverDiv", "div", imgDiv.id).remove();
              }
              let buttonUse = getElement("ImageListElementButtonUse", "button", hoverDiv.id);
                  buttonUse.innerHTML = "nutzen";
                  buttonUse.onclick = function(){
                    let data = ImageHelper.copyToProject(images[i].ImageID, MenuSession.mode());
                    document.getElementById("ImageMenuListButtonClose").click();
                  }
              let buttonRemove = getElement("ImageListElementButtonRemove", "button", hoverDiv.id);
                  buttonRemove.innerHTML = "löschen";
                  buttonRemove.onclick = function(){
                    removeImage(images[i].ImageID, MenuSession.mode());
                    DrawImageList(buttonRemove);
                  }
        }
        img.onload = function(){
          resolve('loaded');
        }
    });
    function f1(ColumnCount){
      let value = 100000;
      let index = 0;
      for(let i = 0; i < ColumnCount; i++){
        let height = document.getElementById("ImageMenuListColumn" + i).getBoundingClientRect().height;
        //console.log(height, i);
        if(height < value){
          value = height;
          index = i;
        }
      }
      return index;
    }
}

// function getImage(ImageID, hashtags, mode){
//   let output = "";
//   if(mode == "PRIVATE"){
//     output = UserData.getImages(ImageID, mode, hashtags);
//   } else {
//     let data = CallPHP_S.getCallObject(imageDesign.GET);
//         data.Hashtags = hashtags;
//     output = CallPHP_S.call(imageDesign.PATH, data).text;
//     console.log(output);
//     if(output != ""){
//       output = JSON.parse(output);
//     } else {
//       output = [];
//     }
//   }
//   // console.log(output);
//   // console.log(JSON.parse(output));
//   return output;
// }

function removeImage(ImageID, mode){
  console.log(mode);
  if(mode == "PRIVATE"){
    UserData.removeImage(ImageID, mode);
  } else {
    let data = CallPHP_S.getCallObject(imageDesign.REMOVE);
        data.ImageID = ImageID;
    CallPHP_S.call(imageDesign.PATH, data);
  }
}

// function copyImageToProject(ImageID, mode){
//   let data = CallPHP_S.getCallObject(imageDesign.COPY_TO_PROJECT);
//       data.ImageID  = ImageID;
//       data.mode     = mode;
//       output = CallPHP_S.call(imageDesign.PATH, data).toObject();
//       DSImage.add(output);
//       createDragImageElement(DSImage.Storage.length -1);
//   return output;
// }

//
class imageDesign{
  static COPY_TO_PROJECT  = "COPY_TO_PROJECT";
  static ADD              = "ADD";
  static GET              = "GET";
  static REMOVE           = "REMOVE";
  static PATH = PATH.php.designs.image;
}


//
function addImageToDataBase(ImageID){
  let data = CallPHP_S.getCallObject(imageDesign.ADD);
      data.ImageID = ImageID;
  CallPHP_S.call(imageDesign.PATH, data);
}