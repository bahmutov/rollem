'use strict'

const R = require('ramda')
const path = require('path')

const isParentFolder = R.curry((parentPath, childPath) => {
  const relative = path.relative(parentPath, childPath)
  let retValue = false

  if (relative) {
    if (relative.startsWith('..')) {
      // ** should always be chosen over any specified folders
      if (parentPath.endsWith('**') && relative.split(path.sep)[1] !== '..') {
        retValue = true
      }
    } else {
      retValue = true
    }
  }

  return retValue
})

const isChildFolder = R.flip(isParentFolder)

// collapses multiple sequential '**/' parts into a single '**/'
const normalizeGlob = R.replace(/\*\*([\\/])(?:\*\*[\\/])+/g, '**$1')

const appendDoubleStars = folder => folder + (
  folder.endsWith(path.sep + '**')
  ? ''
  : (folder.endsWith(path.sep) ? '' : path.sep) + '**'
)

const globifyFolders = R.map(appendDoubleStars)

const mergeFolders = filenames => {
  const flattedFilenames = R.flatten(filenames)
  const cleanedFolders = R.map(R.compose(normalizeGlob, path.normalize, path.dirname), flattedFilenames)
  const uniqFolders = R.uniq(cleanedFolders)

  // eliminate any folder that is a child of another folder
  return uniqFolders.filter((folder) => R.none(isChildFolder.bind(null, folder), uniqFolders))
}

module.exports = {
  appendDoubleStars,
  globifyFolders,
  isChildFolder,
  isParentFolder,
  mergeFolders,
  normalizeGlob
}
