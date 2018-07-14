'use strict'
const { geo } = require('../geo/index')
const { transliterate } = require('../geo/translit')

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
            ctx.reply('Часовой пояс успешно сохранён!')
            ctx.scene.enter('main-menu')
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