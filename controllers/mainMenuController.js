'use strict'

const Markup = require('telegraf/markup')
const messages = require('../data/message.json')
const Users = require('../database/repositories/userRepository')

function enter(ctx) {
    const keyboard = [['Мои растения'], ['Время уведомления']]
    ctx.reply(messages.start, Markup.keyboard(keyboard).resize().extra())
}

async function myPlantsCommand(ctx) {
    const keyboard = [['Добавить растения'], ['Удалить растения'], ['Изменить время полива'], ['Назад']]
    await ctx.reply(messages.myPlantsStart, Markup.keyboard(keyboard).resize().extra())
    ctx.scene.enter('plants-menu')
}

async function timeSettingsCommand(ctx) {
    try {
        const telegramId = ctx.message.from.id
        const time = await Users.getTimeByTelegramId(telegramId)
        let message = time ? `Вы получаете уведомления в ${time}. Что хотите сделать?`
                           : 'У вас не настроено время уведомления. Хотите настроить его?' 
        const keyboard = [['Настроить время уведомления'], ['Назад']]
        ctx.reply(message, Markup.keyboard(keyboard).resize().extra())
        ctx.scene.enter('time-menu')
    } catch (err) {
        await ctx.reply('У нас возникли проблемы. Попробуйте ещё раз')
        ctx.scene.enter('main-menu')
    }
}

module.exports = {
    enter,
    myPlantsCommand,
    timeSettingsCommand
}