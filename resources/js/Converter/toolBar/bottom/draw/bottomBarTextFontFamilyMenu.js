
class BottomBar_Text_FontFamily_Menu {
    constructor(parent, tools, data){
        this.TOOLS = tools;
        this.parent = parent;
        this.data = data;
        this.list = [];
        this._onRemoveFloatingDiv = function(){};
        this.genList();
        this.draw();
    }
    genList(){
        this.add("Impact");
        this.add("Roboto");
        this.add("Arial");
        this.add("Verdana");
        this.add("Georgia");
    }
    set onRemoveFloatingDiv(v){
        this._onRemoveFloatingDiv = v;
        this.floatingDiv.onRemoveFloatingDiv = v;
    }
    draw(){
        this.floatingDiv = new Converter_BottomBar_floatingDiv_block("fontFamilySlideShow");
        this.slideShow = new SPLINT.DOMElement.SlideShow(this.floatingDiv.content, "FontFamily");

        this.genElement();

        this.slideShow.onClickElement = function(div, listElement){
            this.data.FontFamily = div.getAttribute("value");
            CONVERTER_STORAGE.canvasNEW.setActive(this.data, "txt", true);
        }.bind(this);

        this.slideShow.value = this.data.FontFamily;
        // alert(JSON.stringify(this.floatingDiv.content.getBoundingClientRect()) + "    " + JSON.stringify(this.parent.getBoundingClientRect()));

    }
    genElement(){
        for(const font of this.list){
            let sp = new SPLINT.DOMElement.SpanDiv(document.body, font.name, font.value);
                sp.div.setAttribute("value", font.value);
            this.slideShow.appendElement(sp.div);
        }
    }
    add(name, value = name){
        let obj = new Object();
            obj.name = name;
            obj.value = value;
        this.list.push(obj);
    }
}