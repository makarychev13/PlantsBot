const { createLogger, format, transports } = require('winston')
const { combine, label, prettyPrint } = format

function loggerFactory(labelName) {
    const logger = createLogger({
        format: combine(
            label({ label: labelName }),
            prettyPrint()
        ),
        transports: [
            new transports.Console()
        ]
    })

    return logger
}

module.exports = {
    loggerFactory
}