'use strict'

const cron = require('node-cron')

function createTask(timeString, cronCallback) {
    const indexOfColon = timeString.indexOf(':')
    const minute = parseInt(timeString.substr(indexOfColon + 1, 2))
    let hour = parseInt(timeString.substr(0, indexOfColon))
    cron.schedule(`${minute} ${hour} * * *`, cronCallback)
}

module.exports = {
    createTask
}