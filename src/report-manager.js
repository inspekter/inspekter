'use strict';

const reporters = require('./reporters')

function aggregateReports() {

}

module.exports.analyse = (files) => {
  const deferred = q.defer()

  let report = {
    unsupported: []
  }

  let isSupported = false

  for (let extension in files) {
    isSupported = reporters.isSupported(extension)

    if (isSupported) {

    } else {
      console.error('unsupported file extension:', extension)
      report.unsupported.concat(files[extension])
    }
  }

  return deferred.promise
}
