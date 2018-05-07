'use strict'

const utils = require('../utils')

const SEVERITY = utils.SEVERITY

module.exports = class Complexity {
  constructor (report) {
    this.name = 'complexity'
    this.value = report.cyclomatic
  }

  getSeverity (value) {
    if (value <= 5) {
      return SEVERITY.LOW
    }

    if (value <= 9) {
      return SEVERITY.MEDIUM
    }

    return SEVERITY.HIGH
  }

  getName () {
    return this.name
  }

  getValue (average) {
    return (average ? utils.getAverage(this.value) : this.value)
  }
}
