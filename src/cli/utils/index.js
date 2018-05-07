'use strict'

// Colors used in the terminal to display severity of a metric
module.exports.COLORS = {
  GREEN: 'green',
  RED: 'red',
  YELLOW: 'yellow',
  WHITE: 'white'
}

module.exports.SEVERITY = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3
}

module.exports.getAverage = (array) => {
  const sum = array.reduce((a, b) => {
    return a + b
  })

  return sum / array.length
}
