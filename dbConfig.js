require('dotenv').config({path: './.env'});

module.exports = {
    user: "postgres",
    host: "localhost",
    database: "withExpress2",
    password: process.env.PASSWORD,
    port: 5432,
};