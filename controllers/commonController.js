'use strict'

function startReply(ctx) {
    ctx.scene.enter('main-menu')
}

function errorCommand(ctx) {
    ctx.reply('Нет такой команды. Выберите один из пунктов меню.')
}

function goToMainMenu(ctx) {
    ctx.scene.enter('main-menu')
}

module.exports = {
    startReply,
    errorCommand,
    goToMainMenu
}