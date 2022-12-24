require('dotenv').config({path: './.env'});

module.exports = {
    user: "postgres",
    host: "127.0.0.1",
    database: "withExpress2",
    password: process.env.PASSWORD,
    porte: 5432,
};