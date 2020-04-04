var ToolsSize = 50;
var isFill = true;

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

