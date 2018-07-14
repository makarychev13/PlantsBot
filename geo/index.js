'use strict'

const { GoogleGeoApi } = require('./Geo')
require('dotenv').config()
const geo = new GoogleGeoApi(process.env.GEOCODE_KEY, process.env.TIMEZONE_KEY)

module.exports = {
    geo
}