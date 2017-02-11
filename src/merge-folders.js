'use strict'

const R = require('ramda')
const path = require('path')

function isParentFolder (parentPath, childPath) {
  const relative = path.relative(parentPath, childPath)
  
  
  
  /*
  */
  return relative && !relative.startsWith('..')
}

function isChildFolder (childPath, parentPath) {
  return isParentFolder(parentPath, childPath)
}

function normalizeGlob (path) {
  return path.replace(/\*\*([\\/])(?:\*\*[\\/])+/, '**$1')
}

function mergeWatchedFolders (filenames) {
  const flattedFilenames = R.flatten(filenames);
  const cleanedFolders = R.map(R.compose(normalizeGlob, path.normalize, path.dirname), flattedFilenames)
  const uniqFolders = R.uniq(cleanedFolders)

  // eliminate any folder that is a child of another folder
  return uniqFolders.filter((folder) => R.none(isChildFolder.bind(null, folder), uniqFolders))
}

module.exports = {
  normalizeGlob: normalizeGlob,
  isParentFolder: isParentFolder,
  isChildFolder: isChildFolder,
  merge: mergeWatchedFolders
}
