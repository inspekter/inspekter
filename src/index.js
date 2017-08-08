'use strict';

const fileManager = require('./file-manager.js')
const reportManager = require('./report-manager.js')
const q = require('q')

module.exports.analyse = (source, options) => {
  console.log('analyse()', source, options)
  const deferred = q.defer()

  fileManager.parseFiles(source, options)
    .then((result) => {
      console.log('result', result)

      return reportManager.analyse(result)
    })
    .then((report) => {
      console.log('report', report)
      deferred.resolve(report)
    })
    .catch((error) => {
      deferred.reject(error)
    })

  // TODO: select reporters

  // TODO: aggregate reporters

  // TODO: save report

  return deferred.promise
}
