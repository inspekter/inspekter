'use strict'

const chalk = require('chalk')
const columnify = require('columnify')
const sparkly = require('sparkly')
const utils = require('../utils')

const COLORS = utils.COLORS
const SEVERITY = utils.SEVERITY

// List of supported metrics
const Metrics = require('../metrics')

function getColumns (data, options) {
  const isAggregated = !!(options.summary || options.group)

  return columnify(data, {
    minWidth: 20,
    truncate: true,
    config: {
      metric: {
        showHeaders: false
      },
      value: {
        maxWidth: 10,
        showHeaders: isAggregated,
        headingTransform: (heading) => {
          if (isAggregated) {
            return 'avg'
          }
          return heading.toLowerCase()
        }
      },
      sparkline: {
        maxWidth: 50,
        showHeaders: false
      },
      minmax: {
        align: 'left',
        headingTransform: () => {
          return 'min/max'
        }
      }
    }
  })
}

function getRow (Metric, report, options) {
  const isAggregated = !!(options.summary || options.group)
  const metric = new Metric(report)
  const name = metric.getName(isAggregated)
  const value = metric.getValue(isAggregated).toFixed(2)

  // Severity is may be LOW, MEDIUM or HIGH and it's based on recommended
  // values by the community. It serves only as a guide and should not be taken
  // strictly since it does not take the context of codebase/project/team in
  // consideration
  const severity = metric.getSeverity(value)

  // Pick a color to highlight the metric name based on its value severity
  const color = getSeverityColor(severity)

  let row = {
    metric: name,
    value: chalk[color](value)
  }

  // Add the sparkline and min/max columns if the this is a summarized report
  if (isAggregated) {

    // This is an array of values
    const values = metric.getValue()
    const min = Math.min.apply(null, values).toFixed(2)
    const max = Math.max.apply(null, values).toFixed(2)

    row.sparkline = sparkly(values)
    row.minmax = `${min}/${max}`
  }

  return row
}

function getSeverityColor (severity) {
  switch (severity) {
    case (SEVERITY.LOW):
      return COLORS.GREEN

    case SEVERITY.MEDIUM:
      return COLORS.YELLOW

    case SEVERITY.HIGH:
      return COLORS.RED

    default:
      return COLORS.WHITE
  }
}

function printHeader (report, options) {
  if (options.summary || options.group) {
    console.log(`${chalk.white.bold.underline(report.meta.path)} (${report.meta.total} files)`)
  } else {
    console.log(chalk.white.bold.underline(report.file.path));
  }
}

module.exports = (items, options) => {
  let columns

  items.forEach((item, index, array) => {
    const rows = Metrics.map(Metric => {
      return getRow(Metric, item, options)
    })

    printHeader(item, options)

    columns = getColumns(rows, options)

    // Print metrics
    console.log(columns)

    // Add a sepator
    if (index < array.length - 1) {
      console.log('\n')
    }
  })
}
