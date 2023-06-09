class drawProjectChoiceMenu {
    constructor(parent){
      this.parent = parent;
      this.id = "ProjectChoiceMenu_";
      this.CategoryMenu = null;
      this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
      this.mainElement.Class("ProjectContainer");
      this.listBody = new SPLINT.DOMElement(this.id + "listBody", "div", this.mainElement);
      this.listBody.Class("ProjectListBody");
      this.draw();
      window.onhashchange = this.#chooseType.bind(this);
      this.#chooseType();
    }
    draw(){
      let headlineDiv = new SPLINT.DOMElement.SpanDiv(this.mainElement, "headline", "Entwürfe");
          headlineDiv.div.Class("headline");
          
      let buttonDiv = new SPLINT.DOMElement(this.id + "buttonDiv", "div", this.mainElement);
          buttonDiv.Class("buttons");
            let buttonContentDiv = new SPLINT.DOMElement(this.id + "buttonContentDiv", "div", buttonDiv);
                buttonContentDiv.Class("buttonsContent");
            let buttonsCategoryMenuDiv = new SPLINT.DOMElement(this.id + "buttonsCategoryMenuDiv", "div", buttonDiv);
                buttonsCategoryMenuDiv.Class("buttonsCategoryContainer");
                // buttonsCategoryMenuDiv.
      let div_originals = buttonContentDiv.newDiv("div_originals", "originals");
        this.bt_originals = new SPLINT.DOMElement.Button(div_originals, "project_originals", "Orginale");

            this.CategoryMenu_originals = new ProjectCategoryMenu(div_originals, true, true);

        this.bt_originals.setStyleTemplate(S_Button.STYLE_DEFAULT);
        this.bt_originals.button.state().setActive();
        this.bt_originals.button.onclick = function(){
              // this.CategoryMenu_public.hide = true;
              // this.CategoryMenu_originals.hide = false;
              this.bt_originals.button.state().setActive();
              this.bt_public.button.state().unsetActive();
              this.bt_private.button.state().unsetActive();
              S_Location.setHash("originals");
            }.bind(this);
        // if(SPLINT.Tools.Location.getHashes().includes("originals")){
        //   this.CategoryMenu = new ProjectCategoryMenu(div_originals, true);
          this.CategoryMenu_originals.callBack = function(data){
            this.public(true, data);
          }.bind(this);
        // }

      let div_public = buttonContentDiv.newDiv("div_public", "public");
        this.bt_public = new SPLINT.DOMElement.Button(div_public, "project_public", "Vorlagen");

        this.CategoryMenu_public = new ProjectCategoryMenu(div_public, false, true);

        this.bt_public.setStyleTemplate(S_Button.STYLE_DEFAULT);
        this.bt_public.button.state().setActive();
        this.bt_public.button.onclick = function(){
              // this.CategoryMenu_originals.hide = true;
              // this.CategoryMenu_public.hide = false;
            //   this.bt_public.button.state().setActive();
            //   this.bt_originals.button.state().unsetActive();
            //   this.bt_private.button.state().unsetActive();
              S_Location.setHash("public");
            }.bind(this);
            // this.CategoryMenu_public.hide = true;
        // if(SPLINT.Tools.Location.getHashes().includes("public")){
        //   this.CategoryMenu = new ProjectCategoryMenu(div_public, false);
          this.CategoryMenu_public.callBack = function(data){
            this.public(false, data);
          }.bind(this);
        // }
      
      let div_private = buttonContentDiv.newDiv("div_private", "private");
          this.bt_private = new SPLINT.DOMElement.Button(div_private, "project_private", "deine Designs");
          this.bt_private.setStyleTemplate(S_Button.STYLE_DEFAULT);
          this.bt_private.button.state().unsetActive();
          this.bt_private.onclick = function(){
            // this.CategoryMenu_originals.hide = true;
            // this.CategoryMenu_public.hide = true;
            // this.bt_originals.button.state().unsetActive();
            // this.bt_public.button.state().unsetActive();
            // this.bt_private.button.state().setActive();
                S_Location.setHash("private_storage");
              }.bind(this);

        function changeViewPortSize(){
            let vp = SPLINT.ViewPort.getSize();
            console.log(vp);
            if(vp == "mobile-small"){
                console.dir(this.CategoryMenu_originals.mainElement.S.state.setActive());
                this.CategoryMenu_originals.move(buttonsCategoryMenuDiv);
                this.CategoryMenu_public.move(buttonsCategoryMenuDiv);
            } else {
                this.CategoryMenu_originals.move(div_originals);
                this.CategoryMenu_public.move(div_public);
            }
        };
        changeViewPortSize.call(this);
        SPLINT.ViewPort.onViewPortChanged = changeViewPortSize.bind(this);
    }
    #chooseType(){
      // if(this.CategoryMenu != null){
      //   this.CategoryMenu.remove();
      // }
      // this.draw();
      let hashes = S_Location.getHashes();
      let type = hashes;
      let state = "NORMAL";
      if(Array.isArray(hashes)){
        type  = hashes[0];
        state = hashes[1];
      }
      switch(type){
        case "public" :  this.public(); break;
        case "originals" :  this.public(true); break;
        case "private_cart" : this.private(true); break;
        case "private_storage" : this.private(false); break;
        default : this.private(); break;
      }
    }
    async private(isCart = false){
      this.CategoryMenu_originals.hide = true;
      this.CategoryMenu_public.hide = true;
      this.bt_originals.button.state().unsetActive();
      this.bt_public.button.state().unsetActive();
      this.bt_private.button.state().setActive();
      if(this.list_public != undefined){
        this.list_public.remove();
      }
      if(isCart){
        if(this.list_private_NORMAL != undefined){
          this.list_private_NORMAL.remove();
        }
        let data = await ProjectHelper.getAll("CART");
        this.list_private_CART = new drawProjectList(this.listBody, "CART", data, false);
            let head_c = new SPLINT.DOMElement("CART_head", "div", this.list_private_CART.mainElement);
                head_c.before(this.list_private_CART.table.mainElement);
                let text_c = new SPLINT.DOMElement.SpanDiv(head_c, "CART_head_span", "im Einkaufswagen");
                let hr_c = new SPLINT.DOMElement.HorizontalLine(head_c);
      } else {
        if(this.list_private_CART != undefined){
          this.list_private_CART.remove();
        }
        if(this.list_original != undefined){
          this.list_original.remove();
        }
            let data = await ProjectHelper.getAll("NORMAL");
            this.list_private_NORMAL = new drawProjectList(this.listBody, "NORMAL", data, false, true);
                let head_N = new SPLINT.DOMElement("NORMAL_head", "div", this.list_private_NORMAL.mainElement);
                    head_N.before(this.list_private_NORMAL.table.mainElement);
                    let text_N = new SPLINT.DOMElement.SpanDiv(head_N, "NORMAL_head_span", "deine Designs");
                    let hr_N = new SPLINT.DOMElement.HorizontalLine(head_N);

      }
      
    }
    async public(isOriginal = false, data = null){
      this.bt_private.button.state().unsetActive();
      if(this.list_private_NORMAL != undefined){
        this.list_private_NORMAL.remove();
      }
      if(this.list_private_CART != undefined){
        this.list_private_CART.remove();
      }
      if(isOriginal){
        this.CategoryMenu_originals.hide = false;
        this.CategoryMenu_public.hide = true;
        this.bt_public.button.state().unsetActive();
        this.bt_originals.button.state().setActive();
        if(this.list_public != undefined){
          this.list_public.remove();
        }
        if(data == null){
          data = await ProjectHelper.getAllAdmin(true);
        }
        this.list_original = new drawProjectList(this.listBody, "ORIGINAL", data, true);
          let head = new SPLINT.DOMElement("ORIGINAL_head", "div", this.list_original.mainElement);
              head.before(this.list_original.table.mainElement);
              let text = new SPLINT.DOMElement.SpanDiv(head, "ORIGINAL_head_span", "Orginale");
              let hr = new SPLINT.DOMElement.HorizontalLine(head);
      } else {
        this.CategoryMenu_public.hide = false;
        this.CategoryMenu_originals.hide = true;
        this.bt_public.button.state().setActive();
        this.bt_originals.button.state().unsetActive();
        if(this.list_original != undefined){
          this.list_original.remove();
        }
        if(data == null){
          data = await ProjectHelper.getAllAdmin(false);
        }
        this.list_public = new drawProjectList(this.listBody, "PUBLIC", data, true);
          let head = new SPLINT.DOMElement("PUBLIC_head", "div", this.list_public.mainElement);
              head.before(this.list_public.table.mainElement);
              let text = new SPLINT.DOMElement.SpanDiv(head, "PUBLIC_head_span", "Vorlagen");
              let hr = new SPLINT.DOMElement.HorizontalLine(head);
      }
    }
  }
