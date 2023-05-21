// const { default: Chart } = require("chart.js/auto");


class test_chartJS {
    constructor(parent){
        this.parent = parent;
        this.id = "ChartJSTest_";
        this.mainElement = new SPLINT.DOMElement(this.id + "main", "div", this.parent);
        this.draw();
    }
    draw(){
        const data = {
            labels: [65, 59, 80, 81, 56, 55, 40],
            datasets: [{
              label: 'Aufrufe seit 24h',
              data: [65, 59, 80, 81, 56, 55, 40],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
              ],
              borderWidth: 1
            }]
          };
        const config = {
            type: 'bar',
            data: data,
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            },
          };
          let c = new SPLINT.DOMElement.ChartContainer("test2", this.mainElement, config);
                console.dir(c.Chart)
        //   let b = new Chart(ctx, config);
    }
}