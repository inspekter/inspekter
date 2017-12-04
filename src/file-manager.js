'use strict'

const glob = require('glob')
const path = require('path')
const q = require('q')

function aggregateFilesByExtension(files) {
  let aggregatedFiles = {}
  let extension = null

  files.forEach((file) => {
    extension = path.extname(file)

    if (extension) {
      extension = extension.replace('.', '')

      if (typeof aggregatedFiles[extension] === 'undefined') {
        aggregatedFiles[extension] = []
      }
      let fullPath = path.resolve(file)
      aggregatedFiles[extension].push(fullPath)
    }
  })

  return aggregatedFiles
}

function getFiles(source, options) {
  const deferred = q.defer()
  // glob(source, options, (error, files) => {
  console.log('source', source)
  const pattern = source[0]// + '/**/*'
  console.log('pattern', pattern)
  glob(pattern, options, (error, files) => {
    if (error) {
      deferred.reject(error)
    } else {
      deferred.resolve(files)
    }
  })

  return deferred.promise
}

module.exports.parseFiles = (source, options) => {
  let deferred = q.defer()

  getFiles(source, options)
    .then((files) => {
      const aggregatedFiles = aggregateFilesByExtension(files)
      console.log('aggregatedFiles', aggregatedFiles)
      deferred.resolve(aggregatedFiles)
    })
    .catch((error) => {
      deferred.reject(error)
    })

  return deferred.promise
}
