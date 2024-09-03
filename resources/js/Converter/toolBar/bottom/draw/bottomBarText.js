class BottomBar_Text {
    constructor(parent) {
        this.parent = parent;
        this.id = "BottomBar_Text_";
    }
    draw(data){
        this.data = data;
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.mainElement.Class("converter-bottom-bar-text-main");
        this.parent.setAttribute("name", "text");
        this.drawHelper = CONVERTER_STORAGE.toolBar.drawHelper;
        this.TOOLS = TextTools.getTextToolsForID(data.TextID);
        // this.PARTS = new ToolBar_ImageElement_parts(this.TOOLS, this.mainElement);
        this.drawButtons();
        // this.drawSlider();
    }
    drawButtons(){
        let button_back = new SPLINT.DOMElement.Button(this.mainElement, "button_back");
            button_back.bindIcon("arrow_back");
            button_back.onclick = function(){
                this.parent.clear();
                CONVERTER_STORAGE.toolBar.blurAll();
            }.bind(this);


        let buttonsDiv = new SPLINT.DOMElement(this.id + "buttonsDiv", "div", this.mainElement);
            buttonsDiv.Class("buttonsDiv");        
            buttonsDiv.addEventListener("wheel", function(e){
                if (e.deltaY > 0) {
                    buttonsDiv.scrollLeft += 15;
                    e.preventDefault();
                // prevenDefault() will help avoid worrisome 
                // inclusion of vertical scroll 
                } else {
                    buttonsDiv.scrollLeft -= 15;
                      e.preventDefault();
                }
            }.bind(this));
            
            let button_edit = new SPLINT.DOMElement.Button(buttonsDiv, "edit");
                button_edit.bindIcon("edit");
                button_edit.Description = "ändern";
                // button_edit.button.setTooltip("Bearbeiten", "top");
                button_edit.onclick = function(){
                    let SubWindow = new SPLINT.DOMElement.popupWindow("editText", true, false);
                        SubWindow.Class("editText_mobile");
                        SubWindow.onclose = function(){
                            // console.log(this.data);
                            CONVERTER_STORAGE.toolBar.focusElement("txt", this.data.TextID);
                        }.bind(this);
                        SubWindow.content.onclick = function(e){
                            if(e.srcElement.id == SubWindow.content.id){
                                SubWindow.close();
                            }
                        }
                        let buttonDiv = new SPLINT.DOMElement(SubWindow.id + "_buttonsContainer", "div", SubWindow.content);
                            buttonDiv.Class("buttonsContainerTextEdit");
                            let buttonClose = new SPLINT.DOMElement.Button(buttonDiv, "close");
                                buttonClose.Class("btClose");
                                buttonClose.bindIcon("close");
                                buttonClose.onclick = function(){
                                    SubWindow.close();
                                }

                            let headline = new SPLINT.DOMElement.SpanDiv(buttonDiv, "headline", "Verfasse einen Text.");
                                headline.Class("headline");

                            let buttonSave = new SPLINT.DOMElement.Button(buttonDiv, "save");
                                buttonSave.Class("btSave");
                                buttonSave.bindIcon("check");
                                buttonSave.onclick = function(){
                                    this.TOOLS.setValue(textInput.Value);
                                    SubWindow.close();
                                }.bind(this);
                        let textInput = new SPLINT.DOMElement.InputText(SubWindow.content, "editTextInputDiv", "test");
                            // console.log(this.data)   
                            textInput.textarea.focus();
                            textInput.setValue(window.screen.height)//this.data.TextValue);
                            window.addEventListener('resize', () => {
                                // For the rare legacy browsers that don't support it
                                if (!window.visualViewport) {
                                  return
                                }
                                console.dir(arguments)
                                textInput.setValue(window.visualViewport.height);
                                // SubWindow.content.style.height = window.visualViewport.height + "px";
                                // console.log(window.visualViewport.height)
                              })
                            // textInput.onFocus = function(){
                            //     console.dir(arguments)
                            //     setTimeout(function(){
                            //         textInput.setValue(window.innerHeight);
                            //     }, 1000)
                            //     // alert(window.innerHeight)
                            // } 
                            // textInput.oninput = function(){
                            //     this.TOOLS.setValue(textInput.Value);
                            // }.bind(this);
                    // this.TOOLS.copy();
                }.bind(this);

            let button_FontFamily = new SPLINT.DOMElement.Button.Switch(buttonsDiv, "fontFamily");
                button_FontFamily.bindIcon("text_format");
                button_FontFamily.Description = "Schriftart";
                button_FontFamily.onactive = function(){
                    let ele = new BottomBar_Text_FontFamily_Menu(buttonsDiv, this.TOOLS, this.data);
                        ele.onRemoveFloatingDiv = function(){
                        }.bind(this);
                }.bind(this);
                button_FontFamily.button.onclick = function(e){
                    button_FontFamily.toggle();
                }.bind(this);
                

            this.button_textAlign = new BottomBar_Text_Button_TextAlign(buttonsDiv, this.TOOLS, this.data);
            this.button_fontWeight = new BottomBar_Text_Button_FontWeight(buttonsDiv, this.TOOLS, this.data);
            this.button_fontSize = new BottomBar_Text_Button_FontSize(buttonsDiv, this.TOOLS, this.data);


            let buttonItalic = new SPLINT.DOMElement.Button.Switch(buttonsDiv, "italic");
                buttonItalic.bindIcon("format_italic");
                buttonItalic.Description = "Kursiv";
                buttonItalic.onactive = function(){
                        this.TOOLS.fontStyle('italic');
                    }.bind(this);

                buttonItalic.onpassive = function(){
                        this.TOOLS.fontStyle('normal');
                    }.bind(this);

                if(this.data.FontStyle == "italic"){
                    buttonItalic.setActive();
                }

            let button_copy = new SPLINT.DOMElement.Button(buttonsDiv, "copy");
                button_copy.bindIcon("content_copy");
                button_copy.Description = "duplizieren";
                button_copy.onclick = function(){
                    this.TOOLS.copy();
                }.bind(this);

            let button_remove = new SPLINT.DOMElement.Button(buttonsDiv, "remove");
                button_remove.bindIcon("delete");
                button_remove.Description = "entfernen";
                button_remove.onclick = function(){
                    console.log(this.TOOLS);
                    this.TOOLS.remove();
                }.bind(this);
    }
}

