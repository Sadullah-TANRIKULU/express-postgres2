require('dotenv').config({path: './.env'});

module.exports = {
    user: "me",
    host: "dpg-cgb0uu5269v4icojn4sg-a",
    database: "myfirstdatabase",
    password: process.env.PASSWORD,
    porte: 5432,
};
