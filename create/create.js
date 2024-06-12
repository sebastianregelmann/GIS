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
    //localStorage.setItem(name, jsonString);

    //Send the new project to the database
    createEntry(jsonString)
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

    //Get the button that enables the file list
    var showFilesButton = document.getElementById("showFilesButton");

    var nameField = document.getElementById("NameInput");
    nameField.classList.toggle("invisible");


    if (fileWrapper.classList.contains("invisible") == false) {
        //change the text of the button
        showFilesButton.textContent = "Create";

        //Fill the file list
        fillFileList();
    }
    else {
        //change the text of the button
        showFilesButton.textContent = "Load";
    }
}


async function fillFileList() {

    //Get all file names from the database
    var jsonStringNames = await getNames();
    //Convert the response to an json object
    var projects = JSON.parse(jsonStringNames);

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
    console.log(projects);

}

async function deleteFile(id) {
    //Get the name of the file that gets deleted
    var idName = id.replace('deleteButton', '');

    if (confirm("Do you want to delete this File: " + idName)) {
        //localStorage.removeItem(idName);
        await deleteData(idName);
        //update the file list
        fillFileList();
    }
} 

function loadFile(id) {
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










////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////Methods to load from database with backend///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////
//Method that loads all file names in the database
async function getNames() {
    const url = "http://127.0.0.1:3000/getNames";

    const response = await fetch(url)
    const text = await response.text();
    console.log(text);
    return text;
}

////////////////////////////////////////////////////
//Method that creates a new project in the database
async function createEntry(jsonString) {
    //Send message to server to save the string
    const data = jsonString;

    fetch('http://127.0.0.1:3000/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: data
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}


//Method that deletes a entry in the database
async function deleteData(projectName) {
    const url = "http://127.0.0.1:3000/deleteProject?name=" + projectName;

    const response = await fetch(url)
    const text = await response.text();
    console.log(text);
}