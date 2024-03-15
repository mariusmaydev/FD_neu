
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
    this.background.classList.remove("start");
    setTimeout(function(){
        this.background.remove();
    }.bind(this), 300);
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
        console.log(imageData);
        if(imageData.total == 0){
            let hintBody = new SPLINT.DOMElement("hintBody", "div", this.mainElement);
                hintBody.Class("hintBody");
                let hintBT = new SPLINT.DOMElement.Button(hintBody, "bthint");
                    hintBT.bindIcon("mystery");
                    hintBT.Description = "leider keine Treffer";
                    if(document.getElementById("AdaptiveTable_test_main") != null){
                      document.getElementById("AdaptiveTable_test_main").remove();
                    }
                    return;
        } else {
            if(document.getElementById("hintBody") != null){
              document.getElementById("hintBody").remove();
            }

        }
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
           
            let imgElement = new SPLINT.DOMElement(index + "_img", "img", listElement);
                imgElement.name = index;
                imgElement.onerror = function(){
                    imgElement.src = PATH.images.errorSRC;
                }.bind(this);
                imgElement.onload = function(){
                  func_resolve();
                }
                imgElement.src = data.urls.small;

                if(SPLINT.ViewPort.getSize() == "mobile-small"){
                    imgElement.onclick = function(){
                        this.drawPopupMobile(data)
                            // let imgpopup.content
                    }.bind(this);
                    return;
                }
                let hoverDiv = new SPLINT.DOMElement("hoverDiv_" + index, "div", listElement);
                    hoverDiv.Class("hoverDiv");
                    // console.log(data);
                    
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
                        
                    let buttonDiv = new SPLINT.DOMElement("buttonDiv_" + index, "div", hoverDiv);
                        buttonDiv.Class("buttonDiv");
                        let buttonUse = new SPLINT.DOMElement.Button(buttonDiv, "use", "verwenden");
                            buttonUse.Class("use");
                            // buttonUse.bindIcon("add_photo_alternate");
                            // buttonUse.setTooltip("verwenden", "top");
                            buttonUse.button.onclick = function(){
                            unsplash.download(data);
                            this.close();
                            }.bind(this);

                            
                        let likeDiv = new SPLINT.DOMElement("likeDiv_" + index, "div", buttonDiv);
                            likeDiv.Class("likeDiv");
                            let likePoint = new SPLINT.DOMElement.SpanDiv(likeDiv, "likePoint", data.likes);
                                likePoint.Class("likePoint");
                            let buttonLike = new SPLINT.DOMElement.Button(likeDiv, "Like");
                                buttonLike.bindIcon("thumb_up");
                                buttonLike.Class("likeBT");
                                buttonLike.setTooltip("gefällt mir", "top");
                                buttonLike.button.onclick = function(){
                                this.close();
                                }.bind(this);
                        // let likeDiv = new SPLINT.DOMElement("likeDiv_" + index, "div", hoverDiv
                    // let buttonView = new SPLINT.DOMElement.Button(buttonDiv, "view");
                    //     buttonView.bindIcon("search");
                    //     buttonView.onclick = function(){
                    //     //   unsplash.download(data);
                    //     //   this.close();
                    //     }.bind(this);
                    // let informationDiv = new SPLINT.DOMElement("informationDiv_" + index, "div", hoverDiv);
                    //     informationDiv.Class("informationDiv");
                    let bottomDiv = new SPLINT.DOMElement("bottomDiv_" + index, "div", listElement);
                        bottomDiv.Class("bottomDiv");
                    //     let bt_use = new SPLINT.DOMElement.Button(bottomDiv, "use");
                    //         bt_use.bindIcon("add_photo_alternate");
                    //         bt_use.onclick = function(){

                    //         }
                    if(SPLINT.ViewPort.getSize() == "mobile-small"){
                        // hoverDiv.onclick = function(){
                        //     bottomDiv.SPLINT.state.setActive();
                        //     listElement.SPLINT.state.setActive();
                        // }.bind(this);
                            let hd = function(e1){
                                if(!e1.target.hasParentWithID(listElement.id)){
                                    hoverDiv.parentElement.setAttribute("s-state", "passive");
                                    bottomDiv.SPLINT.state.setPassive();
                                    listElement.SPLINT.state.setPassive();
                                    document.removeEventListener("mousedown", hd, false);
                                }
                            };
                        hoverDiv.onclick = function(e){
                                document.addEventListener("mousedown", hd, false);
                            
                            if(e.target.parentElement.getAttribute("s-state") == "active"){
                                e.target.parentElement.setAttribute("s-state", "passive");
                                bottomDiv.SPLINT.state.setPassive();
                                listElement.SPLINT.state.setPassive();
                            } else {
                                e.target.parentElement.setAttribute("s-state", "active");
                                bottomDiv.SPLINT.state.setActive();
                                listElement.SPLINT.state.setActive();
                            }
                        }.bind(this);
                        
                    } else {
                        hoverDiv.onmouseenter = function(){
                            bottomDiv.SPLINT.state.setActive();
                            listElement.SPLINT.state.setActive();
                        }.bind(this);
                        hoverDiv.onmouseleave = function(){
                            bottomDiv.SPLINT.state.setPassive();
                            listElement.SPLINT.state.setPassive();
                        }.bind(this);
                    }
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
    };

  }
  draw(){
    this.drawUnsplash();
    return;
  }
  update(){
    this.draw();
  }
  drawPopupMobile(data){
    console.dir(data);
    let id = "popupMobile";
    let popup = new SPLINT.DOMElement.popupWindow("imagePopup", true, true);
        popup.Class("popupMobile");
        let imgEle = new SPLINT.DOMElement(id + "_ImageContainer", "div", popup.content);
            imgEle.Class("imgContainer");
            let img = new SPLINT.DOMElement(id + "_Image", "img", imgEle);
                img.src = data.urls.small;


            let tagsDiv = new SPLINT.DOMElement("tagsDiv_" + id, "div", popup.content);
                tagsDiv.Class("tagsDiv");
                if(data.tags != undefined){
                for(const ind in data.tags){
                    let name = data.tags[ind];
                    let button = new SPLINT.DOMElement.Button(tagsDiv, "tag_" + id + "_" + ind, name);
                        button.setStyleTemplate(S_Button.STYLE_DEFAULT);
                        button.button.onclick = function(){
                        this.Filter.searchBar.input.value = name;
                        this.drawUnsplash(name);
                        }.bind(this);
                    // console.log(img);
                }
                }
        let buttonsContainer = new SPLINT.DOMElement(id + "_ButtonsContainer", "div", popup.content);
            buttonsContainer.Class("buttonsContainer");

            let likeDiv = new SPLINT.DOMElement("likeDiv_" + id, "div", buttonsContainer);
                likeDiv.Class("likeDiv");
                let likePoint = new SPLINT.DOMElement.SpanDiv(likeDiv, "likePoint", data.likes);
                    likePoint.Class("likePoint");
                let buttonLike = new SPLINT.DOMElement.Button(likeDiv, "Like");
                    buttonLike.bindIcon("thumb_up");
                    buttonLike.Class("likeBT");
                    buttonLike.setTooltip("gefällt mir", "top");
                    buttonLike.button.onclick = function(){
                    this.close();
                    }.bind(this);

            let bt_use = new SPLINT.DOMElement.Button(buttonsContainer, "bt_use");
                bt_use.Class("use");
                bt_use.bindIcon("add_photo_alternate");
                bt_use.onclick = function(){
                    unsplash.download(data)
                    popup.close();
                    this.close();
                }.bind(this);

  }
}