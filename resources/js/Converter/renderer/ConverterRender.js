
class CanvasElement_C {
  static TYPE_TXT = "txt";
  static TYPE_IMG = "img";
  static SCALE    = 50;

  constructor(id, parent) {
    this.id = id;
    this.parent = parent;
    this.Storage = new SPLINT.autoObject(false);
    this.ratio = new Object();
    this.ratio.X = -1;
    this.ratio.Y = -1;
    this.lines = new Object();
    this.lines.active = false;
    this.lines.type   = -1;
    this.lines.canvas = new SPLINT.DOMElement(this.id + "lines", "canvas", this.parent);
    this.lines.ctx    = this.lines.canvas.getContext('2d');
    this.EPType = "GOLD";
    this.generateThumbnailTime = 0;
    this.Storage.img = [];
    this.Storage.txt = [];
    this.Storage.offset = [];
    this.stack = [];
    this.activeElement  = null;
    this.hoverElement   = null;
    this.dragElement    = null;
    // this.Storage.activeElement = new Object();
    this.Storage.activeElement.type   = -1;
    this.Storage.activeElement.id     = -1;
    // this.Storage.activeElement.edge   = new Object();
    this.Storage.activeElement.edge.index = -1;
    this.canvas = new SPLINT.DOMElement(this.id, "canvas", this.parent);
    this.mouse = new Object();
    this.mouse.X = 0;
    this.mouse.Y = 0;
    this.CanvasActive = true;
    this.mouse.down = false;
    this.SVG = new Object();

    SVG_Loader.load("turn", PATH.svg.arrow.turn, "#808080");

    this.setListeners();
    this.setSize();
  }
  setListeners(){
    // window.addEventListener("touchstart", ConverterTouchHandler.touchStart.bind(this));
    // window.addEventListener("touchmove", ConverterTouchHandler.touchMove.bind(this), false);
    // window.addEventListener("touchend", ConverterTouchHandler.touchEnd.bind(this));

    window.addEventListener("mousedown", ConverterMouseHandler.mouseDown.bind(this));
    window.addEventListener("mousemove", ConverterMouseHandler.mouseMove.bind(this), false);
    window.addEventListener("mouseup", ConverterMouseHandler.mouseUp.bind(this));
    // console.log(window)
    // window.addEventListener("resize", function(e){
    //   this.setSize();
    // }.bind(this));

  }
  ListenersActive(flag){
    this.CanvasActive = flag;
  }
  setSize(){
    let width   = LighterWidth * CanvasElement_C.SCALE;
    let height  = LighterHeight * CanvasElement_C.SCALE; 
    this.canvas.width = width;
    this.canvas.height = height;
    this.ratio.X = this.canvas.width / this.canvas.offsetWidth;
    this.ratio.Y = this.canvas.height / this.canvas.offsetHeight;
    this.stack.forEach(element => {
      element.canvas.width  = width;
      element.canvas.height = height;
      this.draw(element);
    });
    this.lines.canvas.width = width;
    this.lines.canvas.height = height;
  }
  setActive(data, type){
    if(data == undefined){
      return;
    }
    if(type == "img"){
      this.activeElement = this.#getElementByID_Type(data.ImageID, "img").element;
    } else {
      this.activeElement = this.#getElementByID_Type(data.TextID, "txt").element;
    }
    if(this.activeElement != undefined){
      this.setFirstInStack(this.activeElement);
      this.checkEdge(this.activeElement);
    }
  }
  async createData(scale = 1){
    if(this.generateThumbnailTime >= Date.now() - 1000){
      // return Promise.resolve();
    }
    this.generateThumbnailTime = Date.now();
      let canvas  = document.createElement("canvas");
          canvas.width  = this.canvas.width * scale;
          canvas.height = this.canvas.height * scale;
      let ctx     = canvas.getContext('2d');
          ctx.fillStyle = "transparent";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(scale, scale);

      this.stack.forEach(element =>{
        if(element.type == "img"){
          CanvasHelper.Image(ctx).draw(element);
        } else {
          CanvasHelper.Text(ctx).draw(element);
        }
      });
      
      return await canvas.toDataURL("image/png", 1);
  }
  createTextData(scale = 8){
    for(const element of this.stack){
      if(element.type == "txt"){
        let postEle = element;
      let canvas  = document.createElement("canvas");
          canvas.width  = (postEle.data.FrameWidth * scale) * 2 + 20;
          canvas.height = (postEle.data.FrameHeight * scale) * 2 + 20;
      let ctx     = canvas.getContext('2d');
          ctx.fillStyle = "transparent";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.scale(scale, scale);
          let a = postEle.data.TextPosX;
          let b = postEle.data.TextPosY;
          postEle.data.TextPosX = (canvas.width - 10) / 16;
          postEle.data.TextPosY = (canvas.height -10) / 16;
        CanvasHelper.Text(ctx).draw(postEle);
        element.data.TextImg = canvas.toDataURL("image/png", 1);
        element.data.TextPosX = a;
        element.data.TextPosY = b;

      }
    }
  }
  getElementForCoords(){
    window.requestAnimationFrame(function(){
    let ele = null;
    this.stack.forEach(element =>{
      if(element.type == "img" && element.src.naturalHeight != 0){
        CanvasHelper.Image().dummy(element);
        if(this.#check(element.ctx_S)){
          ele = element;
          ele.dragEdge = -1;
        }
        element.ctx_S.clearRect(0, 0, element.canvas.width, element.canvas.height);
        for(let i = 0; i <= 8; i++){
          CanvasHelper.Image().edge(element, true, i);
          if(this.#check(element.ctx_S)){
            ele = element;
            ele.dragEdge = i;
          }
          element.ctx_S.clearRect(0, 0, element.canvas.width, element.canvas.height);
        }
        // this.draw(element);
      } else if(element.type == "txt"){
        CanvasHelper.Text().draw(element, true);
        if(this.#check(element.ctx_S)){
          ele = element;
          ele.dragEdge = -1;
        }
        element.ctx_S.clearRect(0, 0, element.canvas.width, element.canvas.height);

        // CanvasHelper.Text().edge(element, true, 2);
        // if(this.#check(element.ctx_S)){
        //   ele = element;
        //   ele.dragEdge = 2;
        // }
        // element.ctx_S.clearRect(0, 0, element.canvas.width, element.canvas.height);
        
        CanvasHelper.Text().edge(element, true, 8);
        if(this.#check(element.ctx_S)){
          ele = element;
          ele.dragEdge = 8;
        }
        element.ctx_S.clearRect(0, 0, element.canvas.width, element.canvas.height);
        // this.draw(element);
      }
    });
    this.hoverElement = ele;
  }.bind(this));
  }
  setFirstInStack(element){
    let index = this.#getElementByID_Type(element.ID, element.type).index;
        this.stack.splice(index, 1);
        this.stack.push(element);
  }
  Offset(element){
    function obj(element, Obj){
      this.get = function(){
        if(element.type == "txt"){
          element.offset.X = parseInt(element.data.TextPosX) - Obj.mouse.X * Obj.ratio.X;
          element.offset.Y = parseInt(element.data.TextPosY) - Obj.mouse.Y * Obj.ratio.Y;
        } else {
          element.offset.X = (element.data.ImagePosX) - Obj.mouse.X * Obj.ratio.X;
          element.offset.Y = (element.data.ImagePosY) - Obj.mouse.Y * Obj.ratio.Y;
        }
      }
      this.reset = function(){
        element.offset.X = 0;
        element.offset.Y = 0;
      }
    }
    return new obj(element, this);
  }
  #newStackObj(type, dataIn){
    let data;
    if(type == "img"){
      data = newIMG(dataIn, this);
    } else if(type == "txt"){
      data = newTXT(dataIn, this);
    }
    return data;

