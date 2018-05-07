'use strict'

const utils = require('../utils')

const SEVERITY = utils.SEVERITY

module.exports = class Maintainability {
  constructor (report) {
    this.name = 'maintainability'
    this.value = report.maintainability
  }

  getSeverity (value) {
    if (value < 65) {
      return SEVERITY.HIGH
    }

    if (value >= 65 && value <= 85) {
      return SEVERITY.MEDIUM
    }

    return SEVERITY.LOW
  }

  getName () {
    return this.name
  }

  getValue (average) {
    return (average ? utils.getAverage(this.value) : this.value)
  }
}
