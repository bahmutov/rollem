'use strict'

const debug = require('debug')('rollem')
const rollup = require('rollup')
const R = require('ramda')
const mergeFolders = require('./merge-folders').mergeFolders
const globifyFolders = require('./merge-folders').globifyFolders

function buildBundle (config) {
  return rollup
    .rollup(config)
    .then(bundle => bundle.write({
      format: config.format || 'es',
      dest: config.dest,
      globals: config.globals,
      moduleName: config.moduleName,
      sourceMap: config.sourceMap,
      interop: config.interop
    }))
    .then(() => config.dest)
}

function buildBundles (configs) {
  const promises = configs.map(buildBundle)
  return Promise.all(promises)
    .then(bundles => {
      console.log('[%s] built %d bundles', new Date().toTimeString(), configs.length)
      debug(bundles)
      return bundles
    })
    .catch((err) => {
      console.error(err.stack)
    })
}

function collectInputFolders (configs) {
  const filenames = R.map(R.prop('entry'), configs)
  return globifyFolders(mergeFolders(filenames))
}

function rollem (configs, options) {
  options = options || {}
  debug('Rollem configs')
  debug(configs)
  debug('Rollem options', options)

  console.assert(Array.isArray(configs), 'expected list of configs')

  if (options.watch) {
    const folders = collectInputFolders(configs)
    console.log('[%s] watching source folders for changes', new Date().toTimeString(), folders)

    const watchGlob = require('watch-glob')
    const EventEmitter = require('events')
    const watcher = new EventEmitter()
    
    watchGlob(folders, {callbackArg: 'relative'}, () => {
        watcher.emit('changed')
        buildBundles(configs)
          .then(() => watcher.emit('rolled'))
    })
    
    return Promise.resolve(watcher)
  } else {
    return buildBundles(configs)
  }
}

module.exports = rollem
