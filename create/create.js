function meineFunktion() {
    alert('Hallo, Welt!');
}

//pre defiend colors for the color palette 
var colorPalette = {
    //First row
    color_1: "#000000",            // black
    color_2: "#848484",      //dark grey
    color_3: "#A8A8A8",      //light grey
    color_4: "#FFFFFF",      // white
    //second row
    color_5: "#FF0000",
    color_6: "#FF8000",
    color_7: "#FFFF00",
    color_8: "#80FF00",
    //third row
    color_9: "#00FF00",
    color_10: "#00FF80",
    color_11: "#00FFFF",
    color_12: "#0080FF",
    //forth row
    color_13: "#0000FF",
    color_14: "#8000FF",
    color_15: "#FF00FF",
    color_16: "#FF0080",
};

function setColorPalette() {
    //loop over every color in the colorPalette
    for (let colorId in colorPalette) {
        //Check if color is defiend
        if (colorPalette.hasOwnProperty(colorId)) {
            //Get the colorPicker by the id
            const colorPicker = document.getElementById(colorId);
            //Get the defiend color and set it as color
            colorPicker.value = colorPalette[colorId];
        }
    }
}

//When site is loaded
document.addEventListener('DOMContentLoaded', function () {
    // set the color of the colorpicker
    setColorPalette();
});

function colorChange(colorId) {
    //change the color in the variable that stores the colors
    colorPalette[colorId.id] = colorId.value;
}

function createSite() {
    //Check if projekt has a name
    if (document.getElementById("NameInput").value == "") {
        alert("No Projekt Name");
        return;
    }
    //Store th color in lokal storage
    saveColorsToLocalStorage();
    saveNameToLocalStorage();
    window.location.href = '../main/main.html';
}

function saveColorsToLocalStorage() {
    //loop over all ids 
    for (let colorId in colorPalette) {
        localStorage.setItem(colorId.toString(), colorPalette[colorId]);
    }
}

function saveNameToLocalStorage() {
    var nameInput = document.getElementById("NameInput");
    var name = nameInput.value;
    localStorage.setItem("name", nameInput.value);
}