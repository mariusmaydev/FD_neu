
var svg;

var svgTargets;
var padding;

class SVG_anmiation_test {
    constructor(){
        svg = this.createSvgBackground();
        
        svgTargets = document.querySelectorAll(".svg-target");
        padding = 50;
    
        this.createSvgPath();
        this.createSvgPathDot();
        window.addEventListener("resize", function() {
            svg.innerHTML = "";
            this.createSvgPath();
            this.createSvgPathDot();
        }.bind(this));
    }
    createSetup() {
        const children = Array.from(document.body.children).filter((child) => {
            return (
                child.tagName.toLowerCase() !== "script" &&
                child.tagName.toLowerCase() !== "style"
            );
        });
    
        if (children.length > 0) {
            children.forEach((child) => {
                if (child) {
                    Object.assign(child.style, {
                        // position: "relative",
                        "z-index": 2
                    });
                }
            });
        }
    }
    
    createSvgBackground() {
        this.createSetup();
    
        document.body.style.position = "relative";
    
        const svgElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
    
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "400%");
    
        Object.assign(svgElement.style, {
            top: "0",
            left: "0",
            bottom: "0",
            right: "0",
            "pointer-event": "none",
            "user-select": "none",
            "z-index": 1004,
            position: "absolute"
        });
        // getElementById("indexOverlay_content_main")
        document.getElementById("indexOverlay_content_main").appendChild(svgElement);
    
        return svgElement;
    }
    
    
    
    createSvgPath() {
        let d = "";
        let prevX = 0;
        let prevY = 0;
    
        svgTargets.forEach((target, index) => {
            const { x, y, height } = target.getBoundingClientRect();
            let xPos = x + window.scrollX - padding;
            let yPos = y - window.scrollY + height / 2;
            console.log(y , window.scrollY)
    
            if (index === 0) {
                d += `M ${xPos} ${yPos}`;
            } else {
                if (prevX != xPos) {
                    const round = 120;
                    const midY = (yPos + prevY) / 2;
                    if (xPos < prevX) {
                        d += `L ${prevX} ${midY - round}`;
                        d += `Q ${prevX} ${midY}, ${prevX - round} ${midY}`;
                        d += `L ${xPos + 100} ${midY}`;
                        d += `Q ${xPos} ${midY}, ${xPos} ${midY + round}`;
                    } else {
                        d += `L ${prevX} ${midY - round}`;
                        d += `Q ${prevX} ${midY}, ${prevX + round} ${midY}`;
                        d += `L ${xPos - 100} ${midY}`;
                        d += `Q ${xPos} ${midY}, ${xPos} ${midY + round}`;
                    }
                } else {
                    d += ` L ${xPos} ${yPos}`;
                }
            }
    
            prevX = xPos;
            prevY = yPos;
        });
    
        this.createPath(d);
        this.animatePath(this.createPath(d, true));
    }
    
    animatePath(path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
    
        document.getElementById("drawLighter3D_test_canvas").addEventListener("wheel", function (e) {
            const { scrollTop: bodyScrollTop } = document.documentElement;;
            const { clientHeight, scrollHeight, scrollTop } = document.getElementById("indexOverlay_content_main");
            const height = scrollHeight - clientHeight;
            const top = bodyScrollTop + scrollTop;
            const scrollpercent = top / height;
            const progression = length * scrollpercent;
            path.style.strokeDashoffset = scrollTop;//length - progression;
            svg.style.top = -scrollTop;
            console.log(path.style.strokeDashoffset)
        });
    }
    
    createPath(d, white) {
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", white ? "#000000" : "#343c48");
        path.setAttribute("stroke-width", "3");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-dasharray", "1,10");
        svg.appendChild(path);
        return path;
    }
    
    createSvgPathDot() {
        svgTargets.forEach((target) => {
            const { x, y, height } = target.getBoundingClientRect();
            const circle = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );
            const xPos = x - padding;
            const yPos = y + window.scrollY + height / 2;
    
            circle.setAttribute("cx", xPos);
            circle.setAttribute("cy", yPos);
            circle.setAttribute("r", 5);
            circle.setAttribute("fill", "#000000");
            circle.setAttribute("stroke", "#0c1016d9");
            circle.setAttribute("stroke-width", "4");
            svg.appendChild(circle);
        });
    }    
}
