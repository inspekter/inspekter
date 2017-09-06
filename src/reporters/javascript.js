'use strict'

const escomplex = require('escomplex')
const path = require('path')

module.exports.analyse = (source, options) => {
  console.log('javascript#analyse()')
  
  const reports = []
  let report
  
  if (Array.isArray(source)) {
    source.forEach((filePath) => {
      
      // TODO: sanitize report output
      report = escomplex.analyse(filePath)
      report.meta = {
        fileName: path.basename(filePath),
        filePath: filePath
      }
      
      console.log('javascript#analyse() file', filePath)
      reports.push(report)
    })
  }

  return reports;
}
