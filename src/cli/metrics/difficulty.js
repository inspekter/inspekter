'use strict'

const utils = require('../utils')

const SEVERITY = utils.SEVERITY

module.exports = class Difficulty {
  constructor (report) {
    this.name = 'difficulty'
    this.value = report.halstead.difficulty
  }

  getSeverity () {
    return SEVERITY.NONE
  }

  getName () {
    return `${this.name} (less is better)`
  }

  getValue (average) {
    return (average ? utils.getAverage(this.value) : this.value)
  }
}
