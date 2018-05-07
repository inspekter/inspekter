'use strict'

const npm = require('npm')
const requireg = require('requireg')

const DEFAULT_OPTIONS = {
  isAsync: false,
  global: true,
  ignoreDev: true
}

function assignOptions (options, defaultOptions) {
  const stringifiedOptions = JSON.stringify(options || {})
  const opts = JSON.parse(stringifiedOptions)

  return Object.assign({}, defaultOptions, opts)
}

function extractModulesFromDependencies (dependencies, isGlobal) {
  const keys = Object.keys(dependencies)

  return keys.map(mapDependencies(isGlobal))
}

function filterModuleNames (regexp, modules) {
  const re = new RegExp(regexp)

  return modules.filter((module) => {
    return re.test(module)
  })
}

function find (regexp, modules) {
  let matches = []
  const regexps = Array.isArray(regexp) ? regexp : [regexp]

  regexps.forEach((regexp) => {
    const results = filterModuleNames(regexp, modules)

    if (results.length > 0) {
      matches = matches.concat(results)
    }
  })

  return matches
}

function loadModules (modules) {
  let result = {}

  modules.forEach((module) => {
    result[module] = requireg(module)
  })

  return result
}

function getModules (options, callback) {
  listInstalledModules({ global: true }, (error, results) => {
    if (error) {
      return callback(error)
    }

    let modules = []

    results.forEach((result) => {
      modules = modules.concat(result.name)
    })

    // Remove possible duplicates
    modules = modules.filter((element, index, self) => {
      return index === self.indexOf(element)
    })

    callback(null, modules)
  })
}

function listInstalledModules (options, callback) {
  const opts = {
    loaded: false,
    progress: false,
    loglevel: 'error',
    global: options.global,
    depth: 0
  }

  npm.load(opts, () => {
    npm.commands.ls([], true, (error, data) => {
      if (error) {
        return callback(error)
      }

      let modules = extractModulesFromDependencies(data.dependencies, options.global)
      callback(null, modules)
    })
  })
}

function mapDependencies (isGlobal) {
  return (dependency) => {
    return {
      name: dependency,
      global: isGlobal || false
    }
  }
}

module.exports = (regexp, options, callback) => {
  const opts = assignOptions(options, DEFAULT_OPTIONS)

  getModules(opts, (error, modules) => {
    if (error) {
      return callback(error)
    }

    const matches = find(regexp, modules)
    const result = loadModules(matches)
    return callback(null, result)
  })
}
