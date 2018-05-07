'use strict'

module.exports.REPORTERS = {
  JSON: 'json',
  HTML: 'html',
  TERMINAL: 'terminal'
}

module.exports.terminal = require('./terminal')

module.exports.html = require('./html')

module.exports.json = require('./json')
