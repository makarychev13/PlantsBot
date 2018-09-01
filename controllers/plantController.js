'use strict'

const Markup = require('telegraf/markup')
const Plants = require('../database/repositories/plantRepository')
const Users = require('../database/repositories/userRepository')
const { loggerFactory } = require('../logger/index')
const { plantPeriodsKeyboard, goBackKeyboard, finalAddPlantKeyboard } = require('../keyboard/index')

const logger = loggerFactory('plant')

function getPlantName(ctx) {
    if (ctx.session.plantName) {
        ctx.reply('Неверный формат. Чтобы выбрать периодичность полива, нажмите на одну из кнопок выше')
        return
    } else if (ctx.session.dontCheck) {
        ctx.reply('Неверный формат. Выберите один из пунктов меню на клавиатуре')
        return
    }

    ctx.session.plantName = ctx.message.text    
    ctx.reply('Как часто его нужно поливать?', plantPeriodsKeyboard)
}

async function getWateringPeriod(ctx) {
    ctx.telegram.answerCbQuery(ctx.callbackQuery.id)
    if (!ctx.callbackQuery.data || !ctx.session.plantName) {
        return
    }

    const plant = {
        name: ctx.session.plantName.replace(/ /g, '').toLowerCase(),
        period: ctx.callbackQuery.data
    }
    try {
        ctx.session.plantName = null
        await Plants.savePlant(plant, ctx.from.id)
        const isSaveUser = await Users.isUserSaveInDb(ctx.from.id)
        if (isSaveUser) {
            ctx.session.dontCheck = true
            await ctx.reply('Растение успешно сохранено! Что хотите сделать?', finalAddPlantKeyboard)
        } else {
            await ctx.reply('Растение успешно сохранено! Но у вас не настроено время уведомления')
            ctx.scene.enter('set-time')
        }
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            await ctx.reply('У вас уже есть такое растение. Введите другое имя растения или вернитесь в главное меню', goBackKeyboard)
        } else {
            logger.log('error', `Не удалось сохранить растение: ${err}`)
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
        logger.log('error', `Не удалось удалить растение растение: ${err}`)
        await ctx.reply('У нас возникли какие-то ошибки. Попробуйте ещё раз')
        ctx.scene.enter('main-menu')
    }
}

module.exports = {
    getPlantName,
    getWateringPeriod,
    deletePlant
}