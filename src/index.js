'use strict'

const debug = require('debug')('rollem')
const rollup = require('rollup')
const R = require('ramda')
const mergeFolders = require('./merge-folders').merge

function buildBundle (config) {
  return rollup.rollup(config)
    .then(function (bundle) {
      return bundle.write({
        format: config.format || 'es6',
        dest: config.dest,
        moduleName: config.moduleName
      }).then(() => config.dest)
    })
}

function buildBundles (configs) {
  const promises = configs.map(buildBundle)
  return Promise.all(promises)
    .then((bundles) => {
      console.log('built %d bundles', configs.length)
      debug(bundles)
      return bundles
    })
    .catch((err) => {
      console.error(err.stack)
    })
}

function collectInputFolders (configs) {
  const filenames = R.map(R.prop('entry'), configs)
  return mergeFolders(filenames)
}

function rollem (configs, options) {
  options = options || {}
  debug('Rollem configs')
  debug(configs)
  debug('Rollem options', options)

  console.assert(Array.isArray(configs), 'expected list of configs')

  if (options.watch) {
    const folders = collectInputFolders(configs)
    console.log('watching source folders for changes', folders)

    const watch = require('watch')
    const EventEmitter = require('events')
    const watcher = new EventEmitter()

    folders.forEach((sourceFolder) => {
      watch.watchTree(sourceFolder, function onFileChange () {
        // will be called on the initial setup
        watcher.emit('changed')
        buildBundles(configs)
          .then(() => watcher.emit('rolled'))
      })
    })
    return Promise.resolve(watcher)
  } else {
    return buildBundles(configs)
  }
}

module.exports = rollem
