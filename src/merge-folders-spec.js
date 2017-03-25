const path = require('path')
const assert = require('assert')

const isFunction = x => typeof x === 'function'

/* global describe, it */
describe('./merge-folders', () => {
  const {
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
  } = require('./merge-folders')
  
  describe('endsWith', () => {
    it('checks the ends of strings', () => {
      assert.ok(endsWith('ipsum', 'lorem ipsum'), '"lorem ipsum" ends with "ipsum"')
      assert.ok(!endsWith('foo', 'foo bar'), '"foo bar" doesn\'t end with "foo"')
    })
    it('can be curried', () => {
      const str = 'asdf'
      const what = 'f'
      assert.equal(endsWith(what, str), endsWith(what)(str), 'endsWith(..., ...) should be the same as endsWith(...)(...)')
    })
  })
  
  describe('startsWith', () => {
    it('checks the beginnings of strings', () => {
      assert.ok(startsWith('lorem', 'lorem ipsum'), '"lorem ipsum" starts with "lorem"')
      assert.ok(!startsWith('bar', 'foo bar'), '"foo bar" doesn\'t start with "bar"')
    })
    it('can be curried', () => {
      const str = 'asdf'
      const what = 'a'
      assert.equal(startsWith(what, str), startsWith(what)(str), 'startsWith(..., ...) should be the same as startsWith(...)(...)')
    })
  })
  
  describe('normalizeGlob', () => {
    it('collapses consecutive **/ patterns', () => {
      assert.equal(normalizeGlob('foo/**/**/**/bar'), 'foo/**/bar')
    })
    it('keeps the directory separators intact', () => {
      assert.equal(normalizeGlob('foo\\**\\**\\bar'), 'foo\\**\\bar')
    })
    it('keeps intermediate folders between ** patterns intact', () => {
      assert.equal(normalizeGlob('foo/**/**/bar/**/**/**/baz'), 'foo/**/bar/**/baz')
    })
  })
  
  describe('getUniqueFolders', () => {
    it('takes an array of paths and trims off filenames from the ends', () => {
      assert.deepEqual(
        getUniqueFolders(['a/b.jpg', 'c/d/e.txt', 'etc/init.d', '../hosts']),
        ['a', path.normalize('c/d'), 'etc', '..']
      )
    })
    it('normalizes paths', () => {
      assert.deepEqual(
        getUniqueFolders(['a/../b/././**/c/foo.png'])
        [path.normalize('b/**/c')]
      )
    })
    it('removes duplicates', () => {
      assert.deepEqual(
        getUniqueFolders(['foo/./bar/a.js', 'foo/bar/b.js', 'foo/baz/../bar/c.js']),
        [path.normalize('foo/bar')]
      )
    })
    it('flattens nested arrays', () => {
      assert.deepEqual(
        getUniqueFolders([[['foo/bar/baz.js']], 'a/b.txt', ['c/d/e.jpg']]),
        [path.normalize('foo/bar'), 'a', path.normalize('c/d')]
      )
    })
  })
  
  describe('ANY_FOLDER', () => {
    it('is a function', () => {
      assert.ok(isFunction(ANY_FOLDER), 'should be a function')
    })
    it('always returns "**"', () => {
      assert.equal(ANY_FOLDER(), '**', 'should return "**" when no parameters are passed')
      assert.equal(ANY_FOLDER('asdf'), ANY_FOLDER(12, true, 4), 'should give back the same value regardless of the amount and quality of arguments')
    })
  })
  
  describe('isSiblingFolder', () => {
    it('checks a relative path whether it only steps 1 folder up the folder tree', () => {
      var path1 = path.normalize('../foo/bar')
      assert.ok(isSiblingFolder(path1), '"' + path1 + '" is considered a sibling folder')
      
      var path2 = path.normalize('../../../foo/bar/')
      assert.ok(!isSiblingFolder(path2), '"' + path2 + '" is not a sibling folder')
    })
  })
  
  describe('isIndefiniteFolder', () => {
    it('checks, if a path ends with **', () => {
      assert.ok(isIndefiniteFolder('../foo/bar/**'), '"../foo/bar/**" is indefinite')
      assert.ok(isIndefiniteFolder('/a/**'), '"/a/**" is indefinite')
      assert.ok(isIndefiniteFolder('**'), '"**" is indefinite')
      assert.ok(isIndefiniteFolder('./**'), '"./**" is indefinite')
      assert.ok(!isIndefiniteFolder('../a/b'), '"../a/b" is not indefinite')
      assert.ok(!isIndefiniteFolder('/test'), '"/test" is not indefinite')
    })
  })
  
  describe('isParentFolder', () => {
    it('compares 2 paths and checks if the second path defines a subfolder inside the first', () => {
      assert.ok(isParentFolder('foo', 'foo/bar'))
      assert.ok(isParentFolder('foo', 'foo/bar/baz'))
      assert.ok(!isParentFolder('foo/bar/baz', 'foo/bar/foo'))
      assert.ok(!isParentFolder('foo/bar/baz', 'foo/bar/baz'))
      assert.ok(!isParentFolder('foo/bar', 'baz'))
    })
    it('chooses ** over any other folders', () => {
      assert.ok(isParentFolder('foo/**', 'foo/bar'))
      assert.ok(isParentFolder('foo/**', 'foo/bar/baz'))
      assert.ok(!isParentFolder('foo/**/x', 'foo/bar'))
      assert.ok(!isParentFolder('foo/x/**', 'foo/bar'))
    })
    it('can be curried', () => {
      assert.equal(isParentFolder('foo/bar', 'foo/bar/baz'), isParentFolder('foo/bar')('foo/bar/baz'))
    })
  })
  
  describe('isChildFolder', () => {
    it('is the same as isParentFolder, but with reversed parameters', () => {
      const folder1A = 'foo/bar/baz'
      const folder1B = 'foo/bar'
      assert.strictEqual(isChildFolder(folder1A, folder1B), isParentFolder(folder1B, folder1A))
      const folder2A = 'foo/bar'
      const folder2B = 'foo/**'
      assert.strictEqual(isChildFolder(folder2A, folder2B), isParentFolder(folder2B, folder2A))
    })
  })
  
  describe('appendDoubleStars', () => {
    it('appends ** at the end of folders, if necessary', () => {
      assert.equal(appendDoubleStars(path.normalize('foo/bar')), path.normalize('foo/bar/**'))
      assert.equal(appendDoubleStars(path.normalize('foo/bar/')), path.normalize('foo/bar/**'))
      assert.equal(appendDoubleStars(path.normalize('foo/bar/**')), path.normalize('foo/bar/**'))
      assert.equal(appendDoubleStars(path.normalize('foo/bar/**/**')), path.normalize('foo/bar/**/**'))
      assert.equal(appendDoubleStars(path.normalize('foo/**/bar/**')), path.normalize('foo/**/bar/**'))
    })
  })
  
  describe('globifyFolders', () => {
    it('takes an array of folders and appends ** at their ends', () => {
      assert.deepEqual(
        globifyFolders([path.normalize('foo/bar'), path.normalize('foo/bar/**')]),
        [path.normalize('foo/bar/**'), path.normalize('foo/bar/**')]
      )
    })
  })
  
  describe('removeChildFolders', () => {
    it('takes an array of paths and removes child folders', () => {
      assert.deepEqual(
        removeChildFolders(['foo/bar', 'foo/**', 'foo/bar/baz']),
        ['foo/**']
      )
    })
  })
  
  describe('mergeFolders', () => {
    it('from an array of paths it filters out non-unique and child folders', () => {
      assert.deepEqual(
        mergeFolders(['foo/bar/baz.js', ['foo/bar/x.png', 'foo/**/*.js', 'foo/**/*.ts'], 'foo\\**\\bar\\baz\\..\\*.js']),
        [path.normalize('foo/**')]
      )
    })
  })
})
