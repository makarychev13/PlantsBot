const messages = require('../data/message.json')
const Markup = require('telegraf/markup')

function startReply(ctx) {
    ctx.scene.enter('main-menu')
}

function errorCommand(ctx) {
    ctx.reply(`Вы ошиблись`)
}

function goToMainMenu(ctx) {
    ctx.scene.enter('main-menu')
}

module.exports = {
    startReply,
    errorCommand,
    goToMainMenu
}