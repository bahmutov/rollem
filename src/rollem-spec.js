'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const equals = require('ramda').equals

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
  const merge = require('./merge-folders')

  it('removes duplicates', () => {
    const files = ['foo/bar.js', 'foo/bar.js']
    const merged = merge(files)
    // just the folder
    la(equals(merged, ['foo']), merged)
  })

  it('cleans names', () => {
    const files = ['foo/../foo/bar.js']
    const merged = merge(files)
    la(equals(merged, ['foo']), merged)
  })
})
