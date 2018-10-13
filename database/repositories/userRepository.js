'use strict'

const { User } = require('../models/users')
const options = require('sequelize').Op

async function getUserTimeByTelegramId(telegramId) {
    const user = await User.findAll({
        attributes: ['user_time', 'mute'],
        where: {
            telegram_id: telegramId
        }
    })

    return user.length !== 0 ? user[0] : null
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
            },
            mute: false
        }
    })
}

function muteUser(telegramId) {
    return User.update({
        mute: true 
    }, 
    {
        where: {
            telegram_id: telegramId
        }
    })
}

function unmuteUser(telegramId) {
    return User.update({
        mute: false 
    }, 
    { 
        where: {
            telegram_id: telegramId
        }
    })
}

module.exports = {
    getUserTimeByTelegramId,
    saveOrUpdateUser,
    isUserSaveInDb,
    getNotificationTime,
    muteUser,
    unmuteUser
}