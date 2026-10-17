const sequelize = require("sequelize");

const connection = new sequelize("narneiro","root","Monte@2022",{
    host: "localhost",
    dialect: "mysql",
    timezone: "-03:00"
});

module.exports = connection;