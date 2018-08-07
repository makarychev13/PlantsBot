'use strict'

const Telegram = require('telegraf/telegram')
const { getPlantsForWatering, updateWateringDate } = require('../database/repositories/plantRepository')
const { getNotificationTime } = require('../database/repositories/userRepository')
const { createTask } = require('./cronTask')
require('dotenv').config()

const telegram = new Telegram(process.env.TELEGRAM_TOKEN)

function mainTimer() {
    createTask('0:0', async () => {
        const dataForNotification = await getDataForNotification(new Date())
        for (const notification of dataForNotification) {
            createTask(notification.time, 
                       async () => await telegram.sendMessage(notification.id, `Не забудьте полить ${notification.plantName}`), 
                       false, 
                       async () => await updateWateringDate(notification.plantName, notification.id))
        }
    })
}

async function getDataForNotification(date) {
    const plantsForWatering = await getPlantsForWatering(date);
    let telegramIds = plantsForWatering.map(plant => plant.user_telegram_id)
    telegramIds = telegramIds.filter((id, index) => telegramIds.indexOf(id) == index)                               
    const notificationTimes = await getNotificationTime(telegramIds)

    const dataForCron = []
    for (const notificationTime of notificationTimes) {
        const userPlants = plantsForWatering.filter(plant => plant.user_telegram_id === notificationTime.telegram_id)
        for (const plant of userPlants) {
            dataForCron.push({
                id: notificationTime.telegram_id,
                plantName: plant.name,
                time: notificationTime.notification_time
            })
        }
    }

    return dataForCron
}

module.exports = {
    mainTimer
}