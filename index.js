var ToolsSize = 10;
var isFill = true;
var letsdraw = false;
var drawLine = false;
var drawRectangle = false;
var drawCircle = false;
var drawTriangle = false;
var eraser = false;
var writeText = false;
var drawRainbow = false;
var mouseXoffset = 25;
var mouseYoffset = 5;

// Color Picker
var currentColor = "#000000"

// Current Layer
var currentLayer;

requirejs(['jsFiles/colorjoe'], function(colorjoe) {
    var val = document.getElementById('rgbValue');

    colorjoe.rgb('rgbPicker').on('change', function(c) {
        console.log(c.css());
        currentColor = c.css();
        val.innerHTML = c.css();
    });
});

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

var theCanvas = document.getElementById('myCanvas');
var ctx = theCanvas.getContext('2d');

// Brush function 
function startBrush() {
    resetDrawTools();
    drawLine = true;
    theCanvas.style.cursor = "url('CursorImages/brush.png') 42 51, auto";
}

// Rectangle function 
function startRectangle() {
    resetDrawTools();
    drawRectangle = true;
    theCanvas.style.cursor = "url('CursorImages/brushRectangle.png') 42 51, auto";
}

// Circle function 
function startCircle() {
    resetDrawTools();
    drawCircle = true;
    theCanvas.style.cursor = "url('CursorImages/brushCircle.png') 42 51, auto";
}

// Triangle function 
function startTriangle() {
    resetDrawTools();
    drawTriangle = true;
    theCanvas.style.cursor = "url('CursorImages/brushTriangle.png') 42 51, auto";
}

// Eraser function 
function startEraser() {
    resetDrawTools();
    eraser = true;
    theCanvas.style.cursor = "url('CursorImages/eraser.png') 42 51, auto";
}

// Text function 
function startWriteText() {
    resetDrawTools();
    writeText = true;
    theCanvas.style.cursor = "url('CursorImages/text.png') 42 51, auto";
}

// Rainbow function
function startRainbow() {
    resetDrawTools();
    drawRainbow = true;
    theCanvas.style.cursor = "url('CursorImages/rainbow.png') 42 51, auto";
}

