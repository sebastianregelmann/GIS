//pre defiend colors for the color palette 
var colorPalette = {
    //First row
    color_1: "#000000",      // black
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
    var nameInput = document.getElementById("NameInput");
    var name = nameInput.value;
    //Check if projekt has a name
    if (name == "") {
        alert("No Projekt Name");
        return;
    }
    if (localStorage.getItem(name) !== null) {
        alert("File already exists");
        return;
    }

    //save a new project to local storage
    var objectToSave = new ProjectWrapper(name, colorPalette, null)

    const jsonString = JSON.stringify(objectToSave);

    // Save the JSON string to local storage
    localStorage.setItem(name, jsonString);

    // Save the name on to load the working project
    localStorage.setItem("FileNameToWorkWith", name);

    //Change the site
    window.location.href = '../main/main.html';
}


function showFiles() {
    //Make the colorWrapper invisible or Visible
    var colorWrapper = document.getElementById("colorWrapper");
    colorWrapper.classList.toggle("invisible");

    //Make the create Button invisible or visible
    var createButton = document.getElementById("createButton");
    createButton.classList.toggle("invisible");

    //Make the file List invisible or visible
    var fileWrapper = document.getElementById("fileWrapper");
    fileWrapper.classList.toggle("invisible");

    if (fileWrapper.classList.contains("invisible") == false) {
        fillFileList();
    }
}


function fillFileList() {
    // Get all keys stored in the local storage
    var keys = Object.keys(localStorage);

    // Loop through the keys and retrieve the name of all the projects
    var projects = [];
    keys.forEach(function (key) {

        if (key != "FileNameToWorkWith") {
            //Get the name of the projcet
            var name = JSON.parse(localStorage.getItem(key)).name;

            projects.push(name);
        }

    });

    //Clear the file list
    while (document.getElementById("fileWrapper").firstChild) {
        document.getElementById("fileWrapper").removeChild(document.getElementById("fileWrapper").firstChild);
    }

    for (var i = 0; i < projects.length; i++) {
        // Create a new div element
        var newDiv = document.createElement("div");

        // Set the id
        newDiv.id = projects[i];
        //Set the 
        newDiv.textContent = projects[i];
        newDiv.classList.add("file");
        // Event listener for the div
        newDiv.addEventListener('click', function () {
            // When the div is clicked, call loadProjectFromLocalStorage with the id
            loadFile(this.id);
        });

        var deleteButton = document.createElement("div");
        var buttonId = projects[i] + "deleteButton";
        deleteButton.id = buttonId;
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("deleteButton");

        deleteButton.addEventListener('click', function () {
            // When the div is clicked, call loadProjectFromLocalStorage with the id
            deleteFile(this.id);
        });

        var fileContainer = document.createElement("div");
        fileContainer.classList.add("fileContainer");
        fileContainer.appendChild(newDiv);
        fileContainer.appendChild(deleteButton);
        // Append the new div to the parent div
        document.getElementById("fileWrapper").appendChild(fileContainer);
    }
}

function deleteFile(id) {
    var idName = id.replace('deleteButton', '');
    if (confirm("Do you want to delete this File: " + idName)) {
        localStorage.removeItem(idName);
        fillFileList();
    }
}

function loadFile(id)
{
    projectNameToWorkWith = id;
    localStorage.setItem("FileNameToWorkWith", projectNameToWorkWith);
    //Change the site
    window.location.href = '../main/main.html';
}

class ProjectWrapper {
    constructor(name, colors, worksteps) {
        this.name = name;
        this.colors = colors;
        this.worksteps = worksteps;
    }
}