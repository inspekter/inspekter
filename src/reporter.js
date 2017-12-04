'use strict'

const q = require('q')
const pluginLoader = require('./plugin-loader.js')

function getReporter (plugins, extension) {
  if (typeof plugins === 'object' && typeof extension === 'string') {
    return plugins[extension]
  }

  return undefined
}

module.exports.analyze = (files, callback) => {
  pluginLoader.loadPlugins(null, (error, plugins) => {
    if (error) {
      callback(error)
    } else {
      let report = {
        unsupported: [],
        reports: []
      }

      let reporter
      let result

      for (let extension in files) {
        reporter = getReporter(plugins, extension)

        if (reporter) {
          result = reporter.analyze(files[extension])
          report.reports = report.reports.concat(result)
        } else {
          report.unsupported.concat(files[extension])
        }
      }

      callback(null, report)
    }
  })
}
