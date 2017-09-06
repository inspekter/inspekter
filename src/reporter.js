'use strict';

const q = require('q')

// TODO: change to regexp-module-loader
const REPORTER_EXTENSION = {
  'js': require('./reporters/javascript.js')
}

function isFileExtensionSupported (fileExtension) {
  return !!REPORTER_EXTENSION[fileExtension]
}

// TODO: might want to remove this promise :)
module.exports.analyse = (files) => {
  console.log('reporter#analyse()')
  const deferred = q.defer()

  let report = {
    unsupported: [],
    reports: []
  }

  let isSupported = false
  let result
  
  for (let extension in files) {
    isSupported = isFileExtensionSupported(extension)
    
    // TODO: replace this with a stream for each report
    if (isSupported) {
      result = REPORTER_EXTENSION[extension].analyse(files[extension])
      report.reports = report.reports.concat(result)
    } else {
      report.unsupported.concat(files[extension])
    }
  }
  
  deferred.resolve(report);

  return deferred.promise
}
