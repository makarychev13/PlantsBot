'use strict'

const { User } = require('../models/users')

async function getTimeByTelegramId(telegramId) {
    if (!telegramId) {
        return null
    }
    
    const user = await User.findAll({
        attributes: ['notification_time'],
        where: {
            telegram_id: telegramId
        }
    })

    return user.length !== 0 ? user[0].notification_time : null
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

function saveUser(user) {
    return User.create({
        telegram_id: user.telegramId,
        notification_time: user.time
    })
}

module.exports = {
    getTimeByTelegramId,
    saveUser,
    isUserSaveInDb
}