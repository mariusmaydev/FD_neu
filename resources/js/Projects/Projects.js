

class DrawProject {
  constructor(parent = document.body, index = 1){
    this.id = "ProjectMenu_" + index + "_";
    this.parent = parent;
    this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
    this.mainElement.Class("ProjectMenuMain");
    // let projectList = new drawProjectList(this.mainElement);
    let projectList2 = new drawProjectList(this.mainElement, "test2");
    // new drawNewProject(projectList.mainElement);
    this.drawHealine("Deine Projekte");
  }
  drawHealine(value){
    this.headline = new SPLINT.DOMElement.SpanDiv(this.mainElement, "headline_Projects", value);
    this.headline.div.Class("headline");
    this.mainElement.insertBefore(this.headline.div, this.mainElement.firstChild);
  }
}