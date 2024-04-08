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

function drawPixel(pixel_Id) {
    var pixel = document.getElementById(pixel_Id);
    pixel.style.backgroundColor = selectedColor;
}

function clickCanvas() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = selectedColor;
    ctx.fillRect(10, 10, 150, 100);
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
    if (window.innerWidth > window.innerHeight) {
        return true;
    }
    return false;
}




var selectedColor = "";