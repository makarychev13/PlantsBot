'use strict'

const { User } = require('../models/users')
const { getPlantsForWatering } = require('./plantRepository')
const options = require('sequelize').Op

async function getUserTimeByTelegramId(telegramId) {
    const user = await User.findAll({
        attributes: ['user_time'],
        where: {
            telegram_id: telegramId
        }
    })

    return user.length !== 0 ? user[0].user_time : null
}

async function isUserSaveInDb(telegramId) {
    const user = await User.findAll({
        attributes: ['id'],
        where: {
            telegram_id: telegramId
        }
    })

    return user.length !== 0 ? true : false
}

function saveOrUpdateUser(user) {
    return User.upsert({
        telegram_id: user.telegramId,
        notification_time: user.time,
        user_time: user.userTime
    })
}

function getNotificationTime(telegramIdList) {
    return User.findAll({
        attributes: ['notification_time', 'telegram_id'],
        where: {
            telegram_id: {
                [options.or]: telegramIdList
            }
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
    getUserTimeByTelegramId,
    saveOrUpdateUser,
    isUserSaveInDb,
    getNotificationTime,
    getDataForNotification
}