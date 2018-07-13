'use strict'

const messages = require('../data/message.json')

function goToSetTime(ctx) {
    ctx.scene.enter('set-time')
}

function wrongTimeFormat(ctx) {
    ctx.reply(messages.wrongTimeFormat)
}

module.exports = {
    wrongTimeFormat,
    goToSetTime
}