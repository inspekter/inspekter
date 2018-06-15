'use strict'

module.exports.REPORTERS = {
  JSON: 'json',
  TERMINAL: 'terminal',
  ALL: 'all'
}

module.exports.terminal = require('./terminal')

module.exports.json = require('./json')
