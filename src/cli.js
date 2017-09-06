#!/usr/bin/env node

'use strict'

const fs = require('fs')
const kant = require('./index.js')
const program = require('commander')

program
  .version('1.0.0')
  .usage('[options] <file>')
  .option('-d --dest <dest>', 'Destination folder for the report output')
  .option('-i --ignore <ignore>', 'Pattern to ignore')
  .parse(process.argv)

console.log('args: %j', program.args);

if (program.args.length === 0) {
  console.error('ERROR: You must provide at least one file.')
} else {
  let options = {
    ignore: program.ignore || null
  }

  console.log('program.ignore', program.ignore)

  kant.analyse(program.args, options)
    .then((report) => {
      
      // TODO: take params in consideration when writing the output
      const output = JSON.stringify(report, null, 2)
      fs.writeFile('output.json', output)
    })
    .catch((error) => {
      console.error(error)
    })

  // TODO: create a writeable stream
}
