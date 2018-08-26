'use strict'

const { Plant } = require('../models/plants')
const { fn, col } = require('sequelize')

function savePlant(plant, telegramId) {
    const now = new Date()
    return Plant.create({
        name: plant.name,
        last_watering_date: now.setDate(now.getDate() + parseInt(plant.period)),
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
    return Plant.update({
        last_watering_date: fn('ADDDATE', col('last_watering_date'), col('period'))
    }, 
    { 
        where: { 
            user_telegram_id: telegramId,     
            name: plantName 
        }
    })
}

module.exports = {
    savePlant,
    getAllPlantsName,
    deletePlant,
    getPlantsForWatering,
    updateWateringDate
}