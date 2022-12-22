const express = require("express");
const app = express();
const db = require("./helper");


// this will create a server
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.listen(3000, () => console.log("Listening on port 3000"));

// allowing multiple origins
app.use((req, res, next) => {
    const allowedOrigins = ['*'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next(); 
  });


// this will create a note in db
app.get("/notes", db.getNotes);
app.get("/note/:id", db.getNoteById);
app.post("/note", db.createNote);
app.put("/note/:id", db.updateNoteById);
app.delete("/note/:id", db.deleteNote);
