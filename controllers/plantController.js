'use strict'

const Markup = require('telegraf/markup')
const Plants = require('../database/repositories/plantRepository')
const Users = require('../database/repositories/userRepository')

function getPlantName(ctx) {
    ctx.session.plantName = ctx.message.text
    const keyboard = [
        [Markup.callbackButton('Каждый день', '1')],
        [Markup.callbackButton('Каждые 2 дня', '2')],
        [Markup.callbackButton('Каждые 3 дня', '3')],
        [Markup.callbackButton('Каждые 5 дней', '5')],
        [Markup.callbackButton('Каждую неделю', '7')],
        [Markup.callbackButton('Каждые 2 недели', '14')],
        [Markup.callbackButton('Каждый месяц', '30')]
    ]    
    ctx.reply('Как часто его нужно поливать?', Markup.inlineKeyboard(keyboard).extra())
}

async function getWateringPeriod(ctx) {
    ctx.telegram.answerCbQuery(ctx.callbackQuery.id)
    if (!ctx.callbackQuery.data || !ctx.session.plantName) {
        return
    }

    const plant = {
        name: ctx.session.plantName.trim().toLowerCase(),
        period: ctx.callbackQuery.data
    }
    try {
        ctx.session.plantName = null
        await Plants.savePlant(plant, ctx.from.id)
        const isSaveUser = await Users.isUserSaveInDb(ctx.from.id)
        if (isSaveUser) {
            await ctx.reply('Растение успешно сохранено!')
            ctx.scene.enter('main-menu')
        } else {
            await ctx.reply('Растение успешно сохранено! Но у вас не настроено время уведомления')
            ctx.scene.enter('set-time')
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            await ctx.reply('У вас уже есть такое растение')
            ctx.scene.reenter()
        } else {
            await ctx.reply('У нас возникли какие-то проблемы. Попробуйте позже')
            ctx.scene.enter('main-menu')
        }
    }
}

async function deletePlant(ctx) {
    ctx.telegram.answerCbQuery(ctx.callbackQuery.id)
    if (!ctx.callbackQuery.data) {
        return
    }
    
    try {
        await Plants.deletePlant(ctx.from.id, ctx.callbackQuery.data)
        const plantsName = await Plants.getAllPlantsName(ctx.from.id)
        const editKeyboard = plantsName.map(p => [Markup.callbackButton(p.name.charAt(0).toUpperCase() + p.name.slice(1), p.name)])
        ctx.editMessageReplyMarkup(Markup.inlineKeyboard(editKeyboard))
        if (plantsName.length !== 0) {
            ctx.reply('Растение успешно удалено')
        } else {
            await ctx.reply('Вы удалили все свои растения')
            ctx.scene.enter('main-menu')
        }
    } catch(err) {
        await ctx.reply('У нас возникли какие-то ошибки. Попробуйте ещё раз')
        ctx.scene.enter('main-menu')
    }
}

function enter(ctx) {
    const keyboard = [['Назад']]
    ctx.reply('Введите имя растения', Markup.keyboard(keyboard).resize().extra())
}

module.exports = {
    getPlantName,
    getWateringPeriod,
    deletePlant,
    enter
}