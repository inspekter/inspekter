'use strict'

const utils = require('../utils')

const SEVERITY = utils.SEVERITY

module.exports = class Bugs {
  constructor (report) {
    this.name = 'estimated errors'
    this.value = report.halstead.bugs
  }

  getSeverity (value) {
    // Delivered bugs in a file should be less than 2
    if (value >= 2) {
      return SEVERITY.HIGH
    }

    if (value >= 0.5) {
      return SEVERITY.MEDIUM
    }

    return SEVERITY.LOW
  }

  getName (isSummary) {
    return isSummary ? `${this.name} (per file)` : 'estimated errors'
  }

  getValue (average) {
    return (average ? utils.getAverage(this.value) : this.value)
  }
}
