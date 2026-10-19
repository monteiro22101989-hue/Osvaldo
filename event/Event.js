const Sequelize = require("sequelize");
const connection = require("../database/database");

const Event = connection.define("event", {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    chronologicalOrder: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    importance: {
        type: Sequelize.STRING,
        allowNull: true
    },
    local: {
        type: Sequelize.STRING,
        allowNull: true
    },
    observation: {
        type: Sequelize.TEXT,
        allowNull: true
    } 
})

Event.sync({force:false})
module.exports = Event;