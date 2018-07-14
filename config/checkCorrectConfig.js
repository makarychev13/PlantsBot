function checkCorrectConfig(config) {
    if (!config) {
        throw new Error('Создайте в корне проекта файл .env с необходимыми конфигами')
    }

    const needFields = ['TELEGRAM_TOKEN', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE']
    const configFields = Object.keys(config)
    const missingFields = []
    for (const needField of needFields) {
        if (!configFields.includes(needField)) {
            missingFields.push(needField)
        }
    }

    if (missingFields.length > 0) {
        throw new Error(`В файле .env отсутствуют поля ${missingFields.toString()}`)
    }
}

module.exports = {
    checkCorrectConfig
}