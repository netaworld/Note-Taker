// Dependencies
// =============================================================
var express = require("express");
var path = require("path");


var fs = require('fs')

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.Port || 3000;
// Sets up the Express app to handle data parsing
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var notes = require("./db/db.json")
//===============================
//HTML routes
//===============================
// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

//===============================
//API routes
//===============================
// // Displays a single Note, or returns false
app.get("/api/notes/:note", function(req, res) {
  var chosen = req.params.note;

  console.log(chosen);

  for (var i = 0; i < notes.length; i++) {
    if (chosen === notes[i].title) {
      return res.json(notes[i]);
    }
  }

  return res.json(false);
});

// Displays all notes
app.get("/api/notes", function(req, res) {
  return res.json(notes);
});


//  Create New Notes - takes in JSON input
app.post("/api/notes", function(req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  var testNotes = require('./db/db.json')
  var newNote = req.body;
  newNote.id = parseInt(notes[notes.length-1].id)+1

  //notes.splice(notes.length -1 , 1)
  notes.push(newNote)
  console.log(notes)
  // Using a RegEx Pattern to remove spaces from newNote
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  //newNote= newNote.name.replace(/\s+/g, "").toLowerCase();
//   notes.push(newNote)
  console.log(notes)
  fs.writeFile('./db/db.json',JSON.stringify(notes),()=>{
   res.json(newNote)
  })
//   console.log(newNote);

//   notes.push(newNote);

//   res.json(newNote);
});

app.delete('/api/notes/:id',(req, res)=>{
  var id = req.params.id
  var position = notes.findIndex(element=> parseInt(element.id)===parseInt(id)) //<<<<<<<<   lookup findIndex
  notes.splice(position, 1)
  fs.writeFile('./db/db.json',JSON.stringify(notes),()=>{
    res.json(notes)
   })

})
// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
