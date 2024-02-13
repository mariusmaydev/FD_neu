
class ConverterTouchEvents {
    static move(e){
        ConverterTouchHandler.calcOffset.call(this, e);
        if(this.dragElement != null){
            if(this.dragElement.dragEdge != -1){
                this.computeEdges(this.dragElement)
            } else {
                if(ConverterTouchHandler.distance.ratio > 0){
                    this.dragElement.data.ImageWidth = this.dragElement.widthBase * ConverterTouchHandler.distance.ratio;
                    this.dragElement.data.ImageHeight = this.dragElement.heightBase * ConverterTouchHandler.distance.ratio;
                }
            }
            this.draw(this.dragElement);
        } else {
        //     console.log(this.hoverElement, this.dragElement);
        //   if(e.target.offsetParent == null || e.target.offsetParent.id != ConverterHelper.ELE_SQUARE_BORDER_DIV){
        //     // cursorHandler.unsetCursor();
        //     S_CursorHandler.unsetCursor();
        //     return;
        //   }
        //   this.getElementForCoords();
        //   if(this.hoverElement != undefined){
        //     if(this.hoverElement.dragEdge != -1){
        //       let edge = this.hoverElement.dragEdge;
        //       let rotation = 0;
        //       if(this.hoverElement.type == "txt"){
        //         rotation = 0;
        //       } else {
        //         rotation = this.hoverElement.data.ImageAlign;
        //       }
        //     } else {
        //     }
        //   } else {
        //     // cursorHandler.unsetCursor();
        //   }
        }
    }
    static start(e){
          let flag = false;
          for(const element of e.target.path()){
            if(element.id != undefined){
              if(element.id == ConverterHelper.ELE_SQUARE_BORDER_DIV){
                flag = true;
                break;
              }
            }
          }
          
          if(e.touches.length >= 2){
              this.dragElement.resize = true;
          }
          this.mouse.down = true;
            ConverterHelper.getSquareBorder().state().setActive();
            ConverterTouchHandler.calcOffset.call(this, e);
            this.getElementForCoords();
          if(this.hoverElement != null){
            if(this.hoverElement.type == "img"){
                CONVERTER_STORAGE.toolBar.focusElement(Converter_ToolBar.TYPE_IMG, this.hoverElement.ID);
                this.hoverElement.widthBase   = this.hoverElement.data.ImageWidth;
                this.hoverElement.heightBase  = this.hoverElement.data.ImageHeight;
            } else {
                CONVERTER_STORAGE.toolBar.focusElement(Converter_ToolBar.TYPE_TXT, this.hoverElement.ID);
            }
            if(ConverterTouchHandler.rotation.now != false){
                this.hoverElement.alignBase = parseFloat(this.hoverElement.data.ImageAlign);
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
              CONVERTER_STORAGE.toolBar.blurAll();
              this.removeEdges();
            }
          }
          return;
          if(flag){
            this.mouse.down = true;
            ConverterTouchHandler.calcOffset.call(this, e);
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
              if(ConverterTouchHandler.rotation.now != false){
                  this.hoverElement.alignBase = parseFloat(this.hoverElement.data.ImageAlign);
              }
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
              this.activeElement = null;
              this.removeEdges();
            }
          }
    }
    static end(e){
          this.clearLine();
          this.mouse.down = false;
          if(this.dragElement != null){
            this.dragElement.resize = false;
          }
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