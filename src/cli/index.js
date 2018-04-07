'use strict'

const program = require('commander')
const inspekter = require('../index.js')
const output = require('./output.js')

const VERSION = require('../../package.json').version

program
  .version(VERSION)
  .usage('[options] <file>')
  .option('-d, --dest <path>', 'Destination folder for the report output')
  .option('-i, --ignore <ignore>', 'File or pattern to ignore')
  .option('-o, --output <format>', 'Output format json|html|console')
  .parse(process.argv)

function writeOutput (report, outputFormat) {
  switch (outputFormat) {
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
    ignore: program.ignore || null,
    outputFormat: program.output
  }

  inspekter.analyze(program.args, options)
    .then((report) => {
      writeOutput(report, options.outputFormat, options.dest)
    })
    .catch((error) => {
      console.error(error)
    })
}
