'use strict'

function startReply(ctx) {
    ctx.scene.enter('main-menu')
}

function errorCommand(ctx) {
    ctx.reply('Нет такой команды. Выберите один из пунктов меню на клавиатуре ниже.')
}

function goToMainMenu(ctx) {
    if (ctx.session && ctx.session.timeNotify) {
        ctx.session.timeNotify = null
    }
    ctx.scene.enter('main-menu')
}

module.exports = {
    startReply,
    errorCommand,
    goToMainMenu
}