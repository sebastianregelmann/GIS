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

        //
        var borderColor = hexToHSL(rgbToHex(colorElement.style.backgroundColor));
        borderColor.l = borderColor.l * 2;
        borderColor = hslToHex(borderColor.h, borderColor.s, borderColor.l);
        colorElement.style.borderColor = borderColor;

        //change the selected color variable
        selectedColor = rgbToHex(colorElement.style.backgroundColor);
    }
}

//Source https://gist.github.com/xenozauros/f6e185c8de2a04cdfecf
function hexToHSL(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    r = parseInt(result[1], 16);
    g = parseInt(result[2], 16);
    b = parseInt(result[3], 16);
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    var HSL = new Object();
    HSL['h'] = h;
    HSL['s'] = s;
    HSL['l'] = l;
    return HSL;
}

//https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

//Converts a rbg string into a hex string Generated with ChatGPT 3.5
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

//Store the drawn values in a 2d Array 
//Generated with ChatGPT 3.5
var pixelArray = Array.from({ length: 16 }, () => Array(16).fill("empty"));

//Variables to check if the mouse is drawing multible pixels at once
var isDrawingLine = false;
var linePixels = Array.from({ length: 16 }, () => Array(16).fill("empty"));

//Varibale that stores the worksteps
var worksteps = [pixelArray.map(row => row.slice())];

//Variable to check if a pixel was placed without moving the mouse
var singlePixelPlaced = false;
var singlePixelColor;
var singlePixelPosition;

//Variable that stores wich color is drawing at the moment
var selectedColor = "";

//Variable to go thorugh the worksteps
var workstepCounter = 0;
//Boolean to check if its the newest workstep
var inOldWorkstep = false;

// Draw Pixel when canvas is clicked
canvas.addEventListener('mousedown', function (event) {

    // Get the mouse position relative to the canvas
    var mousePos = getMousePos(canvas, event);
    //get the pixel size/gridSize
    var pixelSize = getPixelSize()
    mousePos = mouseToGrid(mousePos, pixelSize);

    //Check if pixel is in place
    if (isPixelInPlace(pixelArray, mousePos, selectedColor, pixelSize) == false) {
        //Draw pixel at selected position
        drawPixel(mousePos, pixelSize, selectedColor);

        //Store the pixel information to check if its a line or only a single pixel
        singlePixelPlaced = true;
        singlePixelPosition = mousePos;
        //Store the colorValue
        if (selectedColor == "eraser") {
            singlePixelColor = "empty";
        }
        else {
            singlePixelColor = selectedColor;
        }
    }
});

// Add a mousemove event listener to the canvas to get the mouse position
canvas.addEventListener('mousemove', function (event) {

    // Get the mouse position relative to the canvas
    var mousePos = getMousePos(canvas, event);
    var pixelSize = getPixelSize();
    mousePos = mouseToGrid(mousePos, pixelSize);

    //If mouse is moved and mouse is clicked is drawn
    if (event.buttons === 1) {
        //Set the bool to true to save that a line is drawn
        isDrawingLine = true;
        singlePixelPlaced = false;

        //Still store the single pixel in the line because else it sometimes is not stored correctly
        var arrayPos = pixelPositionToArrayPosition(singlePixelPosition, pixelSize);
        linePixels[arrayPos.x][arrayPos.y] = selectedColor;

        //Check if mouse moved to a pixel that is not in the current line
        if (isPixelInPlace(linePixels, mousePos, selectedColor, pixelSize) == false) {
            drawPixel(mousePos, pixelSize, selectedColor);
            //Store the pixel in the line Array
            arrayPos = pixelPositionToArrayPosition(mousePos, pixelSize);
            linePixels[arrayPos.x][arrayPos.y] = selectedColor;
        }
    }
});

//If mouse is no longer pressed save the changes to the canvas as a workstep
canvas.addEventListener('mouseup', function (event) {
    storeChanges();
});

//If mouse is no longer on the canvas save the changes to the canvas as a workstep
canvas.addEventListener("mouseleave", function (event) {
    if (event.buttons === 1) {
        storeChanges();
    }
});



/*************************************************************************
 * *********Function to store the Worksteps ******************************/
function storeChanges() {
    var pixelSize = getPixelSize();

    //Check if mouse was moving
    if (isDrawingLine) {
        //Check if pixel was placed in old Workstep
        //If not just put the workstep at the end
        if (inOldWorkstep == false) {
            storeLinePixel(pixelSize);
        }
        //if not cut out all the old worksteps and put this one at the end
        else {
            //Removee the new Worksteps that get overwritten
            worksteps.splice(workstepCounter + 1)
            //store the new pixel as new Workstep
            storeLinePixel(pixelSize);
        }
    }

    //Check if a pixel was placed and the mouse was not moving and store this pixel in the PixelArray and the Worksteps
    if (singlePixelPlaced) {
        //Check if pixel was placed in old Workstep
        //If not just put the workstep at the end
        if (inOldWorkstep == false) {
            storeSinglePixel(pixelSize);
        }
        //if not cut out all the old worksteps and put this one at the end
        else {
            //Remoce the new Worksteps that get overwritten
            worksteps.splice(workstepCounter + 1)
            //store the new pixel as new Workstep
            storeSinglePixel(pixelSize);
        }
    }
}


