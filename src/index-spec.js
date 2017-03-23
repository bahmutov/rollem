'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const {equals} = require('ramda')
const path = require('path')

/* global describe, it */
describe('rollem', () => {
  const rollem = require('.')

  it('is a function', () => {
    la(is.fn(rollem))
  })

  it('handles undefined options', () => {
    return rollem([])
  })
})

describe('merge folders', () => {
  const mergeFolders = require('./merge-folders').mergeFolders
  
  it('gives back only the folders', () => {
    const files = ['foo/bar.js']
    const merged = mergeFolders(files)
    la(equals(merged, ['foo']), merged)
  })
  
  it('removes duplicates', () => {
    const files = ['foo/bar.js', 'foo/bar.js']
    const merged = mergeFolders(files)
    la(equals(merged, ['foo']), merged)
  })
  
  it('normalizes paths', () => {
    const files = ['foo/../foo/bar.js']
    const merged = mergeFolders(files)
    la(equals(merged, ['foo']), merged)
  })
  
  it('removes child folders', () => {
    const files = ['foo/bar.js', 'foo/child/baz.js']
    const merged = mergeFolders(files)
    la(equals(merged, ['foo']), merged)
  })
  
  it('flattens array folder definitions', () => {
    const files = ['foo/x/a.js', ['foo/y/b.js', 'foo/z/c.js']]
    const merged = mergeFolders(files)
    la(equals(merged, [path.normalize('foo/x'), path.normalize('foo/y'), path.normalize('foo/z')]), merged)
  })
  
  it('can deal with glob patterns', () => {
    const files = ['foo/**/bar.js']
    const merged = mergeFolders(files)
    la(equals(merged, [path.normalize('foo/**')]), merged)
  })
  
  describe('folder globifier', () => {
    // const globifyFolders = require('./merge-folders').globifyFolders
    const appendDoubleStars = require('./merge-folders').appendDoubleStars
    
    it('appends ** at the end of folders, if necessary', () => {
      const file1 = path.normalize('foo/bar')
      const globbed1 = appendDoubleStars(file1)
      la(equals(globbed1, path.normalize('foo/bar/**')), 'test1: ' + globbed1)
      
      const file2 = path.normalize('foo/bar/**')
      const globbed2 = appendDoubleStars(file2)
      la(equals(globbed2, path.normalize('foo/bar/**')), 'test2: ' + globbed2)
      
      const file3 = path.normalize('foo/**/bar')
      const globbed3 = appendDoubleStars(file3)
      la(equals(globbed3, path.normalize('foo/**/bar/**')), 'test3: ' + globbed3)
    })
  })
  
  describe('glob normalization', () => {
    const normalizeGlob = require('./merge-folders').normalizeGlob
    
    it('collapses sequential and unnecessary **/ paths while keeping the directory separator intact', () => {
      const folder1 = 'foo/**/**/**/bar'
      const cleanedFolder1 = normalizeGlob(folder1)
      la(equals(cleanedFolder1, 'foo/**/bar'), 'test1: ' + cleanedFolder1)
      
      const folder2 = 'foo\\**\\**\\**\\bar'
      const cleanedFolder2 = normalizeGlob(folder2)
      la(equals(cleanedFolder2, 'foo\\**\\bar'), 'test2: ' + cleanedFolder2)
      
      const folder3 = 'foo/**/**/bar/**/**/**/baz'
      const cleanedFolder3 = normalizeGlob(folder3)
      la(equals(cleanedFolder3, 'foo/**/bar/**/baz'), 'test3: ' + cleanedFolder3)
    })
  })
  
  describe('child folder', () => {
    const isChild = require('./merge-folders').isChildFolder

    it('checks if one string starts with another', () => {
      const a = '../../foo'
      const b = '../..'
      la(a.startsWith(b))
    })

    it('finds that it is child', () => {
      const c = 'foo/child'
      const p = 'foo'
      la(isChild(c, p), path.relative(p, c))
    })

    it('finds that it is child 2', () => {
      const c = 'foo/bar/child'
      const p = 'foo'
      la(isChild(c, p), path.relative(p, c))
    })

    it('does not find child', () => {
      const c = 'bar/child'
      const p = 'foo'
      la(!isChild(c, p), path.relative(p, c))
    })

    it('does not consider folder a child of itself', () => {
      const folder = 'foo/bar'
      la(!isChild(folder, folder))
    })
    
    it('takes ** as the parent among other folders, if it\'s on the end and compared folders have the same depth', () => {
      const p1 = 'foo/**'
      const c1 = 'foo/bar'
      la(isChild(c1, p1), 'test1: parent=' + path.normalize(p1) + '; child=' + path.normalize(c1) + ' >> ' + path.relative(p1, c1))
      
      const p2 = 'foo/**/x'
      const c2 = 'foo/bar'
      la(!isChild(c2, p2), 'test2: parent=' + path.normalize(p2) + '; child=' + path.normalize(c2) + ' >> ' + path.relative(p2, c2))
      
      const p3 = 'foo/x/**'
      const c3 = 'foo/bar'
      la(!isChild(c3, p3), 'test3: parent=' + path.normalize(p3) + '; child=' + path.normalize(c3) + ' >> ' + path.relative(p3, c3))
      
      const p4 = 'foo/**'
      const c4 = 'foo/bar/baz'
      la(isChild(c4, p4), 'test4: parent=' + path.normalize(p4) + '; child=' + path.normalize(c4) + ' >> ' + path.relative(p4, c4))
    })
  })
})
