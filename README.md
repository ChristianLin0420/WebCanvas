# Software Studio 2020 Spring
## Assignment 01 Web Canvas 
107062240 林柏均
###### tags: `Javascript, Html5, CSS3, Canvas`

### Scoring

| **Basic components**                             | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Basic control tools                              | 30%       | Y         |
| Text input                                       | 10%       | Y         |
| Cursor icon                                      | 10%       | Y         |
| Refresh button                                   | 10%       | Y         |

| **Advanced tools**                               | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Different brush shapes                           | 15%       | Y         |
| Un/Re-do button                                  | 10%       | Y         |
| Image tool                                       | 5%        | Y         |
| Download                                         | 5%        | Y         |

| **Other useful widgets**                         | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Fill or Empty                                  | 1~5%     | N         |


---

### How to use 
![](https://i.imgur.com/jB4KonA.png)

| **Button Fuctionality**         | **Icon**                            |
| :-------------------------------| :---------------------------------: |
| Brush                           | ![](https://i.imgur.com/ugZnq4Q.png)|
| Earser                          | ![](https://i.imgur.com/SupEbI2.png)|
| Text                            | ![](https://i.imgur.com/zpIoetZ.png)|
| Rectangle                       | ![](https://i.imgur.com/1ZpiTSH.png)| 
| Circle                          | ![](https://i.imgur.com/7Omfolu.png)| 
| Triangle                        | ![](https://i.imgur.com/4Ehndwa.png)| 
| RainBowBrush                    | ![](https://i.imgur.com/xp30MpA.png)| 
| Switch for shape content mode   | ![](https://i.imgur.com/JSPLiAp.png)| 
| Slider for tools' size          | ![](https://i.imgur.com/cxvMidm.png)| 
| Trash                           | ![](https://i.imgur.com/GDmHf7S.png)| 

| **Button Fuctionality**         | **Icon**                            |
| :-------------------------------| :---------------------------------: |
| Dowload                         | ![](https://i.imgur.com/6uzgw98.png)|
| Upload Image                    | ![](https://i.imgur.com/IAIPtOK.png)|
| Undo                            | ![](https://i.imgur.com/nRhIL5I.png)|
| Redo                            | ![](https://i.imgur.com/7vKC7JU.png)| 


### Function description
#### Canvas Event Listening
    $('#myCanvas').mousedown(function(e)
    $('#myCanvas').mousemove(function(e)
    $('#myCanvas').mouseup(function(e)
Using above three listener to detect the mouse event. When user select a drawing tool, the corresponding boolean variables will be set as ==True==! By the way, changed the cursor corresponding image!

     var drawLine = false;         
     var drawRectangle = false;
     var drawCircle = false;
     var drawTriangle = false;
     var eraser = false;
     var writeText = false;
     var drawRainbow = false;

#### History
In order to record the drawing history, I set a varialbe called history, there are four main functions to manipulate the record :

1. ==saveState==:
    This function is to save the current state of the canvas.
```javascript=16
saveState: function(canvas, list, keep_redo) {
    keep_redo = keep_redo || false;
    if(!keep_redo) {   
        this.redo_list = [];
    }
    
    currentBackground = canvas.toDataURL();
    (list || this.undo_list).push(canvas.toDataURL());   
}
```

2. ==Undo==:
    This function is call restoreState function to pop up former record and set this as current canvas background image.
```javascript=16
undo: function(canvas, ctx) {
    this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
}
```

3. ==Redo==:
    This function is call restoreState function to pop up latter record and set this as current canvas background image.
```javascript=16
redo: function(canvas, ctx) {
            this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
        } 
}
```

4. ==restoreState==:
    This function will update new background image of canvas according to the input parameters ==pop== and ==push==!
```javascript=16
restoreState: function(canvas, ctx,  pop, push) {
    if(pop.length) {
        this.saveState(canvas, push, true);
        var restore_state = pop.pop();

        var img = document.createElement('img');
        img.src = restore_state;

        img.onload = function() {
            ctx.clearRect(0, 0, 800, 600);
            ctx.drawImage(img, 0, 0, 800, 600, 0, 0, 800, 600);  
        }
    }
}
```

#### Drawing functions
##### Brush, Eraser
```javascript=16
ctx.lineWidth = ToolsSize;
ctx.beginPath();
ctx.moveTo(e.pageX - canvasOffset.left, e.pageY - canvasOffset.top);  // Start point

ctx.lineTo(e.pageX - canvasOffset.left - mouseXoffset, e.pageY - canvasOffset.top - mouseYoffset); // While moving, according to previous point and current position to draw a stroke.
ctx.stroke();
```

#### Rectangle, Triangle, Circle
```javascript=16
// Record starting mousedown position and set drag parameter as true so that mousemove can normally execute
last_mousex = parseInt(e.clientX-canvasx-mouseXoffset);
last_mousey = parseInt(e.clientY-canvasy-mouseYoffset);
drag = true;

// Rectangle, Triangle
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

// Circle
ctx.putImageData(currentLayer, 0, 0);
var radius = Math.abs((mousex-last_mousex) / 2);
ctx.beginPath();
ctx.arc((mousex+last_mousex) / 2, (mousey+last_mousey) / 2, radius, 0, 2 * Math.PI)
ctx.strokeStyle = currentColor;
ctx.lineWidth = ToolsSize;
ctx.stroke();

// Switch to control whether these shape's content is filled or empty
if (isFill) {
    ctx.fillStyle = currentColor;
    ctx.fill();
}
```

#### Upload, Download
```javascript=16
// Upload function
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

// Download function
function save(e) {
    var newCanvas = document.getElementById("myCanvas");
    var image = newCanvas.toDataURL("image/jpg");
    e.href = image;
}
```

### Gitlab page link
[MyCanvas](https://107062240.gitlab.io/AS_01_WebCanvas)

<style>
table th{
    width: 100%;
}
</style>
