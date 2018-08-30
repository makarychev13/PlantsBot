'use strict'

const https = require('https')
const http = require('http')
const { stringify } = require('querystring')
require('dotenv').config()

async function getTimeZoneByString(placeName) {
    const coordinates = await _getCoordinatesFromAddress(placeName)
    if (!coordinates) {
        throw new Error(`Не удалось узнать координаты города ${placeName}`)
    }
    const timezone = await _getTimeZoneByCoord(coordinates.lat, coordinates.lng)
    if (!timezone) {
        throw new Error(`Не удалось узнать часовой пояс по координатам ${coordinates}`)
    }

    return timezone
}

async function _getCoordinatesFromAddress(addressString) {
    const queryParams = stringify({geocode: addressString, format: 'json'})
    const url = `https://geocode-maps.yandex.ru/1.x/?${queryParams}`

    const resultsFromApi = JSON.parse(await _getJsonFromUrl(url)).response.GeoObjectCollection.featureMember
    let coordinates
    if (resultsFromApi && resultsFromApi.length > 0) {
        const coordinatesArray = resultsFromApi[0].GeoObject.Point.pos.split(' ')
        coordinates = {
            lat: coordinatesArray[1],
            lng: coordinatesArray[0]
        }
    }

    return coordinates
}

async function _getTimeZoneByCoord(lat, lng, username = process.env.GEONAMES_USER) {
    const queryParams = stringify({ lat, lng, username })
    const url = `http://api.geonames.org/timezoneJSON?${queryParams}`
    
    const json = JSON.parse(await _getJsonFromUrl(url, http.request))
    let timeZone
    if (json && json.gmtOffset) {
        timeZone = parseInt(json.gmtOffset)
    }

    return timeZone
}

function _getJsonFromUrl(url, request = https.request) {
    return new Promise((resove, reject) => {
        const requestTask = request(url, res => {
            let data = []
            res.on('data', chunk => data.push(chunk))
            res.on('end', () => resove(Buffer.concat(data).toString()))
        })
    
        requestTask.on('error', err => reject(err))
        requestTask.end()
    })
}

module.exports = {
    getTimeZoneByString
}