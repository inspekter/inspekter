'use strict'

const packageLoader = require('./package-loader')

const DEFAULT_REGEXP = /^inspekter-plugin-/

function mapPluginsByExtension (modules) {
  let plugins = {}

  for (let key in modules) {
    const extension = modules[key].extension
    plugins[extension] = modules[key]
  }

  return plugins
}

module.exports.loadPlugins = (regexp, callback) => {
  packageLoader(regexp || DEFAULT_REGEXP, {}, (error, modules) => {
    if (error) {
      return callback(error)
    }

    const plugins = mapPluginsByExtension(modules)
    return callback(null, plugins)
  })
}
