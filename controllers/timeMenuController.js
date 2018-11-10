'use strict'

const { muteUser, unmuteUser} = require('../database/repositories/userRepository')
const { timeSettingsKeyboardSub, timeSettingsKeyboardUnsub } = require('../keyboard/index')
const { updatePlantsAfterUnmuteUser } = require('../database/repositories/plantRepository')

function goToSetTime(ctx) {
    ctx.scene.enter('set-time')
}

function wrongTimeFormat(ctx) {
    ctx.reply('Вы неправильно ввели время уведомления. Уведомление необходимо ввести в формате ЧЧ:ММ. Например, 12:00 или 0:30.')
}

async function unsubUser(ctx) {
    try {
        await muteUser(ctx.message.from.id)
        ctx.reply('Вы успешно отписались от уведомлений', timeSettingsKeyboardSub)
    } catch (err) {
        await ctx.reply('Что-то пошло не так. Попробуйте позже')
        ctx.scene.enter('main-menu')
    }
}

async function subUser(ctx) {
    try {
        await unmuteUser(ctx.message.from.id)
        await updatePlantsAfterUnmuteUser(ctx.message.from.id)
        ctx.reply('Вы успешно подписались на уведомления', timeSettingsKeyboardUnsub)
    } catch (err) {
        await ctx.reply('Что-то пошло не так. Попробуйте позже')
        ctx.scene.enter('main-menu')
    }
}

module.exports = {
    wrongTimeFormat,
    goToSetTime,
    unsubUser,
    subUser
}