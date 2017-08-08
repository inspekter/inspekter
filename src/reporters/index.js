'use strict';

const REPORTER_EXTENSION = {
  'js': require('./javascript.js')
}

module.exports.isSupported = (fileExtension) => {
  return !typeof REPORTER_EXTENSION[fileExtension] === 'undefined'
}
