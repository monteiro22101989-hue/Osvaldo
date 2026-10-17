const Sequelize = require("sequelize");
const connection = require("../database/database");


const Character = connection.define("character", {
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    nickname:{
        type: Sequelize.STRING,
        allowNull: true
    },
    description:{
        type:Sequelize.TEXT,
        allowNull: true
    },
    appearance: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    personality: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    story: {
        type: Sequelize.TEXT,   
        allowNull: true
    },
    gols: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    state: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    state_on_story: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true
    }

})

Character.sync({force:false})
module.exports = Character;