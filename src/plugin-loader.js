'use strict'

const rrequire = require('./package-loader.js')

const DEFAULT_REGEXP = /^inspekter-plugin-/

function mapPluginsByExtension (modules) {
  let plugins = {}
  let extension

  for (let key in modules) {
    extension = modules[key].getExtension()
    plugins[extension] = modules[key]
  }

  return plugins
}

module.exports.loadPlugins = (regexp, callback) => {
  rrequire(regexp || DEFAULT_REGEXP, {}, (error, modules) => {
    if (error) {
      callback(error)
    } else {
      const plugins = mapPluginsByExtension(modules)
      callback(null, plugins)
    }
  })
}
