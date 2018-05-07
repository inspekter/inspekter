'use strict'

const utils = require('../utils')

const SEVERITY = utils.SEVERITY

module.exports = class Volume {
  constructor (report) {
    this.name = 'volume'
    this.value = report.halstead.volume
  }

  getSeverity (value) {
    // The volume of a file should be at least 100 and at most 8000
    if (value > 8000) {
      return SEVERITY.HIGH
    }

    if (value <= 8000 && value >= 3000) {
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
