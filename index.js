var ToolsSize = 50;
var isFill = true;
var letsdraw = false;
var drawLine = false;
var drawRectangle = false;
var drawCircle = false;
var drawTriangle = false;
var eraser = false;
var writeText = false;
var drawRainbow = false;

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
    console.log("start drawing rectangle!");
}

// Circle function 
function startCircle() {
    resetDrawTools();
}

// Triangle function 
function startTriangle() {
    resetDrawTools();
}

// Eraser function 
function startEraser() {
    resetDrawTools();
}

// Text function 
function startWriteText() {
    resetDrawTools();
}

// Rainbow function
function startRainbow() {
    resetDrawTools();
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
    var last_mousex = 0;
    var last_mousey = 0;
    var mousex = 0;
    var mousey = 0;

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
                console.log("moving");
                ctx.clearRect(0,0,theCanvas.width, theCanvas.height); //clear canvas
                ctx.beginPath();
                var width = mousex-last_mousex;
                var height = mousey-last_mousey;
                ctx.rect(last_mousex,last_mousey,width,height);
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 10;
                ctx.stroke();
            }
        } else if (drawCircle) {

        } else if (drawTriangle) {

        } else if (eraser) {

        } else if (writeText) {

        }
    });

    $('#myCanvas').mousedown(function(e) {
        if (drawLine) {
            letsdraw = true;
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(e.pageX - canvasOffset.left, e.pageY - canvasOffset.top);
        } else if (drawRectangle) {
            last_mousex = parseInt(e.clientX-canvasx);
            last_mousey = parseInt(e.clientY-canvasy);
            drag = true;
        } else if (drawCircle) {

        } else if (drawTriangle) {

        } else if (eraser) {

        } else if (writeText) {

        }
    });

    $(window).mouseup(function() {
        letsdraw = false;
        drag = false;
    });
});

