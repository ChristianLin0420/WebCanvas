var ToolsSize = 20;
var isFill = true;
var letsdraw = false;
var drawLine = false;
var drawRectangle = false;
var drawCircle = false;
var drawTriangle = false;
var eraser = false;
var writeText = false;
var drawRainbow = false;

// Redo Undo parameters
var cPushArray = new Array();
var cStep = -1;

// Control whehter the element is filled or empty
function ContentMode() {
    isFill = !isFill;

    if (isFill) {
        document.getElementById('fill').style.color =  "#28a5e4";
        document.getElementById('empty').style.color =  "#6f6f6f";
    } else {
        document.getElementById('fill').style.color =  "#6f6f6f";
        document.getElementById('empty').style.color =  "#28a5e4";
    }
}

// Control the size of brush and eraser
function widthControl(value) {
    document.getElementById('BrushRangeValue').innerHTML = value;
    ToolsSize = value;
    console.log(ToolsSize);
}

// Drawing tools functionality
function resetDrawTools() {
    letsdraw = false;
    drawLine = false;
    drawRectangle = false;
    drawCircle = false;
    drawTriangle = false;
    eraser = false;
    writeText = false;
    drawRainbow = false;
}

// Brush function 
function startBrush() {
    resetDrawTools();
    drawLine = true;
}

// Rectangle function 
function startRectangle() {
    resetDrawTools();
    drawRectangle = true;
}

// Circle function 
function startCircle() {
    resetDrawTools();
    drawCircle = true;
}

// Triangle function 
function startTriangle() {
    resetDrawTools();
    drawTriangle = true;
}

// Eraser function 
function startEraser() {
    resetDrawTools();
    eraser = true;
}

// Text function 
function startWriteText() {
    resetDrawTools();
    writeText = true;
}

// Rainbow function
function startRainbow() {
    resetDrawTools();
    drawRainbow = true;
}

