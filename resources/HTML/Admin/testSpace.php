<!DOCTYPE html>
<html lang="de">
    <head>
        <title>Admin</title>
        <s-style src="A_testSpace.css"></s-style>
        <meta name="robots" content="noindex"/>
        <meta name="robots" content="nofollow"/>
    </head>
    <body id="Body_ADMIN_testSpace">

        <s-part pre src="/js/GLOBAL/Paths.js"></s-part>
        <s-part src="/js/ADMIN/testspace/test_nesting.js"></s-part>
        <s-part src="/js/ADMIN/testspace/main.js"></s-part>
        <s-part src="/js/Designs/CategoryHelper.js"></s-part>
        <s-part src="/js/manager/manager.js"></s-part>
        <s-loader src="/js/ADMIN/Eventhandler.js"></s-loader>
        <s-part src="/js/Designs/CategoryHelper.js"></s-part>
        <s-part src="/js/Projects/ProjectsHelper.js"></s-part>
        <s-part src="/js/Projects/ProjectList/ProjectCategoryMenu.js"></s-part>
        <s-part src="/js/Projects/ProjectList/ProjectChoiceMenu.js"></s-part>

        <script type="text/javascript" src="../../../../Splint/js/Splint.js" onload="SPLINT.start()"></script>
          <canvas id="main" width="200" height="200" style="width: 200px; height: 200px"></canvas>
          <canvas id="worker" width="200" height="200" style="width: 200px; height: 200px"></canvas>
        <script>
const canvasA = document.getElementById("main");
const canvasB = document.getElementById("worker");

const ctxA = canvasA.getContext("2d");
const canvasWidth = ctxA.width;
const canvasHeight = ctxA.height;

// Create a counter for Canvas A
let counter = 0;
setInterval(() => {
  redrawCanvasA();
  counter++;
}, 100);

// Redraw Canvas A counter
function redrawCanvasA() {
  ctxA.clearRect(0, 0, canvasA.width, canvasA.height);
  ctxA.font = "24px Verdana";
  ctxA.textAlign = "center";
  ctxA.fillText(counter, canvasA.width / 2, canvasA.height / 2);
}

// This function creates heavy (blocking) work on a thread
function fibonacci(num) {
  if (num <= 1) {
    return 1;
  }
  return fibonacci(num - 1) + fibonacci(num - 2);
}

// Call our Fibonacci function on the main thread
function slowMainThread() {
  fibonacci(42);
}

// Set up a worker thread to render Canvas B
const worker = new Worker("../../js/Converter/renderer/ConverterRenderWorker.js");

// Use the OffscreenCanvas API and send to the worker thread
const canvasWorker = canvasB.transferControlToOffscreen();
worker.postMessage({ canvas: canvasWorker }, [canvasWorker]);

// A 'slowDown' message we can catch in the worker to start heavy work
function slowdownWorker() {
  worker.postMessage("slowDown");
}
        </script>
    </body>

</html>