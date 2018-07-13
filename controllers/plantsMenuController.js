'use strict'

function backCommand(ctx) {
    ctx.scene.leave()
    ctx.scene.enter('main-menu')
}

function addPlantsCommand(ctx) {
    ctx.reply('Введите имя растения')
    ctx.scene.enter('add-plant')
}

module.exports = {
    backCommand,
    addPlantsCommand
}