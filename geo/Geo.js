'use strict'

const { request } = require('https')

class GoogleGeoApi {
    constructor(keyGeo, keyTime, language='ru') {
        this._keyGeo = keyGeo
        this._keyTime = keyTime
        this._language = language
        this._optionsRequest = {
            hostname: 'maps.googleapis.com',
            port: 443,
            method: 'POST'
        }
    }

    async getTimeZoneByString(placeName) {
        const coordinates = await this.getGeoCode(placeName)
        const timeZone = await this.getTimeZoneByCoord(coordinates.lat, coordinates.lng)
        
        return timeZone
    }

    async getGeoCode(placeName) {
        const options = this._optionsRequest
        const editPlaceName = placeName.replace(/ /g, '+')
        options.path = `https://maps.googleapis.com/maps/api/geocode/json?address=${editPlaceName}&key=${this._keyGeo}`
        const resultFromGeocodeApi = await this._sendHttpsRequest(options)
        let result = JSON.parse(resultFromGeocodeApi.toString())
        return result.results[0].geometry.bounds.northeast
    }

    async getTimeZoneByCoord(lat, lng) {
        const options = this._optionsRequest
        const time = (new Date()).getTime()/1000
        options.path = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${time}&key=${this._keyTime}`
        const resultFromTimezoneApi = await this._sendHttpsRequest(options)
        return JSON.parse(resultFromTimezoneApi.toString()).rawOffset / 3600
    }

    _sendHttpsRequest(options) {
        return new Promise((resolve, reject) => {
            const requestTask = request(options, res => {
                let data = []
                res.on('data', chunk => data.push(chunk))
                res.on('end', () => resolve(Buffer.concat(data)))
            })

            requestTask.on('error', err => reject(err))
            requestTask.end()
        })
    }
}

module.exports = {
    GoogleGeoApi
}