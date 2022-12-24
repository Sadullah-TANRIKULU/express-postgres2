require('dotenv').config({path: './.env'});

module.exports = {
    user: "postgres",
    host: "localhost",
    database: "withExpress2",
    password: process.env.PASSWORD,
    porte: 5432,
};