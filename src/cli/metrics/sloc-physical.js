'use strict'

const utils = require('../utils')

const SEVERITY = utils.SEVERITY

module.exports = class SlocPhysical {
  constructor (report) {
    this.name = 'sloc physical'
    this.value = report.sloc.physical
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
