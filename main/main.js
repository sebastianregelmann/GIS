//When site is loaded
document.addEventListener('DOMContentLoaded', function () {
    // set the colors
    setColorPalette();
});

window.addEventListener("resize", resizedWindow());

//Sets the color palette colors 
function setColorPalette() {
    for (let i = 1; i < 17; i++) {
        var colorId = "color_" + i.toString();
        var colorButton = document.getElementById(colorId);
        let color = localStorage.getItem(colorId);
        colorButton.style.backgroundColor = color;
    }
}


//manages the selected color
function colorSelected(colorId) {

    var eraser = document.getElementById("eraser");

    //Deselct all colors
    for (let i = 1; i < 17; i++) {
        var colorElement = document.getElementById("color_" + i.toString());
        //Check if color was previusly selected
        if (colorElement.classList.contains("color-selected") == true) {
            //remove the class from the list
            colorElement.classList.remove("color-selected");
            //add the unselcted class
            colorElement.classList.add("color-unselcted");
        }
    }

    //Check if the eraser is getting selected 
    if (colorId == "eraser") {
        //Select the eraser 
        //remove the class from the list
        eraser.classList.remove("eraser");
        //add the unselcted class
        eraser.classList.add("eraser-selected");

        //Change the selected color
        selectedColor = "eraser";
    }
    else {
        //if a color is getting selected
        //Check if eraser was selected
        if (eraser.classList.contains("eraser-selected")) {
            //deselect the eraser 
            //remove the class from the list
            eraser.classList.remove("eraser-selected");
            //add the unselcted class
            eraser.classList.add("eraser");
        }

        //select the color
        //get the selected button
        var colorElement = document.getElementById(colorId.id);
        //remove the class from the list
        colorElement.classList.remove("color-unselcted");
        //add the unselcted class
        colorElement.classList.add("color-selected");

        //change the selected color variable
        selectedColor = rgbToHex(colorElement.style.backgroundColor);
    }
}

//Converts a rbg string into a hex string
function rgbToHex(col) {
    if (col.charAt(0) == 'r') {
        col = col.replace('rgb(', '').replace(')', '').split(',');
        var r = parseInt(col[0], 10).toString(16);
        var g = parseInt(col[1], 10).toString(16);
        var b = parseInt(col[2], 10).toString(16);
        r = r.length == 1 ? '0' + r : r; g = g.length == 1 ? '0' + g : g; b = b.length == 1 ? '0' + b : b;
        var colHex = '#' + r + g + b;
        return colHex;
    }
}

function resizedWindow() {
    var size;
    //get how big the center column can be
    if (isHeightSmaller()) {
        size = window.innerHeight;
    }
    else {
        size = window.innerWidth;
    }

    //Scale the inner column
    var center = document.getElementById("center");
    center.style.width = (size * 0.8).toString() + "px";
    center.style.height = (size * 0.8).toString() + "px";

    var cornerLeft = document.getElementById("left");
    cornerLeft.style.width = (size * 0.2).toString() + "px";
    cornerLeft.style.height = (size * 0.8).toString() + "px";

    var cornerRight = document.getElementById("right");
    cornerRight.style.width = (size * 0.2).toString() + "px";
    cornerRight.style.height = (size * 0.8).toString() + "px";
}



function isHeightSmaller() {
    if (window.innerWidth - 200 > window.innerHeight) {
        return true;
    }
    return false;
}
/*************************************************************************
 **********Drawing in canvas functions************************************
 *************************************************************************/

// Get the canvas element
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var mousePos;

function clickCanvas() {
    //draw rectangle

    //get the pixel size
    var pixelSize = getPixelSize()

    //Erase from canvas if eraser is selected
    if (selectedColor == "eraser") {
        //Clear the Pixel
        ctx.clearRect(mousePos.x, mousePos.y, pixelSize.width, pixelSize.height, selectedColor);
    }
    //Draw on canvas
    else {
        //Apply the color
        ctx.fillStyle = selectedColor;

        //draw rectangle
        ctx.fillRect(mousePos.x, mousePos.y, pixelSize.width, pixelSize.height, selectedColor);
        //Store the pixel in the PixelArray
        storePixelInArray(mousePos, selectedColor);
    }
}

// Add a mousemove event listener to the canvas to get the mouse position
canvas.addEventListener('mousemove', function (event) {

    // Get the mouse position relative to the canvas
    mousePos = getMousePos(canvas, event);
    mousePos = mouseToGrid(mousePos);
});

//Function to get the mouseposition relative to the canvas 
//Function from Stackoverflow https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(); // abs. size of element
    scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

//convert mouse Position to a grid point
function mouseToGrid(mousePos) {
    var gridSize = getPixelSize();
    //Converts the position to the top left corner of the grid
    var gridposX = Math.floor(mousePos.x / gridSize.width) * gridSize.width;
    var gridposY = Math.floor(mousePos.y / gridSize.height) * gridSize.height;
    return {
        x: gridposX,
        y: gridposY,
    }
}
//Scale the pixel relative to the canvas size
function getPixelSize() {
    var rect = canvas.getBoundingClientRect();

    scaleX = canvas.width / rect.width;
    scaleY = canvas.height / rect.height;
    return {
        width: Math.round(rect.width / 16 * scaleX),
        height: Math.round(rect.height / 16 * scaleY)
    }
}

/**************************************************** */
//Store the drawn values in a 2d Array 
//Generated with ChatGPT 3.5
var pixelArray = Array.from({ length: 16 }, () => Array(16).fill("empty"));

//Converts mouse position in canvas to pixel position in image
function pixelPositionToArrayPosition(position) {
    var gridSize = getPixelSize();
    return {
        x: Math.floor(position.x / gridSize.width),
        y: Math.floor(position.y / gridSize.height),
    }
}

function storePixelInArray(position, color) {
    var arrayPos = pixelPositionToArrayPosition(position);
    pixelArray[arrayPos.x][arrayPos.y] = color;
}


var selectedColor = "";