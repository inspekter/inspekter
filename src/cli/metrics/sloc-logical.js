'use strict'

const utils = require('../utils')

const SEVERITY = utils.SEVERITY

module.exports = class SlocLogical {
  constructor (report) {
    this.name = 'sloc logical'
    this.value = report.sloc.logical
  }

  getSeverity () {
    return SEVERITY.NONE
  }

  getName () {
    return this.name
  }

  getValue (average) {
    return (average ? utils.getAverage(this.value) : this.value)
  }
}
