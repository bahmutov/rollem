'use strict'

const R = require('ramda')
const path = require('path')

function isParentFolder (parentPath, childPath) {
  const relative = path.relative(parentPath, childPath)
  let retValue = false;
  
  if (relative) {
    if (relative.startsWith('..')) {
      // from 'foo/**' and 'foo/bar' the first should be considered as a parent folder
      if (relative.split(path.sep).length === 2 && parentPath.endsWith('**')) {
        retValue = true
      }
    } else {
      retValue = true
    }
  }
  
  return retValue
}

function isChildFolder (childPath, parentPath) {
  return isParentFolder(parentPath, childPath)
}

function normalizeGlob (folder) {
  // collapses multiple sequential '**/' parts into a single '**/'
  return folder.replace(/\*\*([\\/])(?:\*\*[\\/])+/, '**$1')
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
