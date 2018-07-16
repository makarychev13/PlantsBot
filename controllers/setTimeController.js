'use strict'

const { geo } = require('../geo/index')
const { transliterate } = require('../geo/translit')
const Users = require('../database/repositories/userRepository')

function enter(ctx) {
    ctx.reply('Когда вы хотите получать уведомления?')
}

function getTimeNotify(ctx) {
    const textFromMessage = ctx.message.text
    const time = textFromMessage.length > 5 ? textFromMessage.substr(0, 5) : textFromMessage
    ctx.session.timeNotify = time
    ctx.reply('Введите город, в котором вы живёте, чтобы я определил часовой пояс')
}

async function getTimezone(ctx) {
    if (ctx.session.timeNotify) {
        try {
            const translitCity = transliterate(ctx.message.text)
            const timeZone = await geo.getTimeZoneByString(translitCity.toLowerCase())
            const timeNotify = ctx.session.timeNotify
            const indexOfColon = timeNotify.indexOf(':')
            const minute = parseInt(timeNotify.substr(indexOfColon + 1, 2))
            let hour = parseInt(timeNotify.substr(0, indexOfColon)) 
            hour -= timeZone
            if (hour >= 24) {
                hour -= 24
            } else if (hour < 0) {
                hour += 24
            }
            await Users.saveUser({
                telegramId: ctx.message.from.id,
                time: `${hour}:${minute}`
            })
            await ctx.reply('Часовой пояс успешно сохранён!')
            await ctx.scene.enter('main-menu')
        } catch (err) {
            ctx.reply('Не удалось узнать часовой пояс. Попробуйте ещё')
        }
    } else {
        ctx.reply('Неправильное время!')
    }
}

module.exports = {
    enter,
    getTimeNotify,
    getTimezone
}