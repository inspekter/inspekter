'use strict'

const chalk = require('chalk')
const program = require('commander')
const columnify = require('columnify')
const inspekter = require('../index.js')
const output = require('./output')

const VERSION = require('../../package.json').version
const REPORTERS = output.REPORTERS

const METRICS_DESCRIPTION = [
  ['Maintainability', 'Represents how easy to support and change the code is. Higher values are better.'],
  ['SLoC logical', 'Number of logical lines of code.'],
  ['SLoC physical', 'Number of physical lines of code.'],
  ['Volume', 'Halstead\'s volume metric describes the size of the implementation. It\'s based on the number of operations performed and operands handled in the algorithm.'],
  ['Complexity', 'Cyclomatic complexity represents the number of distinct paths in the program. Lower values are better.'],
  ['Difficulty', 'Difficulty level to write and understand the program.'],
  ['Estimated errors', 'Halstead\'s delivered bugs metric. It\'s an estimate of errors in the implementation.']
]

function filter (report, options) {
  if (options.summary || options.group) {
    return Array.isArray(report.aggregated) ? report.aggregated : [report.aggregated]
  } else {
    return report.items
  }
}

function printMetricsHelp () {
  const data = METRICS_DESCRIPTION.map(item => {
    return {
      metric: item[0],
      description: item[1]
    }
  })

  const options = {
    showHeaders: false,
    truncate: false,
    config: {
      metric: {
        maxWidth: 20,
        dataTransform: data => {
          return chalk.white.bold(data)
        }
      },
      description: {
        maxWidth: 60
      }
    }
  }

  console.log(columnify(data, options))
}

function run () {
  if (program.metrics) {
    return printMetricsHelp()
  }

  if (program.args.length < 2) {
    return console.log(program.helpInformation())
  }

  const args = program.args.slice(0, program.args.length - 1)

  const options = {
    ignore: program.ignore || null,
    group: program.group,
    reporter: program.reporter,
    summary: program.summary
  }

  inspekter.analyze(args, options)
    .then((report) => {
      return writeOutput(report, options)
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

function writeOutput (report, options) {
  const items = filter(report, options)

  switch (options.reporter) {
    case REPORTERS.JSON:
      output.json(items, options, 'report.json')
      break

    case REPORTERS.ALL:
      output.json(items, options, 'report.json')
      output.terminal(items, options)
      break

    default:
      output.terminal(items, options)
  }
}

program
  .version(VERSION, '-v, --version')
  .usage('[options] <(file|glob) ...>')
  .option('-s, --summary', 'display a summarized report')
  .option('-g, --group', 'display a summarized report grouped by directory')
  .option('-r, --reporter <REPORTER>', 'specify a reporter (terminal|json|all), default is terminal')
  .option('--metrics', 'show a description of available metrics')

program.parse(process.argv)

run()
