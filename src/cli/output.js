'use strict'

const chalk = require('chalk')
const fs = require('fs')
const Table = require('cli-table')

module.exports.FORMATS = {
  CONSOLE: 'console',
  JSON: 'json',
  HTML: 'html'
}

module.exports.console = (report) => {
  let table

  report.reports.forEach((item) => {
    table = new Table()

    table.push(

      // File
      { 'File': `${chalk.green(item.file.name)}` },
      { 'Path': `${chalk.green(item.file.path)}` },

      // Maintainability
      { 'Maintainability': `${chalk.blue(item.maintainability)}` },

      // Lines of code
      { 'Logical lines of code': `${chalk.blue(item.sloc.logical)}` },
      { 'Physical lines of code': `${chalk.blue(item.sloc.physical)}` },

      // Cyclomatic complexity
      { 'Cyclomatic complexity': `${chalk.blue(item.cyclomatic)}` },

      // Cyclomatic Density
      { 'Cyclomatic density': `${chalk.blue(item.cyclomaticDensity)}` },

      // Halstead
      { 'Length': `${chalk.blue(item.halstead.length)}` },
      { 'Vocabulary': `${chalk.blue(item.halstead.vocabulary)}` },
      { 'Difficulty': `${chalk.blue(item.halstead.difficulty)}` },
      { 'Volume': `${chalk.blue(item.halstead.volume)}` },
      { 'Effort': `${chalk.blue(item.halstead.effort)}` },
      { 'Bugs': `${chalk.blue(item.halstead.bugs)}` },
      { 'Time': `${chalk.blue(item.halstead.time)}` }
    )

    console.log(table.toString())
  })
}

module.exports.html = () => {
  // TODO
}

module.exports.json = (report, destination) => {
  const output = JSON.stringify(report, null, 2)
  fs.writeFile(destination, output)
}
