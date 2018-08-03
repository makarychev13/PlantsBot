'use strict'

function goToSetTime(ctx) {
    ctx.scene.enter('set-time')
}

function wrongTimeFormat(ctx) {
    ctx.reply('Вы неправильно ввели время уведомления. Уведомление необходимо ввести в формате ЧЧ:ММ. Например, 12:00 или 0:30.')
}

module.exports = {
    wrongTimeFormat,
    goToSetTime
}