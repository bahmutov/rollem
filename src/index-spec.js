const assert = require('assert')

const isFunction = x => typeof x === 'function'

/* global describe, it */
describe('rollem', () => {
  const rollem = require('./index')
  it('is a function', () => {
    assert.ok(isFunction(rollem), 'should be a function')
  })

  /*
  it('handles undefined options', () => {
    return rollem([])
  })
  */
})
