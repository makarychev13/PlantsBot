'use strict'

const { Plant } = require('../models/plants')

function savePlant(plant, telegramId) {
    return Plant.create({
        name: plant.name,
        last_watering_date: new Date(),
        period: plant.period,
        user_telegram_id: telegramId
    })
}

function getAllPlantsName(telegramId) {
    if (!telegramId) {
        return []
    }

    return Plant.findAll({
        attributes: ['name'],
        where: {
            user_telegram_id: telegramId
        }
    })
}

module.exports = {
    savePlant,
    getAllPlantsName
}