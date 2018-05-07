'use strict'

const fileManager = require('./file-manager.js')
const reporter = require('./reporter.js')
const q = require('q')

module.exports.analyze = (source, options) => {
  const deferred = q.defer()
  const files = fileManager.parseFiles(source, options)

  reporter.analyze(files, options, (error, report) => {
    if (error) {
      return deferred.reject(error)
    }

    return deferred.resolve(report)
  })

  return deferred.promise
}
