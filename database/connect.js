'use strict'

require('dotenv').config()

const Sequelize = require('sequelize')
const connect = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci'
    },
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

connect.authenticate().catch(err => console.log(`Не удалось подключиться к БД: ${err}`))

module.exports = {
    connect
}         