'use strict'

const chalk = require('chalk')
const fs = require('fs')
const Table = require('cli-table')

module.exports.FORMATS = {
  CONSOLE: 'console',
  JSON: 'json',
  HTML: 'html'
}

module.exports.console = (report, isFullReport) => {
  let table
  let rows

  const target = isFullReport ? report.reports : Object.keys(report.aggregate).map((k) => report.aggregate[k])

  target.forEach((item) => {
    table = new Table()

    const fileOrDirectory = {}
    const pathOrTotal = {}

    if (isFullReport) {
      fileOrDirectory['File'] = `${chalk.green(item.file.name)}`
      pathOrTotal['Path'] = `${chalk.green(item.file.path)}`
    } else {
      fileOrDirectory['Directory'] = `${chalk.green(item.file.path)}`
      pathOrTotal['Number of files'] = `${chalk.green(item.file.total)}`
    }


    table.push(

      // File
      fileOrDirectory,
      pathOrTotal,
      // { 'File': `${chalk.green(item.file.name)}` },
      // { 'Path': `${chalk.green(item.file.path)}` },

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

module.exports.json = (report, isFullReport, destination) => {
  const target = !isFullReport ? report.aggregate : report
  const output = JSON.stringify(target, null, 2)

  fs.writeFile(destination, output)
}
