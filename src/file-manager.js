'use strict';

const glob = require('glob')
const path = require('path')
const q = require('q')

function aggregateByExtension(files) {
  let aggregatedFiles = {}
  let extension = null

  files.forEach((file) => {
    extension = path.extname(file)

    if (extension) {
      extension = extension.replace('.', '')

      if (typeof aggregatedFiles[extension] === 'undefined') {
        aggregatedFiles[extension] = []
      }

      aggregatedFiles[extension].push(file)
    }
  })

  return aggregatedFiles
}

function getFiles(source, options) {
  const deferred = q.defer()

  glob(source + '/**/*', options, (error, files) => {
    error ? deferred.reject(error) : deferred.resolve(files)
  })

  return deferred.promise
}

module.exports.parseFiles = (source, options) => {
  let deferred = q.defer()

  getFiles(source, options)
    .then((files) => {
      const result = aggregateByExtension(files)
      deferred.resolve(result)
    })
    .catch((error) => {
      deferred.reject(error)
    })

  return deferred.promise
}
