'use strict'

const path = require('path')

function addFile (fileDictionary, extension, file) {
  if (typeof fileDictionary[extension] === 'undefined') {
    fileDictionary[extension] = []
  }

  let fullPath = path.resolve(file)
  fileDictionary[extension].push(fullPath)

  return fileDictionary
}

function aggregateFilesByExtension (files) {
  let aggregatedFiles = {}
  let extension = null

  files.forEach((file) => {
    extension = path.extname(file)

    if (extension) {
      extension = extension.replace('.', '')

      aggregatedFiles = addFile(aggregatedFiles, extension, file)
    }
  })

  return aggregatedFiles
}

module.exports.parseFiles = (files, options) => {
  const aggregatedFiles = aggregateFilesByExtension(files)

  return aggregatedFiles
}