// Detect mouse event and draw
$(function() {
    var theCanvas = document.getElementById('myCanvas');
    var ctx = theCanvas.getContext('2d');
    var drag = false;
    theCanvas.width = 800;
    theCanvas.height = 600;

    var canvasOffset = $('#myCanvas').offset();

    var canvasx = $(theCanvas).offset().left;
    var canvasy = $(theCanvas).offset().top;
    var textStartingX = 0;
    var last_mousex = 0;
    var last_mousey = 0;
    var mousex = 0;
    var mousey = 0;

    theCanvas.addEventListener("click", function(e) {
        if (writeText) {
            console.log('clicked');
            last_mousex = e.pageX - theCanvas.offsetLeft;
            last_mousey = e.pageY - theCanvas.offsetTop;
            textStartingX = last_mousex;
            return false;
        }
    }, false);

    document.addEventListener("keydown", function(e) {
        if (writeText) {
            ctx.font = "16px Arial"
            ctx.fillText(e.key, last_mousex, last_mousey);
            last_mousex += ctx.measureText(e.key).width;
        }
    }, false);

    $('#myCanvas').mousemove(function(e) {
        if (drawLine) {
            if (letsdraw === true) {
                ctx.lineTo(e.pageX - canvasOffset.left, e.pageY - canvasOffset.top);
                ctx.stroke();
            }
        } else if (drawRectangle) {
            mousex = parseInt(e.clientX-canvasx);
            mousey = parseInt(e.clientY-canvasy);
            if (drag) {
                ctx.clearRect(0,0,theCanvas.width, theCanvas.height); //clear canvas
                ctx.beginPath();
                var width = mousex-last_mousex;
                var height = mousey-last_mousey;
                ctx.rect(last_mousex,last_mousey,width,height);
                ctx.strokeStyle = 'black';
                ctx.lineWidth = ToolsSize;
                ctx.stroke();

                if (isFill) {
                    ctx.fillStyle = 'black';
                    ctx.fill();
                }
            }
        } else if (drawCircle) {
            mousex = parseInt(e.clientX-canvasx);
            mousey = parseInt(e.clientY-canvasy);
            if (drag) {
                ctx.clearRect(0,0,theCanvas.width, theCanvas.height); //clear canvas
                var radius = Math.abs((mousex-last_mousex) / 2);
                ctx.beginPath();
                ctx.arc((mousex+last_mousex) / 2, (mousey+last_mousey) / 2, radius, 0, 2 * Math.PI)
                ctx.strokeStyle = 'black';
                ctx.lineWidth = ToolsSize;
                ctx.stroke();

                if (isFill) {
                    ctx.fillStyle = 'black';
                    ctx.fill();
                }
            }
        } else if (drawTriangle) {
            mousex = parseInt(e.clientX-canvasx);
            mousey = parseInt(e.clientY-canvasy);
            if (drag) {
                ctx.clearRect(0,0,theCanvas.width, theCanvas.height); 
                var width = mousex-last_mousex;
                var height = mousey-last_mousey;
                ctx.beginPath();
                ctx.moveTo((mousex+last_mousex) / 2, last_mousey);
                ctx.lineTo(last_mousex, last_mousey + height);
                ctx.lineTo(last_mousex + width, last_mousey + height);
                ctx.closePath();
                ctx.strokeStyle = 'black';
                ctx.lineWidth = ToolsSize;
                ctx.stroke();

                if (isFill) {
                    ctx.fillStyle = 'black';
                    ctx.fill();
                }
            }
        } else if (eraser) {
            if (letsdraw === true) {
                ctx.lineTo(e.pageX - canvasOffset.left, e.pageY - canvasOffset.top);
                ctx.stroke();
            }
        } 
    });

    $('#myCanvas').mousedown(function(e) {
        if (drawLine) {
            letsdraw = true;
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = ToolsSize;
            ctx.beginPath();
            ctx.moveTo(e.pageX - canvasOffset.left, e.pageY - canvasOffset.top);
        } else if (drawRectangle) {
            last_mousex = parseInt(e.clientX-canvasx);
            last_mousey = parseInt(e.clientY-canvasy);
            drag = true;
        } else if (drawCircle) {
            last_mousex = parseInt(e.clientX-canvasx);
            last_mousey = parseInt(e.clientY-canvasy);
            drag = true;
        } else if (drawTriangle) {
            last_mousex = parseInt(e.clientX-canvasx);
            last_mousey = parseInt(e.clientY-canvasy);
            drag = true;
        } else if (eraser) {
            letsdraw = true;
            ctx.strokeStyle = '#e7f2fc';
            ctx.lineWidth = ToolsSize;
            ctx.beginPath();
            ctx.moveTo(e.pageX - canvasOffset.left, e.pageY - canvasOffset.top);
        } 
    });

    $('#myCanvas').mouseup(function() {
        textStartingX = 0;
        last_mousex = 0;
        last_mousey = 0;
        mousex = 0;
        mousey = 0;
        letsdraw = false;
        drag = false;

        // Push new img in record array
        if (cStep < cPushArray.length) { 
            console.log("add ctx");
            cPushArray.length = cStep + 1; 
        }
        cPushArray.push(theCanvas.toDataURL("image/png"));
        cStep++;
        console.log(cStep);
        console.log(cPushArray.length);
    });
});

// Clean Canvas
function cleanCanvas() {
    var theCanvas = document.getElementById('myCanvas');
    var ctx = theCanvas.getContext('2d');
    ctx.clearRect(0,0,theCanvas.width, theCanvas.height); //clear canvas
}

// Call Undo
function undo() {
    if (cStep >= 0) {
        console.log('undo');
        var theCanvas = document.getElementById('myCanvas');
        var ctx = theCanvas.getContext('2d');
        cStep--;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        ctx.drawImage(canvasPic, 0, 0);
    }
}

// Call Redo
function redo() {
    if (cStep < cPushArray.length-1) {
        console.log('redo');
        var theCanvas = document.getElementById('myCanvas');
        var ctx = theCanvas.getContext('2d');
        cStep++;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
    }
}