function storeSinglePixel(pixelSize) {
    //Get the arrayPostion of the Single pixel
    var arrayPos = pixelPositionToArrayPosition(singlePixelPosition, pixelSize);
    //Check if single position musst be stored or if empty was erased
    if (singlePixelColor != "eraser" || isColorErased(arrayPos.x, arrayPos.y)) {
        //Store the pixel in the PixelArray
        pixelArray[arrayPos.x][arrayPos.y] = singlePixelColor
        //Creates a deep Copy of Pixelarray *Generated with ChatGPT 3.5
        worksteps.push(pixelArray.map(row => row.slice()));
        //Increase worksteppcounter by one
        workstepCounter++;
    }
    //Uncheck the boolean 
    singlePixelPlaced = false;
}

function storeLinePixel(pixelSize) {
    if (musstLineBeStored()) {
        //Store the linePixels in the pixelarray and push it to the worksteps
        for (var x = 0; x < 16; x++) {
            for (var y = 0; y < 16; y++) {
                if (linePixels[x][y] != "empty") {

                    //Store the erased spaces empty
                    if (linePixels[x][y] == "eraser") {
                        pixelArray[x][y] = "empty";
                    }
                    else {
                        //Store the color
                        pixelArray[x][y] = linePixels[x][y];
                    }
                }
            }
        }
        //push the new workstep
        //Creates a deep Copy of Pixelarray *Generated with ChatGPT 3.5
        worksteps.push(pixelArray.map(row => row.slice()));
        //Increase worksteppcounter by one
        workstepCounter++;
    }
    //Clear the line pixels
    linePixels = Array.from({ length: 16 }, () => Array(16).fill("empty"));


    isDrawingLine = false;
}



/**********************************************************
 * Functions to check if a pixel is already in the place and if there was any color that was erased*/


function isPixelInPlace(pixelArrayToCheck, position, color, gridSize) {
    //Get the postion of the pixel that the mouse is over to the position in the line Array
    var arrayPos = pixelPositionToArrayPosition(position, gridSize);
    //Check if the line was already drawn
    if (pixelArrayToCheck[arrayPos.x][arrayPos.y] == color) {
        console.log("Pixel in place");
        return true;
    }

    return false;
}

//Check if there was color that was erased
function isColorErased(x, y) {
    if (pixelArray[x][y] == "empty") {
        return false;
    }
    return true;
}

//function to check if a line musst be saved as workstep
//if only blank spaces get erased it's no real workstep
function musstLineBeStored() {
    //Check if the line is erasing any color if eraser was selected
    for (var x = 0; x < 16; x++) {
        for (var y = 0; y < 16; y++) {
            if (linePixels[x][y] == "eraser") {
                if (isColorErased(x, y)) {
                    return true;
                }
            }
            if (linePixels[x][y] != "eraser" && linePixels[x][y] != "empty") {
                return true;
            }
        }
    }

    return false;
}

/*******************************************************************************
//Function to draw the pixel*/
function drawPixel(position, pixelSize, color) {
    //Erase from canvas if eraser is selected
    if (color == "eraser" || color == "empty") {
        //Clear the Pixel
        ctx.clearRect(position.x, position.y, pixelSize.width, pixelSize.height);
    }
    //Draw on canvas
    else {
        //Apply the color
        ctx.fillStyle = color;

        //draw rectangle
        ctx.fillRect(position.x, position.y, pixelSize.width, pixelSize.height, color);
    }
}


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
function mouseToGrid(mousePos, gridSize) {
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

/**************************************************** 
 * Convert Pixel Postion to Array Positon and back */


//Converts mouse position in canvas to pixel position in image
function pixelPositionToArrayPosition(position, gridSize) {
    return {
        x: Math.floor(position.x / gridSize.width),
        y: Math.floor(position.y / gridSize.height),
    }
}

//convert pixelArrayPosition to Canvas Position
function arrayPosToPixelPosition(x, y, pixelSize) {
    return {
        x: x * pixelSize.width,
        y: y * pixelSize.height,
    }
}

/*********************************************************/
//function to draw the canvas from the stored values in the PixelArray
function drawFromPixelArray(pixels) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var pixelSize = getPixelSize();

    for (var x = 0; x < 16; x++) {
        for (var y = 0; y < 16; y++) {
            if (pixels[x][y] != "empty") {
                var color = pixels[x][y];
                var position = arrayPosToPixelPosition(x, y, pixelSize)
                drawPixel(position, pixelSize, color);
            }
        }
    }
}

/*********************************************** 
 * Functions to go throught the worksteps*/
// Funktion, die beim Drücken der Leertaste aufgerufen wird
function handleKeyPress(event) {
    if (event.keyCode === 32) { // Überprüfe, ob die gedrückte Taste die Leertaste ist (KeyCode 32)
        drawFromPixelArray(pixelArray);
    }
}

function goBack() {

    if (workstepCounter - 1 >= 0) {
        workstepCounter--;
        //draw the old workstep 
        drawFromPixelArray(worksteps[workstepCounter]);

        //refresh the pixelarray to what is currently shown on screen
        pixelArray = worksteps[workstepCounter].map(row => row.slice())
        //store the information that its not the newest workstep
        inOldWorkstep = true;
    }
}

function goForward() {
    if (workstepCounter < worksteps.length - 1) {
        workstepCounter++;
        //Draw the workstep
        drawFromPixelArray(worksteps[workstepCounter]);

        //refresh the pixelarray to what is currently shown on screen
        pixelArray = worksteps[workstepCounter].map(row => row.slice())

    }

    if (workstepCounter == worksteps - length - 1) {
        inOldWorkstep = false;
    }
}

// Event-Listener hinzufügen, um auf Tastendrücke zu reagieren
document.addEventListener('keydown', handleKeyPress);