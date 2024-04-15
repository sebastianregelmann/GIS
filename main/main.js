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
        singlePixelColor = selectedColor;
        singlePixelPosition = mousePos;
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
        linePixels[arrayPos.x][arrayPos.y] = singlePixelColor;

        //Check if mouse moved to a pixel that is not in the current line
        if (isPixelInPlace(linePixels, mousePos, selectedColor, pixelSize) == false) {
            drawPixel(mousePos, pixelSize, selectedColor);
            //Store the pixel in the line Array
            arrayPos = pixelPositionToArrayPosition(mousePos, pixelSize);
            linePixels[arrayPos.x][arrayPos.y] = selectedColor;
        }
    }
});

canvas.addEventListener('mouseup', function (event) {

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
            //Remoce the new Worksteps that get overwritten
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

    //Increase worksteppcounter by one
    workstepCounter++;
});

/****************************
 * Function to store the Worksteps */

function storeSinglePixel(pixelSize) {
    //Get the arrayPostion of the Single pixel
    var arrayPos = pixelPositionToArrayPosition(singlePixelPosition, pixelSize);
    //Store the pixel in the PixelArray
    pixelArray[arrayPos.x][arrayPos.y] = singlePixelColor
    //Creates a deep Copy of Pixelarray *Generated with ChatGPT 3.5
    worksteps.push(pixelArray.map(row => row.slice()));
    //Uncheck the boolean 
    singlePixelPlaced = false;
}

function storeLinePixel(pixelSize) {
    //Store the linePixels in the pixelarray and push it to the worksteps
    for (var x = 0; x < 16; x++) {
        for (var y = 0; y < 16; y++) {
            if (linePixels[x][y] != "empty") {
                pixelArray[x][y] = linePixels[x][y];
            }
        }
    }

    //Clear the line pixels
    linePixels = Array.from({ length: 16 }, () => Array(16).fill("empty"));
    //push the new workstep
    //Creates a deep Copy of Pixelarray *Generated with ChatGPT 3.5
    worksteps.push(pixelArray.map(row => row.slice()));

    isDrawingLine = false;
}



/**********************************************************
 * Functions to check if a pixel is already in the place */

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

//Function to draw the pixel
function drawPixel(position, pixelSize, color) {
    //Erase from canvas if eraser is selected
    if (color == "eraser") {
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

function storePixelInArray(position, color, gridSize) {
    var arrayPos = pixelPositionToArrayPosition(position, gridSize);
    pixelArray[arrayPos.x][arrayPos.y] = color;
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

//convert pixelArrayPosition to Canvas Position
function arrayPosToPixelPosition(x, y, pixelSize) {
    return {
        x: x * pixelSize.width,
        y: y * pixelSize.height,
    }
}

var selectedColor = "";

/*********************************************** 
 * Functions to go throught the worksteps*/
//Variable to go thorugh the worksteps
var workstepCounter = 0;
//Boolean to check if its the newest workstep
var inOldWorkstep = false;

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