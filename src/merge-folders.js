'use strict'

const R = require('ramda')
const path = require('path')

function mergeWatchedFolders (filenames) {
  const folders = R.map(path.dirname, filenames)
  const cleanedFolders = R.map(path.normalize, folders)
  const uniqFolders = R.uniq(cleanedFolders)
  return uniqFolders
}

module.exports = mergeWatchedFolders
