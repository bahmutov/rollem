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
  })
})
