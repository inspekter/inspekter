'use strict'

const fileManager = require('./file-manager.js')
const reporter = require('./reporter.js')
const q = require('q')

module.exports.analyze = (source, options) => {
  const deferred = q.defer()
  const files = fileManager.parseFiles(source, options)

  reporter.analyze(files, (error, report) => {
    if (error) {
      deferred.reject(error)
    } else {
      deferred.resolve(report)
    }
  })

  return deferred.promise
}
