'use strict'

const { CronJob } = require('cron')

function createTask(timeString, cronCallback, runOnInit = true, cronCompleteCallback = null) {
    const indexOfColon = timeString.indexOf(':')
    const minute = parseInt(timeString.substr(indexOfColon + 1, 2))
    let hour = parseInt(timeString.substr(0, indexOfColon))
    const time = `* ${minute} ${hour} * * *`
    new CronJob({
        cronTime: time,
        onTick: function() {
            cronCallback()
            this.stop()
        },
        onComplete: () => {
            if (cronCompleteCallback) {
                cronCompleteCallback()
            }
        },
        start: true,
        timeZone: 'Atlantic/Azores',
        runOnInit : runOnInit
    })
}

module.exports = {
    createTask
}