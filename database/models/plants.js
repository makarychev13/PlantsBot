'use strict'

const Sequelize = require('sequelize')
const { connect } = require('../connect')

const Plant = connect.define('plants', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_telegram_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_watering_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    period: {
        type: Sequelize.INTEGER({ length: 2 }),
        allowNull: false
    }
}, { timestamps: false })

Plant.sync({ force: false }).catch(err => console.err(`Не удалось создать таблицу plants: ${err}`))

module.exports = {
    Plant
}