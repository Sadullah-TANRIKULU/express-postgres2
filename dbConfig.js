require('dotenv').config({path: './.env'});

module.exports = {
    user: "postgres",
    host: "0.0.0.0",
    database: "withExpress2",
    password: process.env.PASSWORD,
    port: 5432,
};