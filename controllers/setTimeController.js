'use strict'

const { getTimeZoneByString } = require('../geo/index')
const { goBackKeyboard } = require('../keyboard/index')
const { loggerFactory } = require('../logger/index')
const Users = require('../database/repositories/userRepository')

const logger = loggerFactory('setTime')

function enter(ctx) {
    ctx.reply('Во сколько вы хотите получать уведомления?', goBackKeyboard)
}

function getTimeNotify(ctx) {
    if (_getHourInt(ctx.message.text) > 24 || _getMinuteInt(ctx.message.text) > 59) {
        ctx.reply('Неправильный формат данных. Введите время в формате ЧЧ:ММ. Например, 12:30 или 16:00')
        return
    }

    ctx.session.timeNotify = ctx.message.text
    ctx.reply('Введите город, в котором вы живёте, чтобы я определил часовой пояс')
}

async function getTimezone(ctx) {
    if (!ctx.session.timeNotify) {
        ctx.reply('Неправильный формат данных. Введите время в формате ЧЧ:ММ. Например, 12:30 или 16:00')
        return
    }

    try {
        const timeZone = await getTimeZoneByString(ctx.message.text)
        const timeNotify = ctx.session.timeNotify
        const minute = _getMinuteInt(timeNotify)
        let hour = _getHourInt(timeNotify)
        hour -= timeZone
        if (hour >= 24) {
            hour -= 24
        } else if (hour < 0) {
            hour += 24
        }
        await Users.saveOrUpdateUser({
            telegramId: ctx.message.from.id,
            time: `${hour}:${minute}`,
            userTime: timeNotify
        })
        ctx.session.timeNotify = null
        await ctx.reply('Часовой пояс успешно сохранён!')
        await ctx.scene.enter('main-menu')
    } catch (err) {
        logger.log('error', `Не удалось узнать часовой пояс: ${err}`)
        ctx.reply('Не удалось узнать часовой пояс. Попробуйте ещё')
    }
}

function _getHourInt(timeString) {
    const indexOfColon = timeString.indexOf(':')
    const hour = parseInt(timeString.substr(0, indexOfColon))

    return hour
}

function _getMinuteInt(timeString) {
    const indexOfColon = timeString.indexOf(':')
    const minute = parseInt(timeString.substr(indexOfColon + 1, 2))

    return minute
}

module.exports = {
    enter,
    getTimeNotify,
    getTimezone
}