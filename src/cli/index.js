'use strict'

const program = require('commander')
const inspekter = require('../index.js')
const output = require('./output.js')

const VERSION = require('../../package.json').version

program
  .version(VERSION)
  .usage('[options] <file>')
  .option('-d --dest <dest>', 'Destination folder for the report output')
  .option('-i --ignore <ignore>', 'Pattern to ignore')
  .option('-o --output <format>', 'Output format json|html|console')
  .parse(process.argv)

function writeOutput (report, format) {
  switch (format) {
    case output.FORMATS.JSON:
      output.json(report, 'report.json')
      break

    case output.FORMATS.HTML:
      // TODO
      break

    default:
      output.console(report)
  }
}

if (program.args.length === 0) {
  console.error('ERROR: You must provide at least one file.')
} else {
  let options = {
    ignore: program.ignore || null
  }

  inspekter.analyse(program.args, options)
    .then((report) => {
      writeOutput(report, options.format, options.dest)
    })
    .catch((error) => {
      console.error(error)
    })
}
