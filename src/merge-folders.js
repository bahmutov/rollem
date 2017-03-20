'use strict'

const R = require('ramda')
const path = require('path')

const endsWith = R.curry((ending, str) => str.endsWith(ending))
const startsWith = R.curry((starting, str) => str.startsWith(starting))

// collapses multiple sequential '**/' parts into a single '**/'
const normalizeGlob = R.replace(/\*\*([\\/])(?:\*\*[\\/])+/g, '**$1')

const getUniqueFolders = R.compose(
  R.uniq,
  R.map(R.compose(normalizeGlob, path.normalize, path.dirname)),
  R.flatten
)

const isSiblingFolder = R.compose(R.not, R.propEq(1, '..'), R.split(path.sep))
const isIndefiniteFolder = endsWith('**')

const isParentFolder = R.curry((parentPath, childPath) => {
  const isParentIndefinite = isIndefiniteFolder(parentPath)
  
  const compareFolders = R.compose(
    R.ifElse(
      R.isEmpty,
      R.F,
      R.ifElse(
        startsWith('..'),
        R.both(R.always(isParentIndefinite), isSiblingFolder),
        R.T
      )
    ),
    path.relative
  )
  
  return compareFolders(parentPath, childPath)
})

const isChildFolder = R.flip(isParentFolder)

const appendDoubleStars = R.when(
  R.complement(isIndefiniteFolder),
  R.converge(R.concat, [
    R.identity,
    R.compose(
      R.concat(R.__, '**'),
      R.ifElse(
        endsWith(path.sep),
        R.always(''),
        R.always(path.sep)
      )
    )
  ])
)

const globifyFolders = R.map(appendDoubleStars)

const mergeWatchedFolders = R.curry(filenames => {
  const uniqFolders = getUniqueFolders(filenames)
  return R.reject(R.compose(R.any(R.__, uniqFolders), isChildFolder), uniqFolders)
})

module.exports = {
  appendDoubleStars: appendDoubleStars,
  globify: globifyFolders,
  normalizeGlob: normalizeGlob,
  isParentFolder: isParentFolder,
  isChildFolder: isChildFolder,
  merge: mergeWatchedFolders
}
