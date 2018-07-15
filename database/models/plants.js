'use strict'

const Sequelize = require('sequelize')
const { connect } = require('../connect')

const Plant = connect.define('plants', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    last_watering_date: {
        type: Sequelize.DATE,
        allowNull: false
    }
})

Plant.sync().catch(err => consol.err(`Не удалось создать таблицу plants: ${err}`))

module.exports = {
    Plant
}