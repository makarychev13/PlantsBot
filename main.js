'use strict'

const Telegraf = require('telegraf')
const Scene = require('telegraf/scenes/base')
const Stage = require('telegraf/stage')
const session = require('telegraf/session')
const commonController = require('./controllers/commonController')
const mainMenuController = require('./controllers/mainMenuController')
const plantsMenuController = require('./controllers/plantsMenuController')
const timeMenuController = require('./controllers/timeMenuController')
const addPlantController = require('./controllers/addPlantController')
const setTimeController = require('./controllers/setTimeController')
require('dotenv').config()

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
plantsMenu.use(commonController.errorCommand)

const timeMenu = new Scene('time-menu')
timeMenu.hears(/Настроить время уведомления/, timeMenuController.goToSetTime)
timeMenu.hears(/Назад/, commonController.goToMainMenu)
timeMenu.use(timeMenuController.wrongTimeFormat)

const addPlant = new Scene('add-plant')
addPlant.hears(/\d+/, addPlantController.getWateringPeriod)
addPlant.use(addPlantController.getPlantName)

const setTime = new Scene('set-time')
setTime.enter(setTimeController.enter)
setTime.hears(/[\d]+:\d\d/, setTimeController.getTimeNotify)
setTime.hears(/\W+/, setTimeController.getTimezone)

const stage = new Stage()
stage.register(mainMenu)
stage.register(plantsMenu)
stage.register(timeMenu)
stage.register(addPlant)
stage.register(setTime)

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
bot.use(session())
bot.use(stage.middleware())
bot.start(commonController.startReply)
bot.startPolling()

console.log('PlantsBot успешно запущен')