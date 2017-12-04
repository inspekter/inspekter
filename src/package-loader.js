'use strict'

const npm = require('npm')
const requireg = require('requireg')
const q = require('q')
const deasyncPromise = require('deasync-promise')

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
  let results

  regexps.forEach((regexp) => {
    results = filterModuleNames(regexp, modules)

    if (results.length > 0) {
      matches = matches.concat(results)
    }
  })

  return matches
}

function loadModules (modules) {
  let result = {}

  modules.forEach((module) => {
    result[module] = require(module)
  })

  return result
}

function getModules (options, callback) {
  listInstalledModules({ global: true }, (error, results) => {
    if (error) {
      callback(error)
    } else {
      let modules = []

      results.forEach((result) => {
        modules = modules.concat(result.name)
      })

      // Remove possible duplicates
      modules = modules.filter((element, index, self) => {
        return index === self.indexOf(element)
      })

      callback(null, modules)
    }
  })
}

function listGlobalInstalledModules () {
  return listInstalledModules({ global: true })
}

function listLocalInstalledModules (ignoreDev) {
  return listInstalledModules({ global: false, ignoreDev: ignoreDev })
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
        callback(error)
      } else {
        let modules = extractModulesFromDependencies(data.dependencies, options.global)
        callback(null, modules)
      }
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
  let deferred = q.defer()

  getModules(opts, (error, modules) => {
    if (error) {
      callback(error)
    } else {
      const matches = find(regexp, modules)
      const result = loadModules(matches)
      callback(null, result)
    }
  })
}
