const Sequelize = require("sequelize");
const connection = require("../database/database");
const Character = require('../characters/Character')

const Chapter = connection.define("capitulos", {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    order: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Chapter.belongsToMany( Character,{
    through: 'character_chapter'
})
Character.belongsToMany( Chapter,{
    through: 'character_chapter'
})

Chapter.sync({force: false})
module.exports = Chapter;