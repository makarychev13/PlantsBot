'use strict'

const { Plant } = require('../models/plants')

function savePlant(plant, telegramId) {
    return Plant.create({
        name: plant.name,
        last_watering_date: new Date(),
        period: plant.period,
        user_id: telegramId
    })
}

module.exports = {
    savePlant
}