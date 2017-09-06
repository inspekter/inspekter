'use strict';

const fileManager = require('./file-manager.js')
const reporter = require('./reporter.js')
const q = require('q')

module.exports.analyse = (source, options) => {
  console.log('kant#analyse()', source, options)
  const deferred = q.defer()

  // TODO: switch to streams instead of promises
  fileManager.parseFiles(source, options)
    .then((result) => {
      // console.log('result', result)

      return reporter.analyse(result)
    })
    .then((report) => {
      console.log('report', report)
      deferred.resolve(report)
    })
    .catch((error) => {
      deferred.reject(error)
    })

  return deferred.promise
}
