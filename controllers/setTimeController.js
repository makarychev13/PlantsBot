'use strict'

function enter(ctx) {
    ctx.reply('Когда вы хотите получать уведомления?')
}

function getTimeNotify(ctx) {
    const textFromMessage = ctx.message.text
    const time = textFromMessage.length > 5 ? textFromMessage.substr(0, 5) : textFromMessage
    ctx.session.timeNotify = time
    ctx.reply('Введите город, в котором вы живёте, чтобы я определил часовой пояс')
}

function getTimezone(ctx) {
    if (ctx.session.timeNotify) {
        ctx.reply('Часовой пояс успешно сохранён!')
        ctx.scene.enter('main-menu')
    } else {
        ctx.reply('Неправильное время!')
    }
}

module.exports = {
    enter,
    getTimeNotify,
    getTimezone
}