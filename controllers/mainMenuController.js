'use strict'

const Markup = require('telegraf/markup')
const messages = require('../data/message.json')
const Users = require('../database/repositories/userRepository')
const Plants = require('../database/repositories/plantRepository')

function enter(ctx) {
    const keyboard = [['Мои растения'], ['Время уведомления']]
    ctx.reply(messages.start, Markup.keyboard(keyboard).resize().extra())
}

async function myPlantsCommand(ctx) {
    const plants = await Plants.getAllPlantsName(ctx.message.from.id)
    let message
    let keyboard
    if (plants.length !== 0) {
        const plantsNameList = plants.map(p => p.name.charAt(0).toUpperCase() + p.name.slice(1)).join("\n")
        message = `Список ваших растений:\n${plantsNameList}\n\nЧто хотите сделать?`
        keyboard = [['Добавить растения'], ['Удалить растения'], ['Назад']]
    } else {
        message = 'Список ваших растений пуст. Что хотите сделать?'
        keyboard = [['Добавить растения'], ['Назад']]
    }
    await ctx.reply(message, Markup.keyboard(keyboard).resize().extra())
    ctx.scene.enter('plants-menu')
}

async function timeSettingsCommand(ctx) {
    try {
        const telegramId = ctx.message.from.id
        const time = await Users.getTimeByTelegramId(telegramId)
        let message = time ? `Вы получаете уведомления в ${time}. Что хотите сделать?`
                           : 'У вас не настроено время уведомления. Хотите настроить его?' 
        const keyboard = [['Настроить время уведомления'], ['Назад']]
        await ctx.reply(message, Markup.keyboard(keyboard).resize().extra())
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