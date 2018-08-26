'use strict'

const Users = require('../database/repositories/userRepository')
const Plants = require('../database/repositories/plantRepository')
const { loggerFactory } = require('../logger/index')
const { mainMenuKeyboard, plantMenuFullKeyboard, plantMenuCutKeyboard, timeSettingsKeyboard } = require('../keyboard/index')

const logger = loggerFactory('mainMenu')

function enter(ctx) {
    ctx.reply('Чтобы настроить уведомления о поливе ваших растений, выберите один из пунктов меню.', mainMenuKeyboard)
}

async function myPlantsCommand(ctx) {
    const plants = await Plants.getAllPlantsName(ctx.message.from.id)
    let message
    let keyboard
    if (plants.length !== 0) {
        const plantsNameList = plants.map(p => p.name.charAt(0).toUpperCase() + p.name.slice(1)).join("\n")
        message = `Список ваших растений:\n${plantsNameList}\n\nЧто хотите сделать?`
        keyboard = plantMenuFullKeyboard
    } else {
        message = 'Список ваших растений пуст. Что хотите сделать?'
        keyboard = plantMenuCutKeyboard
    }
    await ctx.reply(message, keyboard)
    ctx.scene.enter('plants-menu')
}

async function timeSettingsCommand(ctx) {
    try {
        const telegramId = ctx.message.from.id
        const time = await Users.getUserTimeByTelegramId(telegramId)
        let message = time ? `Вы получаете уведомления в ${time}. Что хотите сделать?`
                           : 'У вас не настроено время уведомления. Хотите настроить его?' 
        await ctx.reply(message, timeSettingsKeyboard)
        ctx.scene.enter('time-menu')
    } catch (err) {
        logger.log('error', `Не удалось узнать время уведомления: ${err}`)
        await ctx.reply('У нас возникли проблемы. Попробуйте ещё раз')
        ctx.scene.enter('main-menu')
    }
}

module.exports = {
    enter,
    myPlantsCommand,
    timeSettingsCommand
}