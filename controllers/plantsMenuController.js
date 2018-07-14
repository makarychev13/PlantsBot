'use strict'

const Markup = require('telegraf/markup')

function backCommand(ctx) {
    ctx.scene.leave()
    ctx.scene.enter('main-menu')
}

function addPlantsCommand(ctx) {
    const keyboard = [['Назад']]
    ctx.reply('Введите имя растения', Markup.keyboard(keyboard).resize().extra())
    ctx.scene.enter('add-plant')
}

module.exports = {
    backCommand,
    addPlantsCommand
}