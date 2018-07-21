'use strict'

const Telegraf = require('telegraf')
const Scene = require('telegraf/scenes/base')
const Stage = require('telegraf/stage')
const session = require('telegraf/session')
const commonController = require('./controllers/commonController')
const mainMenuController = require('./controllers/mainMenuController')
const plantsMenuController = require('./controllers/plantsMenuController')
const timeMenuController = require('./controllers/timeMenuController')
const plantController = require('./controllers/plantController')
const setTimeController = require('./controllers/setTimeController')
const { checkCorrectConfig } = require('./config/checkCorrectConfig')
const config = require('dotenv').config()

checkCorrectConfig(config.parsed)

const stage = new Stage()
const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
bot.catch(err => console.log(err))
bot.use(session())
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
plantsMenu.hears(/Изменить время полива/, plantsMenuController.changePlantPeriod)
plantsMenu.hears(/Назад/, commonController.goToMainMenu)
plantsMenu.on('callback_query', plantController.deletePlant)
plantsMenu.use(commonController.errorCommand)

const timeMenu = new Scene('time-menu')
timeMenu.hears(/Настроить время уведомления/, timeMenuController.goToSetTime)
timeMenu.hears(/Назад/, commonController.goToMainMenu)
timeMenu.use(timeMenuController.wrongTimeFormat)

const addPlant = new Scene('add-plant')
addPlant.enter(plantController.enter)
addPlant.hears(/Назад/, commonController.goToMainMenu)
addPlant.hears(/[a-z]+|[а-я]+/i, plantController.getPlantName)
addPlant.on('callback_query', plantController.getWateringPeriod)

const setTime = new Scene('set-time')
setTime.enter(setTimeController.enter)
setTime.hears(/[\d]+:\d\d/, setTimeController.getTimeNotify)
setTime.use(setTimeController.getTimezone)

stage.register(mainMenu, plantsMenu, timeMenu, addPlant, setTime)

console.log('PlantsBot успешно запущен')