// Detect mouse event and draw
$(function() {
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

    var undoBtn = document.getElementById('undo');
    var redoBtn = document.getElementById('redo');

    var currentBackground;

    var history = {
        redo_list: [],
        undo_list: [], 
        saveState: function(canvas, list, keep_redo) {
            keep_redo = keep_redo || false;
            if(!keep_redo) {
                this.redo_list = [];
            }
            currentBackground = canvas.toDataURL();
            (list || this.undo_list).push(canvas.toDataURL());   
        },
        undo: function(canvas, ctx) {
            this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
        },
        redo: function(canvas, ctx) {
            this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
        },
        restoreState: function(canvas, ctx,  pop, push) {
            console.log(pop.length);
            if(pop.length) {
                this.saveState(canvas, push, true);
                var restore_state = pop.pop();

                var img = document.createElement('img');
                img.src = restore_state;

                console.log(img);

                img.onload = function() {
                    ctx.clearRect(0, 0, 800, 600);
                    console.log('redraw');
                    ctx.drawImage(img, 0, 0, 800, 600, 0, 0, 800, 600);  
                }
            }
        }
    }

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
                console.log(theCanvas.style.cursor);
                ctx.lineTo(e.pageX - canvasOffset.left - mouseXoffset, e.pageY - canvasOffset.top - mouseYoffset);
                ctx.stroke();
            }
        } else if (drawRectangle) {
            mousex = parseInt(e.clientX-canvasx-mouseXoffset);
            mousey = parseInt(e.clientY-canvasy-mouseYoffset);
            if (drag) {
                ctx.putImageData(currentLayer, 0, 0);
                ctx.beginPath();

                var width = mousex-last_mousex;
                var height = mousey-last_mousey;
                
                ctx.rect(last_mousex,last_mousey,width,height);
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = ToolsSize;
                ctx.stroke();

                if (isFill) {
                    ctx.fillStyle = currentColor;
                    ctx.fill();
                }
            }
        } else if (drawCircle) {
            mousex = parseInt(e.clientX-canvasx-mouseXoffset);
            mousey = parseInt(e.clientY-canvasy-mouseYoffset);
            if (drag) {
                ctx.putImageData(currentLayer, 0, 0);
                var radius = Math.abs((mousex-last_mousex) / 2);
                ctx.beginPath();
                ctx.arc((mousex+last_mousex) / 2, (mousey+last_mousey) / 2, radius, 0, 2 * Math.PI)
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = ToolsSize;
                ctx.stroke();

                if (isFill) {
                    ctx.fillStyle = currentColor;
                    ctx.fill();
                }
            }
        } else if (drawTriangle) {
            mousex = parseInt(e.clientX-canvasx-mouseXoffset);
            mousey = parseInt(e.clientY-canvasy-mouseYoffset);
            if (drag) {
                ctx.putImageData(currentLayer, 0, 0); 
                var width = mousex-last_mousex;
                var height = mousey-last_mousey;
                ctx.beginPath();
                ctx.moveTo((mousex+last_mousex) / 2 , last_mousey);
                ctx.lineTo(last_mousex, last_mousey + height);
                ctx.lineTo(last_mousex + width, last_mousey + height);
                ctx.closePath();
                ctx.strokeStyle = currentColor;
                ctx.lineWidth = ToolsSize;
                ctx.stroke();

                if (isFill) {
                    ctx.fillStyle = currentColor;
                    ctx.fill();
                }
            }
        } else if (eraser) {
            if (letsdraw === true) {
                ctx.lineTo(e.pageX - canvasOffset.left - mouseXoffset, e.pageY - canvasOffset.top - mouseYoffset);
                ctx.stroke();
            }
        } else if (drawRainbow) {
            if (letsdraw === true) {
                const randomNumber = getRandom();
                ctx.strokeStyle = randomNumber;
                ctx.lineTo(e.pageX - canvasOffset.left, e.pageY - canvasOffset.top);
                ctx.stroke();
            }
        }
    });

    $('#myCanvas').mousedown(function(e) {
        currentLayer = ctx.getImageData(0, 0, theCanvas.width, theCanvas.height);
        if (drawLine || eraser) {
            letsdraw = true;
            ctx.strokeStyle = (drawLine) ? currentColor : '#e7f2fc';
            ctx.lineWidth = ToolsSize;
            ctx.beginPath();
            ctx.moveTo(e.pageX - canvasOffset.left - mouseXoffset, e.pageY - canvasOffset.top - mouseYoffset);
        } else if (drawRectangle || drawCircle || drawTriangle) {
            last_mousex = parseInt(e.clientX-canvasx-mouseXoffset);
            last_mousey = parseInt(e.clientY-canvasy-mouseYoffset);
            drag = true;
        } else if (drawRainbow) {
            letsdraw = true;
 
            ctx.lineWidth = ToolsSize;
            ctx.beginPath();
            ctx.moveTo(e.pageX - canvasOffset.left, e.pageY - canvasOffset.top);
        }

        history.saveState(theCanvas);
    });

    $('#myCanvas').mouseup(function() {
        textStartingX = 0;
        last_mousex = 0;
        last_mousey = 0;
        mousex = 0;
        mousey = 0;
        letsdraw = false;
        drag = false;
    });

    undoBtn.addEventListener('click', function() {
        console.log('undo');
        history.undo(theCanvas, ctx);
    });

    redoBtn.addEventListener('click', function() {
        console.log('redo');
        history.redo(theCanvas, ctx);
    });

    // Upload Image
    $('#uploadIMG').change(function () {
        var img = new Image();
        
        img.onload = function () {
            ctx.drawImage(this, 0, 0, theCanvas.width, theCanvas.height)
            URL.revokeObjectURL(src)
        }
        
        var file = this.files[0];
        var src = URL.createObjectURL(file);
        
        img.src = src;

        history.saveState(theCanvas);
    });

    // Clean Canvas
    $('#clean').click(function() {
        history.saveState(theCanvas);
        ctx.fillStyle = '#e7f2fc';
        ctx.fillRect(0, 0, theCanvas.width, theCanvas.height);
    });
});

// Save Image
function save(e) {
    var newCanvas = document.getElementById("myCanvas");
    var image = newCanvas.toDataURL("image/jpg");
    e.href = image;
}

// get random number from 0~15
function getRandom(){
    var newColor = '#';

    for(var i = 0; i < 6; i++) {
        const random = Math.floor(Math.random()*15);
        newColor += random.toString(16);
    }
    
    return newColor;
};