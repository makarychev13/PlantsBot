'use strict'

const Markup = require('telegraf/markup')

const mainMenuKeyboard = Markup.keyboard([['Мои растения'], ['Время уведомления']]).resize().extra()
const plantMenuFullKeyboard = Markup.keyboard([['Добавить растения'], ['Удалить растения'], ['Назад']]).resize().extra()
const plantMenuCutKeyboard = Markup.keyboard([['Добавить растения'], ['Назад']]).resize().extra()
const timeSettingsKeyboard = Markup.keyboard([['Настроить время уведомления'], ['Назад']]).resize().extra()
const plantPeriodsKeyboard = Markup.inlineKeyboard([
    [Markup.callbackButton('Каждый день', '1')],
    [Markup.callbackButton('Каждые 2 дня', '2')],
    [Markup.callbackButton('Каждые 3 дня', '3')],
    [Markup.callbackButton('Каждые 5 дней', '5')],
    [Markup.callbackButton('Каждую неделю', '7')],
    [Markup.callbackButton('Каждые 2 недели', '14')],
    [Markup.callbackButton('Каждый месяц', '30')]
]).extra()
const goBackKeyboard = Markup.keyboard([['Назад']]).resize().extra()
const finalAddPlantKeyboard = Markup.keyboard([['В главное меню'], ['Добавить ещё растение']]).resize().extra()

module.exports = {
    mainMenuKeyboard,
    plantMenuFullKeyboard,
    plantMenuCutKeyboard,
    timeSettingsKeyboard,
    plantPeriodsKeyboard,
    goBackKeyboard,
    finalAddPlantKeyboard
}