'use strict'

function getPlantName(ctx) {
    ctx.session.plantName = ctx.message.text
    ctx.reply('Сколько раз в месяц его нужно поливать?')
}

function getWateringPeriod(ctx) {
    if (ctx.session.plantName) {
        ctx.session.wateringPeriod = ctx.message.text
        ctx.scene.enter('set-time')
    } else {
        ctx.reply('Некорректное имя растения. Введите текстовое имя')
    }
}

module.exports = {
    getPlantName,
    getWateringPeriod
}