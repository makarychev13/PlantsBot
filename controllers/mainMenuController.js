'use strict'

const Markup = require('telegraf/markup')
const messages = require('../data/message.json')

function enter(ctx) {
    const keyboard = [['Мои растения'], ['Время уведомления']]
    ctx.reply(messages.start, Markup.keyboard(keyboard).resize().extra())
}

function myPlantsCommand(ctx) {
    const keyboard = [['Добавить растения'], ['Удалить растения'], ['Изменить время полива'], ['Назад']]
    ctx.reply(messages.myPlantsStart, Markup.keyboard(keyboard).resize().extra())
    ctx.scene.enter('plants-menu')
}

function timeSettingsCommand(ctx) {
    const keyboard = [['Настроить время уведомления'], ['Назад']]
    ctx.reply('Сейачас вы получаете уведомления в. Если хотите изменить время, то курлык', Markup.keyboard(keyboard).resize().extra())
    ctx.scene.enter('time-menu')
}

module.exports = {
    enter,
    myPlantsCommand,
    timeSettingsCommand
}