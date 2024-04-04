//When site is loaded
document.addEventListener('DOMContentLoaded', function () {
    // set the colors
    setColorPalette();
});

function setColorPalette() {
    for (let i = 1; i < 17; i++) {
        var colorId = "color_" + i.toString();
        var colorButton = document.getElementById(colorId);
        let color = localStorage.getItem(colorId);
        colorButton.style.backgroundColor = color;
    }
}

function colorSelected(colorId) {

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

    //get the selected button
    var colorElement = document.getElementById(colorId.id);
    //remove the class from the list
    colorElement.classList.remove("color-unselcted");
    //add the unselcted class
    colorElement.classList.add("color-selected");

    //Change the variable for the selcted color
    selectedColor = localStorage.getItem(colorId.id);
}


var selectedColor = "";