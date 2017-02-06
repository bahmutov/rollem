'use strict'

const R = require('ramda')
const path = require('path')

function isParentFolder (parentPath, childPath) {
  const relative = path.relative(parentPath, childPath)
  return relative && !relative.startsWith('..')
}

function isChildFolder (childPath, parentPath) {
  return isParentFolder(parentPath, childPath)
}

function mergeWatchedFolders (filenames) {
  const cleanedFolders = R.map(R.compose(path.normalize, path.dirname), filenames)
  const uniqFolders = R.uniq(cleanedFolders)

  // eliminate any folder that is a child of another folder
  return uniqFolders.filter((folder) => R.none(isChildFolder.bind(null, folder), uniqFolders))
}

module.exports = {
  isParentFolder: isParentFolder,
  isChildFolder: isChildFolder,
  merge: mergeWatchedFolders
}
