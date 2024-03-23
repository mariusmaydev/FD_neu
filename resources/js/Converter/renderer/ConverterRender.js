
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
    this.lines.ctx    = this.lines.canvas.getContext('2d', {desynchronized: true});
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
    
    SPLINT.ViewPort.onViewPortChanged = function(){
        this.setListeners();
    }.bind(this);
  }
  ThumbnailCreator = new ConverterRenderThumbnail(this);
  setListeners(){
    if(SPLINT.ViewPort.getSize() == "mobile-small"){
        window.addEventListener("touchstart", ConverterTouchHandler.touchStart.bind(this), false);
        window.addEventListener("touchmove", ConverterTouchHandler.touchMove.bind(this), false);
        window.addEventListener("touchend", ConverterTouchHandler.touchEnd.bind(this), false);
    } else {
        window.addEventListener("mousedown", ConverterMouseHandler.mouseDown.bind(this));
        window.addEventListener("mousemove", ConverterMouseHandler.mouseMove.bind(this));
        window.addEventListener("mouseup", ConverterMouseHandler.mouseUp.bind(this));

    }


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
    
    // this.initLines();
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
  async createTextData(scale = 1){
    let size = {
        x: this.canvas.width * scale,
        y: this.canvas.height * scale,
        scale: scale
    }
    for(const element of this.stack){
        if(element.type == "txt"){

            let postEle = JSON.parse(JSON.stringify( element));
                postEle.data.TextAlign = 0;
            let canvas = document.createElement("canvas");
                canvas.width  = (postEle.data.FrameWidth * size.scale) + 10;
                canvas.height = (postEle.data.FrameHeight * size.scale) + 10;

            let ctx     = canvas.getContext('2d');
                ctx.fillStyle = "transparent";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.scale(size.scale / 2, size.scale / 2);

            let a = postEle.data.TextPosX;
            let b = postEle.data.TextPosY;

                postEle.data.TextPosX = (canvas.width ) / (size.scale );
                postEle.data.TextPosY = (canvas.height) / (size.scale );
                postEle.ctx = ctx;

            canvasPaths.drawTextForData(postEle, true);
            
            element.data.TextImg = await canvas.toDataURL("image/png", 1);
            element.data.TextPosX = a;
            element.data.TextPosY = b;
        }
    }
  }
  getElementForCoords(){
    let ele = null;
    this.stack.forEach(element =>{
      if(element.type == "img" && element.src.naturalHeight != 0){
        if(this.#check(element.ctx, element.paths.rect)){
          ele = element;
          ele.dragEdge = -1;
        }
        for(let i = 0; i <= 8; i++){
          if(this.#check(element.ctx, element.paths.edges[i])){
            ele = element;
            ele.dragEdge = i;
          }
        }
      } else if(element.type == "txt"){
        if(this.#check(element.ctx, element.paths.rect)){
          ele = element;
          ele.dragEdge = -1;
        }
        
        CanvasHelper.Text().edge(element, true, 8);
        if(this.#check(element.ctx, element.paths.edges[8])){
          ele = element;
          ele.dragEdge = 8;
        }
      }
    });
    this.hoverElement = ele;
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
          o.ctx    = o.canvas.getContext('2d', {desynchronized: true});
          o.paths       = new Object();
          o.paths.edges = [];
          // o.input  = new canvasTextInput(o.ID, ConverterHelper.ELE_SQUARE_BORDER_DIV, obj);
          if(dataIn.TextPosX == -1 || dataIn.TextPosY == -1){
            dataIn.TextPosX = obj.canvas.width / 2;
            dataIn.TextPosY = obj.canvas.height / 2;
          }
          o.data = dataIn;
          o.paths       = new Object();
          o.paths.edges = [];
          obj.#update();
          obj.draw(o);
          canvasPaths.updateTxtPath(o);
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
          o.time     = SPLINT.Tools.DateTime.Helper.getTimeFromURL(dataIn.images.view);
          o.canvas   = new SPLINT.DOMElement(obj.id + "_" + dataIn.ImageID + "_IMG", "canvas", obj.parent);
          o.canvas.width = obj.canvas.width;
          o.canvas.height = obj.canvas.height;
          o.ctx      = o.canvas.getContext('2d', {desynchronized: false});



        //   o.canvas_off1 = new SPLINT.DOMElement(obj.id + "_" + dataIn.ImageID + "_IMG_OFF", "canvas", obj.parent);
        //   o.canvas_off1.width = o.canvas.width;
        //   o.canvas_off1.height = o.canvas.height;
        //   o.ctx_off = o.canvas_off1.getContext("bitmaprenderer");
        //   o.canvas_off2 = new OffscreenCanvas(o.canvas_off1.width, o.canvas_off1.height);
        //   o.WORKER = new SPLINT.Worker.WebWorker("/js/_WebWorker/_common/_converterWorker/_ConverterRenderWorker.js", false, false);
        //   o.WORKER.init().then(function(){
        //     o.WORKER.send("init", {canvas: o.canvas_off2}, [o.canvas_off2]);
        //     o.WORKER.onReceive = function(e){
        //       if(e.data.msg == "render"){
        //           o.ctx_off.transferFromImageBitmap(e.data.bitmap);
        //       }
        //     }
        //   })


          o.paths       = new Object();
          o.paths.edges = [];
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
        //   console.log(dataIn)
        //   debugger
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
                    if(DSProject.Storage.grayscale != true){
                        ctx.fillStyle = DSProject.getColorFor(DSProject.Storage.EPType);
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                    ctx.globalCompositeOperation = "source-over";
                let imgData = canvas.toDataURL('image/png', 1);

                canvas.remove();
                o.src.src   = imgData;
                o.src.width = Math.abs(img.width);
                o.src.height = Math.abs(img.height);
                o.src.onload = function(){
                  obj.#update();
                    canvasPaths.updateImgPath(o);
                //   canvasPaths.updatePointPath(element, x, y, width, height, index)
                  obj.draw(o);
                }.bind(obj, o);
              }.bind(obj, o);

          o.data      = dataIn;
          o.reload = function(){
            o.src.src = "";
            img.src = dataIn.images.view;
            o.time     = SPLINT.Tools.DateTime.Helper.getTimeFromURL(dataIn.images.view);
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
  #check(ctx, path = null){
    if(path != null){
        return ctx.isPointInPath(path, this.mouse.X * this.ratio.X, this.mouse.Y * this.ratio.Y);
    }
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
        if(SPLINT.Tools.DateTime.Helper.getTimeFromURL(data.images.view) != response.element.time){
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
      } else {
        this.stack.push(this.#newStackObj("txt", data));
      }
    }
    this.EPType = DSProject.Storage.EPType;
  }
  #update(){
    this.stack.forEach(element => {
      if(element.type == "img"){
        let data = DSImage.get(DSImage.getIndex(element.ID));
        if(data == undefined){
          element.ctx.clearRect(0, 0, element.canvas.width, element.canvas.height);
          this.stack.splice(this.stack.indexOf(element), 1);
          return;
        }
        if(SPLINT.Tools.DateTime.Helper.getTimeFromURL(data.images.view) != element.time){
          this.checkEdge(element);
          this.activeElement = element;
          this.setFirstInStack(element);
        }
        this.draw(element);
      } else {
        let data = DSText.get(DSText.getIndex(element.ID));
        if(data == undefined){
          element.ctx.clearRect(0, 0, element.canvas.width, element.canvas.height);
          this.stack.splice(this.stack.indexOf(element), 1);
          return;
        }
          this.checkEdge(element);
          this.activeElement = element;
          this.draw(element);
      }
    });
  }
  draw(element){
    // window.requestAnimationFrame(function(){
      element.ctx.clearRect(0, 0, element.canvas.width, element.canvas.height);
      if(element.type == "img" && element.src.naturalHeight != 0){
        if(this.mouse.down && this.dragElement == element && element.dragEdge == -1 && element.resize != true){
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
        }
        CanvasHelper.Image().draw(element, element.drawEdge);
      } else if(element.type == "txt"){
        if(this.mouse.down && this.dragElement == element && element.dragEdge == -1 && element.resize != true){
          element.data.TextPosX = this.mouse.X * this.ratio.X + element.offset.X;
          element.data.TextPosY = this.mouse.Y * this.ratio.Y + element.offset.Y;
        }
        if(element.drawEdge){
          this.focusCanvas(element);
        }
        CanvasHelper.Text().draw(element, element.drawEdge);
      }
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
        ConverterComputeEdges.compute(element, element.dragEdge, this.mouse, this.ratio);
    } else {
      CanvasHelper.Text().edge(element, false, 8);
      if(element.dragEdge == 2){
        element.data.TextPosX = this.mouse.X * this.ratio.X + element.offset.X;
        element.data.TextPosY = this.mouse.Y * this.ratio.Y + element.offset.Y;
      } else {
        let a = element.data.TextPosX - (this.mouse.X * this.ratio.X);
        let b = element.data.TextPosY - (this.mouse.Y * this.ratio.Y);
        let c = S_Math.pytagoras(a, b);
        if(a < 0 ){
          element.data.TextAlign = Math.round(S_Math.toDegrees(Math.acos(b / c)));
        } else {
          element.data.TextAlign = Math.round(-S_Math.toDegrees(Math.acos(b / c)));
        }
        if(CONVERTER_STORAGE.toolBar.textBar != undefined){
            for(const ele of CONVERTER_STORAGE.toolBar.textBar.ELEMENTS){
                  if(ele.TextID == element.ID){
                      ele.sl_rotation.value = element.data.TextAlign;
                  }
            }
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
    if(this.activeElement != null){
        if(this.activeElement.type == "img"){
            this.activeElement.calcEdgeFlag = false;
            canvasPaths.updateImgPath(this.activeElement);
        } else {
            this.activeElement.calcEdgeFlag = false;
            canvasPaths.updateTxtPath(this.activeElement);
        }
    }
    this.dragElement = null;
    DSController.saveAll.callFromIdle(1000, DSController);
  }
  clearLine(full = false){
    this.lines.ctx.clearRect(0, 0, this.lines.canvas.width, this.lines.canvas.height);
    if(!full){
      // CanvasHelper.Line(0, LighterMid * CanvasElement_C.SCALE, this.canvas.width, LighterMid * CanvasElement_C.SCALE, this.lines.ctx);
    }
  }
//   initLines(){
    
//     ConverterLinesHelper.ctx = this.lines.ctx;
//     let t = new ConverterLine(0, 900, this.canvas.width, 900, "test");
//         t.scheme.color = "red";
//         t.scheme.lineWidth = 0.5;
//     ConverterLinesHelper.addLine(t);
//   }
  drawLine(x, y, data){
    let space = 25;
    let f1 = false;
    let f2 = false;
    let f3 = false; 
    let f4 = false;
    let fR = false;
    let fL = false;
    let fT = false;
    let fB = false;
    let xO = x;
    let yO = y;
    // let g = this.canvas.getBoundingClientRect();
    //right
    if(data.ImageAlign == 0 || data.ImageAlign == 90 || data.ImageAlign == 180 || data.ImageAlign == 270 || data.ImageAlign == 360){
        let xF = data.ImageWidth / 2 + x;
        let xF1 = -data.ImageWidth / 2 + x;
        let yF = data.ImageHeight / 2 + y;
        let yF1 = -data.ImageHeight / 2 + y;
        if(xF >= this.canvas.width - space && xF <= this.canvas.width + space){
            fR = true;
            xO = this.canvas.width - data.ImageWidth / 2;
        }
        if(xF1 >= 0 - space && xF1 <= 0 + space){
            fL = true;
            xO = data.ImageWidth / 2;
        }        
        if(yF >= this.canvas.height - space && yF <= this.canvas.height + space){
            fB = true;
            yO = this.canvas.height - data.ImageHeight / 2;
        }
        if(yF1 >= 0 - space && yF1 <= 0 + space){
            fT = true;
            yO = data.ImageHeight / 2;
        }
    }

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
    // ConverterLinesHelper.drawAllLines();
    // ConverterLinesHelper.ctx = this.lines.ctx;
    // let g = ConverterLinesHelper.checkLines(x  , y , data)
    // if(g != undefined){
    //     xO = g[0];
    //     yO = g[1];
    // }

    let scheme = { 
        lineWidth : 1.5,
        color : "orange"
    }
    if(f1 === true){
      CanvasHelper.Line(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height, this.lines.ctx, scheme);
    }
    if(fR === true){
      CanvasHelper.Line(this.canvas.width-5, 0, this.canvas.width-5, this.canvas.height, this.lines.ctx, scheme);
    }
    if(fL === true){
      CanvasHelper.Line(5, 0, 5, this.canvas.height, this.lines.ctx, scheme);
    }
    if(fT === true){
      CanvasHelper.Line(0, 5, this.canvas.width, 5, this.lines.ctx, scheme);
    }
    if(fB === true){
      CanvasHelper.Line(0, this.canvas.height-5, this.canvas.width, this.canvas.height-5, this.lines.ctx, scheme);
    }
    if(f2 === true){
      CanvasHelper.Line(0, LighterMid * CanvasElement_C.SCALE, this.canvas.width, LighterMid * CanvasElement_C.SCALE, this.lines.ctx, scheme);
    }
    if(f3 === true){
      CanvasHelper.Line(0, (LighterMid / 2) * CanvasElement_C.SCALE, this.canvas.width, LighterMid * CanvasElement_C.SCALE / 2, this.lines.ctx, scheme);
    }
    if(f4 === true){
      CanvasHelper.Line(0,((LighterHeight - LighterMid)/ 2 + LighterMid) * CanvasElement_C.SCALE, this.canvas.width, ((LighterHeight - LighterMid)/ 2 + LighterMid) * CanvasElement_C.SCALE, this.lines.ctx, scheme);
    }
    f1 = false;
    f2 = false;
    f3 = false; 
    f4 = false;
    fR = false;
    fL = false;
    fT = false;
    fB = false;
    return [xO, yO]; 
  }
}

class CanvasHelper {
  static Line(x, y, dx, dy, ctx, scheme = null){
    if(scheme === null){
        scheme = { 
            lineWidth : 0.5,
            color : "white"
        }
    }
    // ctx.beginPath();
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = scheme.lineWidth;
    ctx.fillStyle = scheme.color;
    ctx.strokeStyle = scheme.color;
    ctx.imageSmoothingEnabled = false;
    ctx.moveTo(x, y);
    ctx.lineTo(dx, dy);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
  static drawEdges(element, width, height, index = -1){
    return element.ctx;
  }
  static drawEdgesInteractive(element, width, height, index = -1){
    canvasPaths.updatePointPath(element, width, height, index)
    return element.ctx;
  }
  static Text(ctx = null){
    function obj(ctx){
      this.edge = function(element, flag = false, index){
        if(flag){
          CanvasHelper.drawEdges(element, element.data.FrameWidth, element.data.FrameHeight, index);
        } else {
          CanvasHelper.drawEdges(element, element.data.FrameWidth, element.data.FrameHeight, index);
        }
      }
      this.draw = function(element, pointFlag = true, thumbnailFlag = false, renderFlag = false){
        if(pointFlag){
            canvasPaths.updatePointPath(element, element.data.FrameWidth, element.data.FrameHeight, 8);
        }
        canvasPaths.updateTxt(element, renderFlag, thumbnailFlag);    
      }
    }
    return new obj(ctx);
  }
  static Image(ctx = null){
    function obj(ctx){
      this.edge = function(element, flag = false, index){
        if(flag){
            CanvasHelper.drawEdges(element, element.data.ImageWidth, element.data.ImageHeight, index);
        } else {
            CanvasHelper.drawEdges(element, element.data.ImageWidth, element.data.ImageHeight);
        }
      }
      this.draw = function(element, pointFlag = true, black = false){    
        if(pointFlag){
            canvasPaths.updatePointPath(element, element.data.ImageWidth, element.data.ImageHeight);
        }
            canvasPaths.updateImg(element, black);
      }
    }
    return new obj(ctx);
  }
  static fillTextWithSpacing(context, text, x, y, spacing){
      let wAll = context.measureText(text).width;
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
