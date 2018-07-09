const messages = require('../data/message.json')

function wrongTimeFormat(ctx) {
    ctx.reply(messages.wrongTimeFormat)
}

module.exports = {
    wrongTimeFormat
}