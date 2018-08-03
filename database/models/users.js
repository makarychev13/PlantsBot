'use strict'

const Sequelize = require('sequelize')
const { connect } = require('../connect')

const User = connect.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    telegram_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    notification_time: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3,5]
        }
    },
    user_time: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [3,5]
        }
    }
})

User.sync({ force: false }).catch(err => console.err(`Не удалось создать таблицу users: ${err}`))

module.exports = {
    User
}