
class ConverterEvents {
    static move(e, isMouse = true){
        if(isMouse){
            ConverterMouseHandler.calcOffset.call(this, e);
        } else {
            ConverterTouchHandler.calcOffset.call(this, e);
        }
        // for(const ele of this.stack){
            
        //     ConverterCanvasHelper.computeEdges(ele, this);
        // }

        if(this.dragElement != null){
          if(this.dragElement.dragEdge != -1){
            
            this.computeEdges(this.dragElement)
          } else {
            this.draw(this.dragElement);
          }
        } else {
          if(e.target.offsetParent == null || e.target.offsetParent.id != ConverterHelper.ELE_SQUARE_BORDER_DIV){
            // cursorHandler.unsetCursor();
            SPLINT.Tools.CursorHandler.unsetCursor();
            return;
          }
          this.getElementForCoords();
          if(this.hoverElement != undefined){
            if(this.hoverElement.dragEdge != -1){
              let edge = this.hoverElement.dragEdge;
              let rotation = 0;
              if(this.hoverElement.type == "txt"){
                rotation = 0;
              } else {
                rotation = this.hoverElement.data.ImageAlign;
              }
              if(isMouse){
                if(edge == 0 || edge == 4){
                //   cursorHandler.setCursor("doubleArrow", rotation + 90);
            SPLINT.Tools.CursorHandler.setCursor("doubleArrow", rotation + 90);
                } else if(edge == 2 || edge == 6){
                //   cursorHandler.setCursor("doubleArrow", rotation);
            SPLINT.Tools.CursorHandler.setCursor("doubleArrow", rotation);
                } else if(edge == 1 || edge == 5){
                //   cursorHandler.setCursor("doubleArrow", rotation - 45);
            SPLINT.Tools.CursorHandler.setCursor("doubleArrow", rotation - 45);
                } else if(edge == 8){
                //   cursorHandler.unsetCursor();
                  //cursorHandler.setCursor("rotate", rotation);
            SPLINT.Tools.CursorHandler.setCursor("rotate", rotation );
                } else {
                //   cursorHandler.setCursor("doubleArrow", rotation + 45);
            SPLINT.Tools.CursorHandler.setCursor("doubleArrow", rotation + 45);
                }
              }
            } else {
                if(isMouse){
                    if(this.hoverElement.type == "img"){
                    //   cursorHandler.setCursor("crossArrow", 0, "orange");
            SPLINT.Tools.CursorHandler.setCursor("crossArrow", 0);
                    } else if(this.hoverElement.type == "txt"){
                    //   cursorHandler.setCursor("crossArrow", 0, "orange");
            SPLINT.Tools.CursorHandler.setCursor("crossArrow", 0);
                    }
                }
            }
          } else {
            // cursorHandler.unsetCursor();
            SPLINT.Tools.CursorHandler.unsetCursor();
          }
        }
    }
    static start(e, isMouse = true){
          let flag = false;
          for(const element of e.target.path()){
            if(element.id != undefined){
              if(element.id == ConverterHelper.ELE_SQUARE_BORDER_DIV){
                flag = true;
                break;
              }
            }
          }
          if(flag){
            this.mouse.down = true;
            if(isMouse){
                ConverterMouseHandler.calcOffset.call(this, e);
            } else {
                ConverterTouchHandler.calcOffset.call(this, e);
            }
            this.getElementForCoords();
          }
          if(flag && this.hoverElement != null){
            ConverterHelper.getSquareBorder().state().setActive();
            if(this.hoverElement.type == "img"){
              // CONVERTER_STORAGE.toolBar.Text
              CONVERTER_STORAGE.toolBar.focusElement(Converter_ToolBar.TYPE_IMG, this.hoverElement.ID);
              // TB_draw.checkListElements(null, TB_draw.getListElementIDByType_ID("img", this.hoverElement.ID));
              this.hoverElement.widthBase   = this.hoverElement.data.ImageWidth;
              this.hoverElement.heightBase  = this.hoverElement.data.ImageHeight;
            } else {
              CONVERTER_STORAGE.toolBar.focusElement(Converter_ToolBar.TYPE_TXT, this.hoverElement.ID);
              // TB_draw.checkListElements(null, TB_draw.getListElementIDByType_ID("txt", this.hoverElement.ID));
            }
            this.Offset(this.hoverElement).get();
            this.dragElement = this.hoverElement;
            this.activeElement = this.hoverElement;
            this.checkEdge(this.dragElement);
            this.setFirstInStack(this.dragElement);
          } else {
            this.dragElement = null;
            let flag = true;
            if(e.target.classList.contains("ToolBar_ListElement") || e.target.classList.contains("converter-bottom-bar")){
              flag = false;
            } else {
              for(const element of e.target.path()){
                if(element.classList != undefined){
                  if(element.classList.contains("ToolBar_ListElement") || element.classList.contains("converter-bottom-bar")){
                    flag = false;
                    break;
                  }
                }
              }
            }
            if(flag){
              this.activeElement = null;
            //   console.dir(CONVERTER_STORAGE);
              CONVERTER_STORAGE.toolBar.blurAll(e);
              this.removeEdges();
            }
          }
    }
    static end(e, isMouse = true){
          this.clearLine();
          this.mouse.down = false;
          let flag = true;
          if(e.target.classList.contains("ToolBar_ListElement")){
            flag = false;
          } else {
            for(const element of e.target.path()){
              if(element.classList != undefined){
                if(element.classList.contains("ToolBar_ListElement")){
                  flag = false;
                  break;
                }
              }
            }
          }
          if(flag){
            this.dragElement = null;
            this.dragStop();
          }
    }
}