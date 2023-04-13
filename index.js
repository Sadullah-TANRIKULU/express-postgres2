const express = require("express");
const app = express();
require('dotenv').config({path: './.env'});
const pg = require("pg");

let port=process.env.PORT || 9852;


// this will create a server
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.listen(port, () => {
    console.log(`App running on port ${port} `);
});

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

let pool = new pg.Pool({
    user: "postgres",
    host: "containers-us-west-33.railway.app",
    database: "railway",
    password: process.env.PASSWORD,
    port: 6243,
});

pool.on('error', (err, client) => console.log(err, client));

console.log('The total number of clients existing within the pool: ', pool.totalCount);
console.log('The number of clients which are not checked out but are currently idle in the pool: ', pool.idleCount);
console.log('The number of queued requests waiting on a client when all clients are checked out: ', pool.waitingCount);

app.get("/notes", (req, res) => {
  try {
     pool.query("SELECT * FROM notes", (err, data) => {
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
      pool.query("SELECT * FROM notes WHERE id = $1", [id], (err, data) => {
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
      const { note, title } = req.body;
      pool.query(
          "INSERT INTO notes (note, title) VALUES ($1, $2)", [note, title], 
          (err, data) => {
              res.status(201).json({
                  error: null,
                  note: data.rows[0],
              });
          });
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
      const title = req.body.title;

      pool.query("UPDATE notes SET note = $1, title = $2 WHERE id = $3",
      [note, title, id],
      (err, data) => {
          if (err) throw err;

          res.status(201).json({
              err: null,
              note: data.rows[0],
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
      pool.query("DELETE FROM notes WHERE id = $1", [id], 
      (err, data) => {
          if (err) throw err;
          res.status(200).json({
              err: null,
              note: data.rows[0],
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
});
