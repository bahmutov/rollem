'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const R = require('ramda')
const equals = R.equals
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
  const merge = require('./merge-folders').merge
  
  it('gives back only the folders', () => {
    const files = ['foo/bar.js']
    const merged = merge(files)
    la(equals(merged, ['foo']), merged)
  })
  
  it('removes duplicates', () => {
    const files = ['foo/bar.js', 'foo/bar.js']
    const merged = merge(files)
    la(equals(merged, ['foo']), merged)
  })
  
  it('normalizes paths', () => {
    const files = ['foo/../foo/bar.js']
    const merged = merge(files)
    la(equals(merged, ['foo']), merged)
  })
  
  it('removes child folders', () => {
    const files = ['foo/bar.js', 'foo/child/baz.js']
    const merged = merge(files)
    la(equals(merged, ['foo']), merged)
  })
  
  it('flattens array folder definitions', () => {
    const files = ['foo/x/a.js', ['foo/y/b.js', 'foo/z/c.js']]
    const merged = merge(files)
    la(equals(merged, [path.normalize('foo/x'), path.normalize('foo/y'), path.normalize('foo/z')]), merged)
  })
  
  it('can deal with glob patterns', () => {
    const files = ['foo/**/bar.js']
    const merged = merge(files)
    la(equals(merged, [path.normalize('foo/**')]), merged)
  })
  
  it('appends ** at the end of folders, if necessary for glob watcher', () => {
    const files1 = ['foo/bar']
    const merged1 = merge(files1)
    la(equals(merged1[0], path.normalize('foo/bar/**')), 'test1: ' + merged1[0])
    
    const files2 = ['foo/bar/**']
    const merged2 = merge(files2)
    la(equals(merged2[0], path.normalize('foo/bar/**')), 'test2: ' + merged2[0])
    
    const files3 = ['foo/**/bar']
    const merged3 = merge(files3)
    la(equals(merged3[0], path.normalize('foo/**/bar/**')), 'test3: ' + merged3[0])
  })
  
  describe('glob normalization', () => {
    const normalizeGlob = require('./merge-folders').normalizeGlob
    
    it('collapses sequential and unnecessary **/ paths while keeping the directory separator intact', () => {
      const folder1 = 'foo/**/**/**/bar'
      const cleanedFolder1 = normalizeGlob(folder1)
      la(equals(cleanedFolder1, 'foo/**/bar'), 'test1: ' + cleanedFolder1)
      
      const folder2 = 'foo\\**\\**\\**/bar'
      const cleanedFolder2 = normalizeGlob(folder2)
      la(equals(cleanedFolder2, 'foo\\**\\bar'), 'test2: ' + cleanedFolder2)
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
      la(isChild(c1, p1), 'test1: ' + path.relative(p1, c1))
      
      const p2 = 'foo/**/x'
      const c2 = 'foo/bar'
      la(!isChild(c2, p2), 'test2: ' + path.relative(p2, c2))
      
      const p3 = 'foo/x/**'
      const c3 = 'foo/bar'
      la(!isChild(c3, p3), 'test3: ' + path.relative(p3, c3))
      
      const p4 = 'foo/**'
      const c4 = 'foo/bar/baz'
      la(isChild(c4, p4), 'test4: ' + path.relative(p4, c4))
    })
  })
})
