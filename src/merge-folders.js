'use strict'

const R = require('ramda')
const path = require('path')

const endsWith = R.curry((ending, str) => str.endsWith(ending))
const startsWith = R.curry((starting, str) => str.startsWith(starting))

const normalizeGlob = R.replace(/\*\*([\\/])(?:\*\*[\\/])+/g, '**$1')

const getUniqueFolders = R.compose(
  R.uniq,
  R.map(R.compose(normalizeGlob, path.normalize, path.dirname)),
  R.flatten
)

const ANY_FOLDER = R.always('**')

const isSiblingFolder = R.compose(R.not, R.propEq(1, '..'), R.split(path.sep))
const isIndefiniteFolder = endsWith(ANY_FOLDER())

const isParentFolder = R.curry((parentPath, childPath) => {
  const isParentIndefinite = R.always(isIndefiniteFolder(parentPath))
  
  const compareFolders = R.compose(
    R.both(
      R.complement(R.isEmpty),
      R.either(
        R.complement(startsWith('..')),
        R.both(isParentIndefinite, isSiblingFolder)
      )
    ),
    path.relative
  )
  
  return compareFolders(parentPath, childPath)
})

const isChildFolder = R.flip(isParentFolder)

const appendDoubleStars = R.unless(
  isIndefiniteFolder,
  R.converge(R.concat, [
    R.identity,
    R.ifElse(
      endsWith(path.sep),
      ANY_FOLDER,
      R.compose(R.concat(path.sep), ANY_FOLDER)
    )
  ])
)

const globifyFolders = R.map(appendDoubleStars)

const removeChildFolders = R.converge(R.reject, [
  R.compose(
    R.flip(R.compose)(isChildFolder, R.__),
    R.flip(R.any),
    R.identity
  ),
  R.identity
])

const mergeFolders = R.compose(removeChildFolders, getUniqueFolders)

module.exports = {
  endsWith,
  startsWith,
  normalizeGlob,
  getUniqueFolders,
  ANY_FOLDER,
  isSiblingFolder,
  isIndefiniteFolder,
  isParentFolder,
  isChildFolder,
  appendDoubleStars,
  globifyFolders,
  removeChildFolders,
  mergeFolders
}
