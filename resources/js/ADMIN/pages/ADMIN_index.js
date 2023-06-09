
class ADMIN_index extends ADMIN_DrawTemplate {
    constructor(){
        super("index");
        ADMIN_loginFuncs.check_redirect();
    }
    async draw(){
        this.icon = new SPLINT.DOMElement(this.id + "_icon", "img", this.mainElement);
        this.icon.Class("logo-icon").set();
        this.icon.src = PATH.images.logo;

        this.loginDiv = new SPLINT.DOMElement(this.id + "loginContainer1", "div", this.mainElement);
        this.loginDiv.Class("loginContainer");
            let login_name = new SPLINT.DOMElement.SpanDiv(this.loginDiv, "UserName", (await ADMIN_loginFuncs.UserName));
                login_name.Class("UserName");
            let bt_logout = new SPLINT.DOMElement.Button(this.loginDiv, "logout1");
                bt_logout.bindIcon("logout");
                bt_logout.setTooltip("abmelden", "bottom")
                bt_logout.onclick = function(){
                    ADMIN_loginFuncs.logout();
                }

        this.navigationMenu = new ADMIN_NavigationMenu(this.mainElement);   
        this.navigationMenu.draw();

        // this.svg = new SPLINT.DOMElement.SVG(this.mainElement, "test");
        // this.svg.width = "10%";
        // this.svg.height = "100%";
        // this.svg.setViewBox(0, 0, 10, 100);

        // let p = this.svg.newPATH("test");
        //     p.moveTo(0, 0);
        //     p.lineTo(100, 0);
        //     p.lineTo(100, 100);
        //     p.lineTo(0, 100);
        //     p.lineTo(0, 0);
        //     p.stroke = "black";
        //     p.fill = "none";
        //     p.close();
        //     p.Class("path")

        // this.svg.add(p);
            // p.close();
    }
}





function drawChart(){
    const ctx = document.getElementById('ViewChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [500, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}