// to begin with creating a table in postgresql database using pgAdmin4
// then type codes below

const Client = require("pg").Client;
const { user, host, database, password, port } = require("./dbConfig");

const client = new Client({
    user,
    host,
    database,
    password,
    port,
});

client.connect();
module.exports = client;