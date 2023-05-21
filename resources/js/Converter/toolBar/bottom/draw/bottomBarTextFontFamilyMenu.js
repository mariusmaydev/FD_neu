
class BottomBar_Text_FontFamily_Menu {
    constructor(parent, tools, data){
        this.TOOLS = tools;
        this.parent = parent;
        this.data = data;
        this.list = [];
        this.genList();
        this.draw();
    }
    genList(){
        this.add("Impact");
        this.add("Roboto");
        this.add("Arial");
    }
    draw(){
        this.floatingDiv = new Converter_BottomBar_floatingDiv_block("fontFamilySlideShow");
        this.slideShow = new SlideShow_S(this.floatingDiv.content, "FontFamily");

        this.genElement();

        this.slideShow.onClickElement = function(div, listElement){
            this.TOOLS.fontFamily(div.getAttribute("value"));
        }.bind(this);

        this.slideShow.value = this.data.FontFamily;

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