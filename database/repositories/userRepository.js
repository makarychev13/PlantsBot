'use strict'

const { User } = require('../models/users')

async function getUserTimeByTelegramId(telegramId) {
    if (!telegramId) {
        return null
    }
    
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

module.exports = {
    getUserTimeByTelegramId,
    saveOrUpdateUser,
    isUserSaveInDb
}