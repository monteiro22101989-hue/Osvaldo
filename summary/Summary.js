const Sequelize = require("sequelize");
const connection = require("../database/database")

const Summary = connection.define("summary",{

    title:{
        type: Sequelize.STRING,   
        allowNull: false
    },
    content:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        AllowNull: true
    },
    order: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
})

Summary.sync({force:false})
module.exports = Summary;