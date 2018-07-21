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
        name: ctx.session.plantName,
        period: ctx.callbackQuery.data
    }
    try {
        await Plants.savePlant(plant, ctx.from.id)
        ctx.session.plantName = null
        const isSaveUser = await Users.isUserSaveInDb(ctx.from.id)
        if (isSaveUser) {
            await ctx.reply('Растение успешно сохранено!')
            ctx.scene.enter('main-menu')
        } else {
            await ctx.reply('Растение успешно сохранено! Но у вас не настроено время уведомления')
            ctx.scene.enter('set-time')
        }
    } catch (err) {
        await ctx.reply('У нас возникли какие-то ошибки. Попробуйте ещё раз')
        ctx.scene.enter('main-menu')
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
        const editKeyboard = plantsName.map(p => [Markup.callbackButton(p.name, p.name)])
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

module.exports = {
    getPlantName,
    getWateringPeriod,
    deletePlant
}