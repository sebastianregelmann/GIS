const http = require('http');
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const fs = require('fs');


const dbPath = "C:\\Users\\sebas\\Desktop\\GIS\\GIS\\server\\database.db"

const hostname = '127.0.0.1'; // localhost
const port = 3000;

const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allows all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allows specific methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allows specific headers

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  ///////////////////////////////////////////////////////////////////////////////
  //POST method to create new file in database
  if (req.method === 'POST' && req.url === '/create') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('Received POST data:', body);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`Data received: ${body}`);
      insertNewProjectInDatabase(body);
    });
  }

  ///////////////////////////////////////////////////////////////////////////////
  //POST method to update file in database
  if (req.method === 'POST' && req.url.startsWith('/updateProject')) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('Received POST data:', body);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end("Data received:");

      // Get name of the project with the url parameter
      const urlString = "http://" + hostname + req.url;
      const urlObj = new URL(urlString);
      const params = urlObj.searchParams;
      const projectName = params.get("name");

      updateProjectInDataBase(projectName, body);
    });
  }

  ///////////////////////////////////////////////////////////////////////////////
  //GET method to delete file in database
  if (req.method === 'GET' && req.url.startsWith('/deleteProject')) {

    // Get name of the project with the url parameter
    const urlString = "http://" + hostname + req.url;
    const urlObj = new URL(urlString);
    const params = urlObj.searchParams;
    const projectName = params.get("name");

    //delete the project from the dataBase
    await deleteDataFromDataBase(projectName);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(projectName + " was deleted");
  }

  ///////////////////////////////////////////////////////////////////////////////
  //GET request to get the data from of project from dataBase
  if (req.method === 'GET' && req.url.startsWith('/getProject')) {

    // Get name of the project with the url parameter
    const urlString = "http://" + hostname + req.url;
    const urlObj = new URL(urlString);
    const params = urlObj.searchParams;
    const projectName = params.get("name");

    //get the jsonstring from tha database
    const returnString = await loadDataFromDataBase(projectName);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(returnString);
  }

  ///////////////////////////////////////////////////////////////////////////////
  //GET request to get all names of projects in database
  if (req.method === 'GET' && req.url.startsWith('/getNames')) {

    //get the jsonstring from tha database
    const returnString = await getProjectNamesFromDataBase();

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(returnString);
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


///////////////////////////////////////////////////////////////////////////////
////////////Method that interact with the database/////////////////////////////
///////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////
//Function to insert a new Project into the database
async function insertNewProjectInDatabase(projectString) {

  //get an object from the string
  const object = JSON.parse(projectString);
  const project = new ProjectWrapper(object.name, object.colors, object.worksteps);

  // open the database
  const db = await sqlite.open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  // Insert a new row into the database
  db.run(`INSERT INTO projects (name, jsonString) VALUES (?, ?)`,
    [project.name.toString(), projectString.toString()],
    function (err) {
      //Get error if something went wrong  
      if (err) {
        return console.error(err.message);
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

  //Close database
  await db.close();
}

//////////////////////////////////////////////////////////////////////////////////
//Function to get the json string from the database with a the name of the project
async function loadDataFromDataBase(projectName) {
  // open the database
  const db = await sqlite.open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  // Select a single entry from a row where the entry name is 'testName'
  const result = await db.get('SELECT jsonString FROM projects WHERE name = ?', projectName);

  //Close database
  await db.close();

  //Return the json string
  return result.jsonString;
}

/////////////////////////////////////////////////////////////////
//Function to delete a enty in the database with the project name
async function deleteDataFromDataBase(projectName) {

  // open the database
  const db = await sqlite.open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  await db.run("DELETE FROM projects WHERE name = ?", projectName);

  //Close database
  await db.close();
}

/////////////////////////////////////////////////////////////////
//Function to get all names of projects in database
async function getProjectNamesFromDataBase() {

  // open the database
  const db = await sqlite.open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  // Select all names from table
  var result = await db.all('SELECT name FROM projects');
  //Convert them to an array
  const namesArray = result.map(result => result.name);
  //Convert the array to a json string
  result = JSON.stringify(namesArray);

  //Close database
  await db.close();

  //Return the string
  return result;
}

////////////////////////////////////////////////////
//Function to update a Project in the database
async function updateProjectInDataBase(projectName, projectString) {

  // open the database
  const db = await sqlite.open({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  // Insert a new row into the database
  await db.run("UPDATE projects SET jsonString = ? WHERE name = ?", projectString, projectName);

  //Close database
  await db.close();
}




////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
class ProjectWrapper {
  constructor(name, colors, worksteps) {
    this.name = name;
    this.colors = colors;
    this.worksteps = worksteps;
  }
}