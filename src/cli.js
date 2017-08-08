#!/usr/bin/env node

'use strict';

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

  kant.analyse(program.args, options)
}