    function newTXT(dataIn, obj){
      let o      = new Object();
          o.type     = "txt";  
          o.offset   = new Object();
          o.offset.X = 0;
          o.offset.Y = 0;
          o.ID     = dataIn.TextID;
          o.time   = 0;
          o.canvas = new SPLINT.DOMElement(obj.id + "_" + dataIn.TextID + "_TXT", "canvas", obj.parent);
          o.canvas.width = obj.canvas.width;
          o.canvas.height = obj.canvas.height;
          o.ctx    = o.canvas.getContext('2d');
          o.canvas_S = o.canvas.cloneNode();
          o.ctx_S     = o.canvas_S.getContext('2d');
          // o.input  = new canvasTextInput(o.ID, ConverterHelper.ELE_SQUARE_BORDER_DIV, obj);
          if(dataIn.TextPosX == -1 || dataIn.TextPosY == -1){
            dataIn.TextPosX = obj.canvas.width / 2;
            dataIn.TextPosY = obj.canvas.height / 2;
          }
          o.data = dataIn;
          obj.#update();
          obj.draw(o);
          DSText.saveAsync();
      return o;
    }
    function newIMG(dataIn, obj){
      let o      = new Object();
          o.type     = "img";  
          o.offset   = new Object();
          o.offset.X = 0;
          o.offset.Y = 0;
          o.ID       = dataIn.ImageID;
          o.time     = S_Time.getTimeFromURL(dataIn.images.view);
          o.canvas   = new SPLINT.DOMElement(obj.id + "_" + dataIn.ImageID + "_IMG", "canvas", obj.parent);
          o.canvas.width = obj.canvas.width;
          o.canvas.height = obj.canvas.height;
          o.ctx      = o.canvas.getContext('2d');
          o.canvas_S = o.canvas.cloneNode();
          o.ctx_S     = o.canvas_S.getContext('2d');
          o.src = new Image();

          if(dataIn.ImagePosX == undefined || dataIn.ImagePosY == undefined){
            dataIn.ImagePosX    = obj.canvas.width / 2;
            dataIn.ImagePosY    = obj.canvas.height / 2;
          }
          if(dataIn.ImageWidth == undefined){
            let ratio = dataIn.ImageWidth / dataIn.ImageHeight;
            dataIn.ImageWidth   = obj.canvas.width / 4;
            dataIn.ImageHeight  = dataIn.ImageWidth / ratio;
          }
          let img = new Image();
              img.src = dataIn.images.view;
              img.onload = function(){
                let canvas = document.createElement("canvas");
                    canvas.width  = Math.abs(img.width);
                    canvas.height = Math.abs(img.height);
                let ctx = canvas.getContext('2d');
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = "high";
                    ctx.drawImage(img, 0, 0, Math.abs(img.width), Math.abs(img.height));
                    ctx.globalCompositeOperation = "source-in";
                    ctx.fillStyle = DSProject.getColorFor(DSProject.Storage.EPType);
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.globalCompositeOperation = "source-over";
                let imgData = canvas.toDataURL('image/png', 1);

                canvas.remove();
                o.src.src   = imgData;
                o.src.width = Math.abs(img.width);
                o.src.height = Math.abs(img.height);
                o.src.onload = function(){
                  obj.#update();
                  obj.draw(o);
                }.bind(obj, o);
              }.bind(obj, o);

          o.data      = dataIn;
          o.reload = function(){
            o.src.src = "";
            img.src = dataIn.images.view;
            o.time     = S_Time.getTimeFromURL(dataIn.images.view);
          }
          DSImage.saveAsync();
      return o;
    }
  }
  #getElementByID_Type(ID, type){
    let output = false;
    let index = 0;
    this.stack.forEach(element => {
      if(element.type == type && element.ID == ID){
        output = new Object();
        output.element  = element;
        output.index    = index;
        return;
      }
      index++;
    });
    return output;
  }
  #check(ctx){
    return ctx.isPointInPath(this.mouse.X * this.ratio.X, this.mouse.Y * this.ratio.Y);
  }
  refreshData(){
    this.#update();
    for(let i = 0; i < DSImage.length(); i++){
      let data = DSImage.get(i);
      let response = this.#getElementByID_Type(data.ImageID, "img");
      if(response != false){
        if(this.EPType != DSProject.Storage.EPType){
          this.stack[response.index].reload();
        }
        if(S_Time.getTimeFromURL(data.images.view) != response.element.time){
          response.element.data = data;
          this.stack[response.index] = response.element;
          if(this.activeElement != null){
            this.activeElement.reload();
          }
          if(this.dragElement != null){
            this.dragElement.reload();
          }
          if(this.hoverElement != null){
            this.hoverElement.reload();
          }
        }
      } else {
        this.stack.push(this.#newStackObj("img", data));
      }
    }
    for(let i = 0; i < DSText.length(); i++){
      let data = DSText.get(i);
      let response = this.#getElementByID_Type(data.TextID, "txt");
      if(response != false){
          response.element.data = data;
          this.stack[response.index] = response.element;
          // if(this.activeElement != null){
          //   this.activeElement.reload();
          // }
          // if(this.dragElement != null){
          //   this.dragElement.reload();
          // }
          // if(this.hoverElement != null){
          //   this.hoverElement.reload();
          // }
      } else {
        this.stack.push(this.#newStackObj("txt", data));
      }
    }
    this.EPType = DSProject.Storage.EPType;
  }
  /**
   * @deprecated
   * */
  #applyStack(){
    this.stack = [];
    for(let i = 0; i < DSImage.length(); i++){
      this.stack.push(this.#newStackObj("img", DSImage.get(i)));
    }
    for(let i = 0; i < DSText.length(); i++){
      this.stack.push(this.#newStackObj("txt", DSText.get(i)));
    }
  }
  #update(){
    this.stack.forEach(element => {
      
      if(element.type == "img"){
        let data = DSImage.get(DSImage.getIndex(element.ID));
        if(data == undefined){
          element.ctx.clearRect(0, 0, element.canvas.width, element.canvas.height);
          element.ctx_S.clearRect(0, 0, element.canvas.width, element.canvas.height);
          this.stack.splice(this.stack.indexOf(element), 1);
          return;
        }
        if(S_Time.getTimeFromURL(data.images.view) != element.time){
          this.checkEdge(element);
          this.activeElement = element;
          this.setFirstInStack(element);
        }
        this.draw(element);
      } else {
        let data = DSText.get(DSText.getIndex(element.ID));
        if(data == undefined){
          element.ctx.clearRect(0, 0, element.canvas.width, element.canvas.height);
          element.ctx_S.clearRect(0, 0, element.canvas.width, element.canvas.height);
          this.stack.splice(this.stack.indexOf(element), 1);
          // if(this.activeElement == element){
          //   this.activeElement = null;
          // }
          // if(this.dragElement == element){
          //   this.dragElement = null;
          // }
          // if(this.hoverElement == element){
          //   this.hoverElement = null;
          // }
          return;
        }
          // this.#checkEdge(element);
          // this.activeElement = element;
          // // this.setFirstInStack(element);
          this.draw(element);
      }
    });
  }
  draw(element){
    // window.requestAnimationFrame(function(){
      element.ctx.clearRect(0, 0, element.canvas.width, element.canvas.height);
      if(element.type == "img" && element.src.naturalHeight != 0){
        if(this.mouse.down && this.dragElement == element && element.dragEdge == -1){
          let data = element.data;
          data.ImagePosX = this.mouse.X * this.ratio.X + element.offset.X;
          data.ImagePosY = this.mouse.Y * this.ratio.Y + element.offset.Y; 
            if(data.ImagePosX < 0){
              data.ImagePosX = 0;
            } else if(data.ImagePosX > this.canvas.width){
              data.ImagePosX = this.canvas.width;
            }   
            if(data.ImagePosY < 0){
              data.ImagePosY = 0;
            } else if(data.ImagePosY > this.canvas.height){
              data.ImagePosY = this.canvas.height;
            }  
          let lineV = this.drawLine(data.ImagePosX, data.ImagePosY, data);
              data.ImagePosX = lineV[0];
              data.ImagePosY = lineV[1];
        }
        if(element.drawEdge){
          this.focusCanvas(element);
          CanvasHelper.Image().edge(element);
        } else {
        }
        CanvasHelper.Image().draw(element);
      } else if(element.type == "txt"){
        if(this.mouse.down && this.dragElement == element && element.dragEdge == -1){
          element.data.TextPosX = this.mouse.X * this.ratio.X + element.offset.X;
          element.data.TextPosY = this.mouse.Y * this.ratio.Y + element.offset.Y;
        }
        CanvasHelper.Text().draw(element);
        if(element.drawEdge){
          this.focusCanvas(element);
          // CanvasHelper.Text().edge(element, false, 2);
          CanvasHelper.Text().edge(element, false, 8);
          // element.input.unHide();
        } else {
          // element.input.hide();
        }
      }
    // }.bind(this));
  }
  focusCanvas(element = null){
    if(element == null){
      for(const element of this.stack){
        element.canvas.state().setActive();
      }
    } else {
      for(const element of this.stack){
        element.canvas.state().unsetActive();
      }
      element.canvas.state().setActive();
    }
  }
  computeEdges(element){
    if(element.type == "img"){
      let offsetX = (-element.data.ImagePosX + ((this.mouse.X * this.ratio.X) + element.offset.X)) * 2;
      let offsetY = (-element.data.ImagePosY + ((this.mouse.Y * this.ratio.Y) + element.offset.Y)) * 2; 
      let wb = element.widthBase;
      let hb = element.heightBase;
      let size = {width: wb, height: hb};
      switch(element.dragEdge){
        case 0: size = S_Math.getNewSize(-offsetX, -offsetY, hb, wb); break;
        case 1: size = {width: wb, height: hb - offsetY}; break;
        case 2: size = S_Math.getNewSize(offsetX, -offsetY, hb, wb); break;
        case 3: size = {width: wb + offsetX, height: hb}; break;
        case 4: size = S_Math.getNewSize(offsetX, offsetY, hb, wb); break;
        case 5: size = {width: wb, height: hb + offsetY}; break;
        case 6: size = S_Math.getNewSize(-offsetX, offsetY, hb, wb); break;
        case 7: size = {width: wb - offsetX, height: hb}; break;
        case 8: {
          let a = element.data.ImagePosX - (this.mouse.X * this.ratio.X);
          let b = element.data.ImagePosY - (this.mouse.Y * this.ratio.Y);
          let c = S_Math.pytagoras(a, b);
          if(a < 0 ){
            element.data.ImageAlign = S_Math.toDegrees(Math.acos(b / c)) ;
          } else {
            element.data.ImageAlign = -S_Math.toDegrees(Math.acos(b / c));
          }
        } break;
        default: break;
      }
      // element.src.width   = size.width;
      // element.src.height  = size.height;
      element.data.ImageWidth  = size.width;
      element.data.ImageHeight = size.height;
    } else {
      // CanvasHelper.Text().edge(element, false, 2);
      CanvasHelper.Text().edge(element, false, 8);
      if(element.dragEdge == 2){
        element.data.TextPosX = this.mouse.X * this.ratio.X + element.offset.X;
        element.data.TextPosY = this.mouse.Y * this.ratio.Y + element.offset.Y;
      } else {
        let a = element.data.TextPosX - (this.mouse.X * this.ratio.X);
        let b = element.data.TextPosY - (this.mouse.Y * this.ratio.Y);
        let c = S_Math.pytagoras(a, b);
        if(a < 0 ){
          element.data.TextAlign = S_Math.toDegrees(Math.acos(b / c)) ;
        } else {
          element.data.TextAlign = -S_Math.toDegrees(Math.acos(b / c));
        }
      }
    }

    this.draw(element);
  }
  checkEdge(element){    
    this.stack.forEach(ele => {
      if(ele.ID != element.ID || ele.type != element.type){
        ele.drawEdge = false;
      } else {
        ele.drawEdge = true;
      }
      if(ele.type == "txt" || ele.src.naturalHeight != 0){
        this.draw(ele);
      }
    });
  }
  removeEdges(){
    this.stack.forEach(element => {
      element.drawEdge = false;
      this.draw(element);
    });
    this.focusCanvas();
    ConverterHelper.getSquareBorder().state().unsetActive();
  }
  dragStop(){
    this.dragElement = null;
    this.activeElement = null;
      DSImage.saveAsync();
      DSText.saveAsync();
      DSProject.saveAsync();
  }
  clearLine(full = false){
    this.lines.ctx.clearRect(0, 0, this.lines.canvas.width, this.lines.canvas.height);
    if(!full){
      // CanvasHelper.Line(0, LighterMid * CanvasElement_C.SCALE, this.canvas.width, LighterMid * CanvasElement_C.SCALE, this.lines.ctx);
    }
  }
  drawLine(x, y){
    let space = 15;
    let f1 = false;
    let f2 = false;
    let f3 = false; 
    let f4 = false;
    let xO = x;
    let yO = y;
    if(x >= this.canvas.width / 2 - space && x <= this.canvas.width / 2 + space){
      f1 = true;
      xO = this.canvas.width / 2;
    }
    if(y >= LighterMid * CanvasElement_C.SCALE - space && y <= LighterMid * CanvasElement_C.SCALE + space){
      f2 = true;
      yO = LighterMid * CanvasElement_C.SCALE;
    }
    if(y >= (LighterMid / 2) * CanvasElement_C.SCALE - space && y <= (LighterMid / 2) * CanvasElement_C.SCALE + space){
      f3 = true;
      yO = (LighterMid / 2) * CanvasElement_C.SCALE;
    }
    if(y >= ((LighterHeight - LighterMid)/ 2 + LighterMid) * CanvasElement_C.SCALE - space && y <= ((LighterHeight - LighterMid)/ 2 + LighterMid) * CanvasElement_C.SCALE + space){
      f4 = true;
      yO = ((LighterHeight - LighterMid)/ 2 + LighterMid) * CanvasElement_C.SCALE;
    }
    this.clearLine();
    if(f1 === true){
      CanvasHelper.Line(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height, this.lines.ctx);
    }
    // if(f2 === true){
      // CanvasHelper.Line(0, LighterMid * CanvasElement_C.SCALE, this.canvas.width, LighterMid * CanvasElement_C.SCALE, this.lines.ctx);
    // }
    if(f3 === true){
      CanvasHelper.Line(0, (LighterMid / 2) * CanvasElement_C.SCALE, this.canvas.width, LighterMid * CanvasElement_C.SCALE / 2, this.lines.ctx);
    }
    if(f4 === true){
      CanvasHelper.Line(0,((LighterHeight - LighterMid)/ 2 + LighterMid) * CanvasElement_C.SCALE, this.canvas.width, ((LighterHeight - LighterMid)/ 2 + LighterMid) * CanvasElement_C.SCALE, this.lines.ctx);
    }
    f1 = false;
    f2 = false;
    f3 = false; 
    f4 = false;
    return [xO, yO]; 
  }
  // getTextImg(){
  //   DSText.Storage.forEach(data => {
  //     let canvas = document.createElement("canvas");

  //         let width = Math.abs(data.FrameWidth);
  //         let height = Math.abs(data.FrameHeight);
          
  //         window.devicePixelRatio = 8;      
  //         let scale = window.devicePixelRatio; 

  //         canvas.width = Math.floor(width * scale);
  //         canvas.height = Math.floor(height * scale);

  //     let ctx = canvas.getContext('2d');
  //         ctx.scale(scale, scale);
  //         CanvasHelper.Text(ctx, data).draw(true);

  //     data.TextImg = canvas.toDataURL();
  //     canvas.remove();
  //   });
  // }
}

class CanvasHelper {
  static Line(x, y, dx, dy, ctx){
    // ctx.beginPath();
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.imageSmoothingEnabled = false;
    ctx.moveTo(x, y);
    ctx.lineTo(dx, dy);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
  static drawEdges(ctx, width, height, index = -1){
    let size = 48;
    ctx.fillStyle = 'black';
    switch(index){
      case 0: ctx.fillRect(-width / 2 - size, -height / 2 - size, size, size); break;
      case 1: ctx.fillRect(0 - size / 2, -height / 2 - size, size, size); break;
      case 2: ctx.fillRect(width / 2 , -height / 2 - size, size, size); break;
      case 3: ctx.fillRect(width / 2, 0 - size / 2, size, size); break;
      case 4: ctx.fillRect(width / 2 , height / 2, size, size); break;
      case 5: ctx.fillRect(0 - size / 2, height / 2, size, size); break;
      case 6: ctx.fillRect(-width / 2 - size, height / 2, size, size); break;
      case 7: ctx.fillRect(-width / 2 - size, 0 - size / 2, size, size); break;
      case 8: {
        ctx.drawImage(SVG_Loader.SVG.turn.src,0 - size , -height / 2 - (size *4), size*2, size*2); 

      } break; //ctx.fillRect(0 - size / 2, -height / 2 - size - 40, size, size); break;
      default: {
        ctx.fillRect(-width / 2 - size, -height / 2 - size, size, size);
        ctx.fillRect(width / 2 , -height / 2 - size, size, size);
        
        ctx.fillRect(-width / 2 - size, height / 2, size, size);
        ctx.fillRect(width / 2 , height / 2, size, size);
      
        ctx.fillRect(0 - size / 2, -height / 2 - size, size, size);
        ctx.fillRect(0 - size / 2, height / 2, size, size);
        
        ctx.fillRect(width / 2, 0 - size / 2, size, size);
        ctx.fillRect(-width / 2 - size, 0 - size / 2, size, size);

        ctx.drawImage(SVG_Loader.SVG.turn.src,0 - size , -height / 2 - (size *4), size*2, size*2); 
      } break;
    }
    return ctx;
  }
  static drawEdgesInteractive(ctx, width, height, index = -1){
    let size = 48;
    ctx.save();
    ctx.beginPath();
    switch(index){
      case 0: ctx.rect(-width / 2 - size, -height / 2 - size, size, size); break;
      case 1: ctx.rect(0 - size / 2, -height / 2 - size, size, size); break;
      case 2: ctx.rect(width / 2 , -height / 2 - size, size, size); break;
      case 3: ctx.rect(width / 2, 0 - size / 2, size, size); break;
      case 4: ctx.rect(width / 2 , height / 2, size, size); break;
      case 5: ctx.rect(0 - size / 2, height / 2, size, size); break;
      case 6: ctx.rect(-width / 2 - size, height / 2, size, size); break;
      case 7: ctx.rect(-width / 2 - size, 0 - size / 2, size, size); break;
      case 8: ctx.rect(0 - size, -height / 2 - (size*4), (size*2), (size*2)); break;
      default: {
        ctx.rect(-width / 2 - size, -height / 2 - size, size, size);
        ctx.rect(width / 2 , -height / 2 - size, size, size);
        
        ctx.rect(-width / 2 - size, height / 2, size, size);
        ctx.rect(width / 2 , height / 2, size, size);
      
        ctx.rect(0 - size / 2, -height / 2 - size, size, size);
        ctx.rect(0 - size / 2, height / 2, size, size);
        
        ctx.rect(width / 2, 0 - size / 2, size, size);
        ctx.rect(-width / 2 - size, 0 - size / 2, size, size);

        ctx.rect(0 - size, -height / 2 - (size*4), (size*2), (size*2));
      } break;
    }

    ctx.closePath();
    ctx.restore();
    return ctx;
  }
  static Text(ctx = null){
    function obj(ctx){
      this.edge = function(element, flag = false, index){
        if(flag){
          element.ctx_S.save();
          element.ctx_S.beginPath();
          element.ctx_S.fillStyle = 'black';
          element.ctx_S.translate(element.data.TextPosX, element.data.TextPosY);
          element.ctx_S.rotate(element.data.TextAlign * Math.PI / 180);
          element.ctx_S.scale(1, 1);
          CanvasHelper.drawEdgesInteractive(element.ctx_S, element.data.FrameWidth, element.data.FrameHeight, index);
          element.ctx_S.closePath();
          element.ctx_S.restore();
        } else {
          element.ctx.save();
          element.ctx.beginPath();
          element.ctx.fillStyle = 'black';
          element.ctx.translate(element.data.TextPosX, element.data.TextPosY);
          element.ctx.rotate(element.data.TextAlign * Math.PI / 180);
          element.ctx.scale(1, 1);
          CanvasHelper.drawEdges(element.ctx, element.data.FrameWidth, element.data.FrameHeight, index);
          element.ctx.closePath();
          element.ctx.restore();
        }
      }
      this.draw = function(element, renderFlag = false){
        if(ctx == null){
          if(renderFlag){
            ctx = element.ctx_S;
          } else {
            ctx = element.ctx;
            ctx.shadowColor = DSProject.getColorFor(DSProject.Storage.EPType);
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 2;
            // ctx.filter = 'blur(0.5px)';
          }
        }
        ctx.save();
        ctx.beginPath();
        ctx.translate(element.data.TextPosX, element.data.TextPosY);
        ctx.scale(2, 2);
        ctx.rotate(S_Math.toRadians(element.data.TextAlign));
        element.ctx.globalAlpha = 1;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = DSProject.getColorFor(DSProject.Storage.EPType);
        ctx.font = element.data.FontWeight + " " + element.data.FontStyle + " " + element.data.FontSize + "px " + element.data.FontFamily;
        let metrics     = 0;
        let max_width   = 0;
        let height      = 0;
        let max_height  = 0;
        let lines = element.data.TextValue.split('\n');
        for(let i = 0; i < lines.length; i++){
          metrics = ctx.measureText(lines[i]);
          height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
          let width = metrics.width;
          if(width > max_width){
            max_width = width;
          }
          if(height > max_height){
            max_height = height;
          }
        }
        ctx.textAlign = element.data.TextOrientation;
        ctx.textRendering  = "optimizeSpeed";
        let C_width = max_width / 2;
        let C_height = -(lines.length * max_height) / 2;
        for(let i = 0; i < lines.length; i++){
          if(element.data.TextOrientation == 'center'){
            ctx.strokeText(lines[i], 0,  C_height + ((i + 1) * max_height) );
            ctx.strokeText(lines[i], 0,  C_height + ((i + 1) * max_height) );
            // ctx.filter = 'blur(0.5px)';
            // ctx.strokeText(lines[i], 0,  C_height + ((i + 1) * max_height) );
            // ctx.strokeText(lines[i], 0,  C_height + ((i + 1) * max_height) );
            // // ctx.filter = 'blur(1px)';
            // ctx.strokeText(lines[i], 0,  C_height + ((i + 1) * max_height) );
          } else if(element.data.TextOrientation == 'right'){
            ctx.strokeText(lines[i], +C_width,  C_height + ((i + 1) * max_height) );
            ctx.strokeText(lines[i], +C_width,  C_height + ((i + 1) * max_height) );
            // ctx.filter = 'blur(0.5px)';
            // ctx.strokeText(lines[i], +C_width,  C_height + ((i + 1) * max_height) );
            // ctx.strokeText(lines[i], +C_width,  C_height + ((i + 1) * max_height) );
            // // ctx.filter = 'blur(1px)';
            // ctx.strokeText(lines[i], +C_width,  C_height + ((i + 1) * max_height) );
          } else {
            ctx.strokeText(lines[i], -C_width,  C_height + ((i + 1) * max_height) );
            ctx.strokeText(lines[i], -C_width,  C_height + ((i + 1) * max_height) );
            // ctx.strokeText(lines[i], -C_width,  C_height + ((i + 1) * max_height) );
            // ctx.strokeText(lines[i], -C_width,  C_height + ((i + 1) * max_height) );
            // // ctx.filter = 'blur(1px)';
            // // ctx.filter = 'blur(0.5px)';
            // ctx.strokeText(lines[i], -C_width,  C_height + ((i + 1) * max_height) );
          }
        }
        
        ctx.rect(-C_width, -((lines.length ) * max_height) / 2, max_width, (lines.length * max_height));
        
        element.data.FrameHeight     = ((lines.length) * max_height);
        element.data.FrameWidth      = max_width;
        element.data.TextLineHeight  = max_height;

        ctx.closePath();
        ctx.restore();
        
      }
    }
    return new obj(ctx);
  }
  static Image(ctx = null){
    function obj(ctx){
      this.edge = function(element, flag = false, index){
        if(flag){
          element.ctx_S.save();
          element.ctx_S.beginPath();
          element.ctx_S.fillStyle = 'black';
          element.ctx_S.translate(element.data.ImagePosX, element.data.ImagePosY);
          element.ctx_S.rotate(element.data.ImageAlign * Math.PI / 180);

          CanvasHelper.drawEdgesInteractive(element.ctx_S, element.data.ImageWidth, element.data.ImageHeight, index);
          element.ctx_S.closePath();
          element.ctx_S.restore();
        } else {
          element.ctx.save();
          element.ctx.beginPath();
          element.ctx.fillStyle = 'black';
          element.ctx.translate(element.data.ImagePosX, element.data.ImagePosY);
          element.ctx.rotate(element.data.ImageAlign * Math.PI / 180);

          CanvasHelper.drawEdges(element.ctx, element.data.ImageWidth, element.data.ImageHeight);
          element.ctx.closePath();
          element.ctx.restore();
        }
      }
      this.draw = function(element){
        //console.log(element);
        let scale = 2;
        let img = element.src;
        if(ctx == null){
          ctx = element.ctx;
        }
        ctx.save();
        ctx.beginPath();
        ctx.translate(element.data.ImagePosX, element.data.ImagePosY);
        ctx.scale(1/scale, 1/scale);
        ctx.rotate(element.data.ImageAlign * Math.PI/180);
        ctx.filter = 'blur(1px)';
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality  = "high";
        ctx.globalAlpha = 1;
        // element.ctx.globalAlpha = 1;
        ctx.drawImage(img, 0, 0, parseInt(img.width), parseInt(img.height), -element.data.ImageWidth / (2/(scale)), -element.data.ImageHeight / (2/(scale)), element.data.ImageWidth * scale, element.data.ImageHeight * scale);
        ctx.drawImage(img, 0, 0, parseInt(img.width), parseInt(img.height), -element.data.ImageWidth / (2/(scale)), -element.data.ImageHeight / (2/(scale)), element.data.ImageWidth * scale, element.data.ImageHeight * scale);
        ctx.drawImage(img, 0, 0, parseInt(img.width), parseInt(img.height), -element.data.ImageWidth / (2/(scale)), -element.data.ImageHeight / (2/(scale)), element.data.ImageWidth * scale, element.data.ImageHeight * scale);

        // element.ctx.globalAlpha = 1;
        // element.ctx.scale(10, 10);
        ctx.rect(-element.data.ImageWidth / 2, -element.data.ImageHeight / 2, element.data.ImageWidth, element.data.ImageHeight);
        ctx.closePath();
        ctx.restore();
      }
      this.dummy = function(element){
        element.ctx_S.save();
        element.ctx_S.beginPath();
        element.ctx_S.translate(element.data.ImagePosX, element.data.ImagePosY);
        element.ctx_S.rotate(element.data.ImageAlign * Math.PI/180);
        element.ctx_S.imageSmoothingEnabled = false;
    
        element.ctx_S.rect(-element.data.ImageWidth / 2, -element.data.ImageHeight / 2, element.data.ImageWidth, element.data.ImageHeight);
        element.ctx_S.closePath();
        element.ctx_S.restore();
      }
    }
    return new obj(ctx);
  }
  static fillTextWithSpacing(context, text, x, y, spacing){
      let wAll = context.measureText(text).width;
      // let array = text.split("");
      // console.log(array);
      // // for(let i = 0; i < wAll; i++){
      // //   console.log(text[i]);

      // // }
      let change = 0;
      do{
      let char = text.substr(0, 1);
      text = text.substr(1);
      context.fillText(char, x, y);
      let wShorter;
      if (text == "") {
        wShorter = 0;
      } else {
        wShorter = context.measureText(text).width;
      }
      let wChar = wAll - wShorter;
      change += wChar + spacing; 
      x += wChar + spacing;
      wAll = wShorter;
      } while (text != "");
      return change;
  }
}

function calcWidth(ctx, text, kerning){
  let offset = 0;
  for(let i = 0; i < text.length; i++){
    let messure = ctx.measureText(text[i]);
    offset += kerning + messure.width;
  }
  return offset + kerning;
}

function fillTextKerning(ctx, text, x, y, kerning){
  let offset = 0;
  for(let i = 0; i < text.length; i++){
    ctx.fillText(text[i], x + offset, y);
    let messure = ctx.measureText(text[i]);
    offset += kerning + messure.width;
  }
  return offset;
}
