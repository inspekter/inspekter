'use strict'

const fs = require('fs')

module.exports = (report, options, destination) => {
  const data = options.summary ? report.aggregate : report
  const output = JSON.stringify(data, null, 2)

  fs.writeFile(destination, output)
}
