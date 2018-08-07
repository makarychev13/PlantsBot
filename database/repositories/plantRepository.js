'use strict'

const { Plant } = require('../models/plants')
const { SELECT } = require('sequelize')
const { connect } = require('../connect')

function savePlant(plant, telegramId) {
    return Plant.create({
        name: plant.name,
        last_watering_date: new Date(),
        period: plant.period,
        user_telegram_id: telegramId
    })
}

function getAllPlantsName(telegramId) {
    return Plant.findAll({
        attributes: ['name'],
        where: {
            user_telegram_id: telegramId
        }
    })
}

function deletePlant(telegramId, plantName) {
    return Plant.destroy({
        where: {
            user_telegram_id: telegramId,
            name: plantName
        }
    })
}

function getPlantsForWatering(date) {
    return Plant.findAll({
        where: {
            last_watering_date: date
        }
    })
}

function updateWateringDate(plantName, telegramId) {
    const sqlQuery = 'UPDATE plants SET last_watering_date = ADDDATE(last_watering_date, period) WHERE name = ? AND user_telegram_id = ?'
    return connect.query(sqlQuery, { replacements: [plantName, telegramId], 
                         type: SELECT })
}

module.exports = {
    savePlant,
    getAllPlantsName,
    deletePlant,
    getPlantsForWatering,
    updateWateringDate
}