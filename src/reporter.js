'use strict'

const commonPathPrefix = require('common-path-prefix')
const path = require('path')
const pluginLoader = require('./plugin-loader.js')

function aggregateByDir (_aggregated, reports) {
  let directories = {}
  let dirName;

  reports.forEach((report) => {
    dirName = path.dirname(report.file.path)

    if (!directories[dirName]) {
      directories[dirName] = []
    }

    directories[dirName].push(report)
  })


  return Object.keys(directories).map(k => {
    let aggregated = JSON.parse(JSON.stringify(_aggregated))
    aggregated.meta.total = directories[k].length
    aggregated.meta.path = k
    return aggregate(aggregated, directories[k])
  })
}

function aggregate (aggregated, items) {
  items.forEach(item => {
    aggregated.cyclomatic.push(item.cyclomatic)
    aggregated.halstead.bugs.push(item.halstead.bugs)
    aggregated.halstead.difficulty.push(item.halstead.difficulty)
    aggregated.halstead.volume.push(item.halstead.volume)
    aggregated.maintainability.push(item.maintainability)
    aggregated.sloc.logical.push(item.sloc.logical)
    aggregated.sloc.physical.push(item.sloc.physical)
  })

  return aggregated
}

function getReporter (plugins, extension) {
  if (typeof plugins === 'object' && typeof extension === 'string') {
    return plugins[extension]
  }

  return null
}

module.exports.analyze = (source, options, callback) => {
  pluginLoader.loadPlugins(null, (error, plugins) => {
    if (error) {
      return callback(error)
    }

    let items = []
    let files = []

    for (let extension in source) {
      let reporter = getReporter(plugins, extension)

      if (reporter) {
        let item = reporter.analyze(source[extension])
        items.push(item)
        files.push(source[extension])
      }
    }

    files = files.reduce((a, b) => a.concat(b), [])

    let report = {
      items: items.reduce((a, b) => a.concat(b), [])
    }

    let aggregated = {
      cyclomatic: [],
      halstead: {
        bugs: [],
        difficulty: [],
        volume: []
      },
      maintainability: [],
      sloc: {
        logical: [],
        physical: []
      },
      meta: {
        total: null
      }
    }

    // Group by directory takes precedence over summarized report
    if (options.group) {
      aggregated = aggregateByDir(aggregated, report.items)
    } else if (options.summary) {
      aggregated.meta.path = commonPathPrefix(files)
      aggregated.meta.total = report.items.length
      aggregated = aggregate(aggregated, report.items)
    }
    
    report.aggregated = aggregated

    return callback(null, report)
  })
}
