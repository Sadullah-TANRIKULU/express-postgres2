const express = require("express");
const app = express();
require('dotenv').config({path: './.env'});

// this will create a server
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.listen(process.env.PORT, () => console.log(`Lstening on port ${process.env.PORT}`));

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

  // to begin with creating a table in postgresql database using pgAdmin4
// then type codes below
  const { Client } = require("pg");
  const { user, host, database, password, port } = require("./dbConfig");
  
  const client = new Client({
      user,
      host,
      database,
      password,
      port,
  });
  
  client.connect();


// this will create a note in db
app.get("/notes", (req, res) => {
  try {
     client.query("SELECT * FROM notes", (err, data) => {
          if (err) throw err;

          res.status(200).json({
              err: null,
              notes: data.rows,

          });
      });
  } catch (error) {
      res.status(500).json({
          err: error.message,
          notes: null,
      });
  }
});

app.get("/note/:id", (req, res) => {
  try {
      const id = req.params.id;
      client.query("SELECT * FROM notes WHERE id = $1", [id], (err, data) => {
          if (err) throw err;
          
          res.status(200).json({
              err: null,
              note: data.rows[0],
          });
      });
  } catch (error) {
      res.status(500).json({
          err: error.message,
          note: null,
      });
  }
});
app.post("/note", (req, res) => {
  try {
      const { note } = req.body;
      if(!note) {
          throw Error("Send note in request body");
      }
      client.query(
          "INSERT INTO notes (note) VALUES ($1)", [note], 
          (err, data) => {
              res.status(201).json({
                  error: null,
                  message: "Created new note",
              });
          }
      );
  } catch (error) {
      res.status(500).json({
          error: error.message,
          message: "Failed to create new note",
      });
  }
});
app.put("/note/:id", (req, res) => {
  try {
      const id = req.params.id;
      const note = req.body.note;

      client.query("UPDATE notes SET note = $1 WHERE id = $2",
      [note, id],
      (err, data) => {
          if (err) throw err;

          res.status(201).json({
              err: null,
              message: "Note updated",
          });
      });
  } catch (error) {
      res.status(500).json({
          err: error.message,
          message: "Failed to update note",
      });
  }
});
app.delete("/note/:id", (req, res) => {
  try {
      const id = req.params.id;
      client.query("DELETE FROM notes WHERE id = $1", [id], 
      (err, data) => {
          if (err) throw err;
          res.status(200).json({
              err: null,
              message: "Note deleted",
          });
      });
  } catch (error) {
      res.status(500).json({
          err: error.message,
          message: "Failed to delete note",
      });
  }
});
app.get("*", (req, res) => {
  res.send('no routes specified with this name!!!')
})
