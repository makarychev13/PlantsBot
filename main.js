'use strict'

const Telegraf = require('telegraf')
const Scene = require('telegraf/scenes/base')
const Stage = require('telegraf/stage')
const RedisSession = require('telegraf-session-redis')
const commonController = require('./controllers/commonController')
const mainMenuController = require('./controllers/mainMenuController')
const plantsMenuController = require('./controllers/plantsMenuController')
const timeMenuController = require('./controllers/timeMenuController')
const plantController = require('./controllers/plantController')
const setTimeController = require('./controllers/setTimeController')
const { mainTimer } = require('./notifications/mainTimer')
require('dotenv').config()

mainTimer()

const stage = new Stage()
const session = new RedisSession({
    store: {
        host: process.env.SESSION_HOST || '127.0.0.1',
        port: process.env.SESSION_PORT || 6379
    }
})
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
bot.catch(err => console.log(`Необработанная ошибка: ${err}`))
bot.use(session.middleware())
bot.use(stage.middleware())
bot.start(commonController.startReply)
bot.startPolling()

const mainMenu = new Scene('main-menu')
mainMenu.enter(mainMenuController.enter)
mainMenu.hears(/Мои растения/, mainMenuController.myPlantsCommand)
mainMenu.hears(/Время уведомления/, mainMenuController.timeSettingsCommand)
mainMenu.use(commonController.errorCommand)

const plantsMenu = new Scene('plants-menu')
plantsMenu.hears(/Добавить растения/, plantsMenuController.addPlantsCommand)
plantsMenu.hears(/Удалить растения/, plantsMenuController.deletePlantsCommand)
plantsMenu.hears(/Назад/, commonController.goToMainMenu)
plantsMenu.on('callback_query', plantController.deletePlant)
plantsMenu.use(commonController.errorCommand)

const timeMenu = new Scene('time-menu')
timeMenu.hears(/Настроить время уведомления/, timeMenuController.goToSetTime)
timeMenu.hears(/Назад/, commonController.goToMainMenu)
timeMenu.use(commonController.errorCommand)

const plants = new Scene('plants')
plants.enter(plantController.enter)
plants.hears(/Назад/, commonController.goToMainMenu)
plants.hears(/[a-z]+|[а-я]+/i, plantController.getPlantName)
plants.on('callback_query', plantController.getWateringPeriod)

const setTime = new Scene('set-time')
setTime.enter(setTimeController.enter)
setTime.hears(/[\d]+:\d\d/, setTimeController.getTimeNotify)
setTime.hears(/Назад/, commonController.goToMainMenu)
setTime.use(setTimeController.getTimezone)

stage.register(mainMenu, plantsMenu, timeMenu, plants, setTime)