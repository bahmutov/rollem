'use strict'

const debug = require('debug')('rollem')
const rollup = require('rollup')

function buildBundle (config) {
  return rollup.rollup(config)
    .then(function (bundle) {
      return bundle.write({
        format: config.format || 'es6',
        dest: config.dest
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

function rollem (config, options) {
  debug('Rollem configs')
  debug(config)
  debug('Rollem options', options)

  console.assert(Array.isArray(config), 'expected list of configs')

  if (options.watch) {
    console.log('watching source files for changes')
  // const watch = require('watch')
  // // TODO determine what to watch from source configs
  // watch.watchTree(sourceFolder, function onFileChange () {
  //   // will be called on the initial setup
  //   buildBundles(config)
  // })
  } else {
    return buildBundles(config)
  }
}

module.exports = rollem
