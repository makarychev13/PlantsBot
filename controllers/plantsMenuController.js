'use strict'

const Markup = require('telegraf/markup')
const Plants = require('../database/repositories/plantRepository')

function backCommand(ctx) {
    ctx.scene.leave()
    ctx.scene.enter('main-menu')
}

function addPlantsCommand(ctx) {
    ctx.scene.enter('add-plant')
}

async function deletePlantsCommand(ctx) {
    const plantsName = await Plants.getAllPlantsName(ctx.message.from.id)
    if (plantsName.length === 0) {
        ctx.scene.scene('main-menu')
        return
    }

    const keyboard = plantsName.map(p => [Markup.callbackButton(p.name.charAt(0).toUpperCase() + p.name.slice(1), p.name)])
    ctx.reply('Какое растение хотите удалить?', Markup.inlineKeyboard(keyboard).extra())
}

module.exports = {
    backCommand,
    addPlantsCommand,
    deletePlantsCommand
}