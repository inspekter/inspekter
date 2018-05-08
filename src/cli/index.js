'use strict'

const program = require('commander')
const inspekter = require('../index.js')
const output = require('./output')

const VERSION = require('../../package.json').version
const REPORTERS = output.REPORTERS

program
  .version(VERSION, '-v, --version')
  .usage('[options] <file ...>')
  // .option('-d, --dest <path>', 'Destination path for the report output')
  .option('-s, --summary', 'display a summarized report')
  .option('-g, --group', 'display a summarized report grouped by directory')
  .option('-r, --reporter <REPORTER>', 'specify a reporter (defaul: terminal)')

program
  .command('metrics')
  .description('list available metrics')
  .action(() => {
    return printMetrics()
  })

program
  .command('*')
  .action(() => {
    run()
  })

program.parse(process.argv)

function printMetrics () {

}

function run () {
  if (program.args.length < 2) {
    return console.error('ERROR: Expected at least one file, received none.')
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

function filter (report, options) {
  if (options.summary || options.group) {
    return Array.isArray(report.aggregated) ? report.aggregated : [report.aggregated]
  } else {
    return report.items
  }
}

function writeOutput (report, options) {
  let items = filter(report, options)

  switch (options.reporter) {
    case REPORTERS.JSON:
      output.json(items, options, 'report.json')
      break

    case REPORTERS.HTML:
      // TODO
      break

    case REPORTERS.ALL:
      output.json(items, options, 'report.json')
      output.terminal(items, options)
      break

    default:
      output.terminal(items, options)
  }
}
