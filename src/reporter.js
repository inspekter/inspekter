'use strict'

const path = require('path')
const pluginLoader = require('./plugin-loader.js')

function aggregateByDirectories (reports) {
  let directories = {}
  let dirName;

  reports.forEach((report) => {
    dirName = path.dirname(report.file.path)

    if (!directories[dirName]) {
      directories[dirName] = []
    }

    directories[dirName].push(report)
  })

  return directories
}

function aggregate (reports) {
  let aggregated = {}
  let directories = aggregateByDirectories(reports);

  for (let key in directories) {
    let length = directories[key].length

    let aggregatedReport = {
      cyclomatic: 0,
      file: {
        path: key,
        total: length
      },
      cyclomaticDensity: 0,
      halstead: {
        bugs: 0,
        difficulty: 0,
        effort: 0,
        length: 0,
        time: 0,
        vocabulary: 0,
        volume: 0
      },
      maintainability: 0,
      sloc: {
        logical: 0,
        physical: 0
      }
    }

    directories[key].forEach((report) => {
      aggregatedReport.cyclomatic += report.cyclomatic
      aggregatedReport.cyclomaticDensity += report.cyclomaticDensity
      aggregatedReport.halstead.bugs += report.halstead.bugs
      aggregatedReport.halstead.difficulty += report.halstead.difficulty
      aggregatedReport.halstead.effort += report.halstead.effort
      aggregatedReport.halstead.length += report.halstead.length
      aggregatedReport.halstead.time += report.halstead.time
      aggregatedReport.halstead.vocabulary += report.halstead.vocabulary
      aggregatedReport.halstead.volume += report.halstead.volume
      aggregatedReport.maintainability += report.maintainability
      aggregatedReport.sloc.logical += report.sloc.logical
      aggregatedReport.sloc.physical += report.sloc.physical
    })

    aggregatedReport.cyclomatic = aggregatedReport.cyclomatic / length
    aggregatedReport.cyclomaticDensity = aggregatedReport.cyclomaticDensity / length
    aggregatedReport.halstead.bugs = aggregatedReport.halstead.bugs / length
    aggregatedReport.halstead.difficulty = aggregatedReport.halstead.difficulty / length
    aggregatedReport.halstead.effort = aggregatedReport.halstead.effort / length
    aggregatedReport.halstead.length = aggregatedReport.halstead.length / length
    aggregatedReport.halstead.time = aggregatedReport.halstead.time / length
    aggregatedReport.halstead.vocabulary = aggregatedReport.halstead.vocabulary / length
    aggregatedReport.halstead.volume = aggregatedReport.halstead.volume / length
    aggregatedReport.maintainability = aggregatedReport.maintainability / length
    aggregatedReport.sloc.logical = aggregatedReport.sloc.logical / length
    aggregatedReport.sloc.physical = aggregatedReport.sloc.physical / length

    aggregated[key] = aggregatedReport
  }

  return aggregated
}

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

      report.aggregate = aggregate(report.reports)

      callback(null, report)
    }
  })
}
