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
    // isParentFolder,
    // isChildFolder,
    appendDoubleStars,
    globifyFolders,
    // removeChildFolders,
    // mergeFolders
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
    
  })
  
  describe('isChildFolder', () => {
    
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
    
  })
  
  describe('mergeFolders', () => {
    
  })
})

// -------------

// describe('merge folders', () => {
  // it('gives back only the folders', () => {
    // const files = ['foo/bar.js']
    // const merged = mergeFolders(files)
    // la(equals(merged, ['foo']), merged)
  // })
  
  // it('removes duplicates', () => {
    // const files = ['foo/bar.js', 'foo/bar.js']
    // const merged = mergeFolders(files)
    // la(equals(merged, ['foo']), merged)
  // })
  
  // it('normalizes paths', () => {
    // const files = ['foo/../foo/bar.js']
    // const merged = mergeFolders(files)
    // la(equals(merged, ['foo']), merged)
  // })
  
  // it('removes child folders', () => {
    // const files = ['foo/bar.js', 'foo/child/baz.js']
    // const merged = mergeFolders(files)
    // la(equals(merged, ['foo']), merged)
  // })
  
  // it('flattens array folder definitions', () => {
    // const files = ['foo/x/a.js', ['foo/y/b.js', 'foo/z/c.js']]
    // const merged = mergeFolders(files)
    // la(equals(merged, [path.normalize('foo/x'), path.normalize('foo/y'), path.normalize('foo/z')]), merged)
  // })
  
  // it('can deal with glob patterns', () => {
    // const files = ['foo/**/bar.js']
    // const merged = mergeFolders(files)
    // la(equals(merged, [path.normalize('foo/**')]), merged)
  // })
  
  // describe('child folder', () => {
    // it('checks if one string starts with another', () => {
      // const a = '../../foo'
      // const b = '../..'
      // la(a.startsWith(b))
    // })

    // it('finds that it is child', () => {
      // const c = 'foo/child'
      // const p = 'foo'
      // la(isChildFolder(c, p), path.relative(p, c))
    // })

    // it('finds that it is child 2', () => {
      // const c = 'foo/bar/child'
      // const p = 'foo'
      // la(isChildFolder(c, p), path.relative(p, c))
    // })

    // it('does not find child', () => {
      // const c = 'bar/child'
      // const p = 'foo'
      // la(!isChildFolder(c, p), path.relative(p, c))
    // })

    // it('does not consider folder a child of itself', () => {
      // const folder = 'foo/bar'
      // la(!isChildFolder(folder, folder))
    // })
    
    // it('takes ** as the parent among other folders, if it\'s on the end and compared folders have the same depth', () => {
      // const p1 = 'foo/**'
      // const c1 = 'foo/bar'
      // la(isChildFolder(c1, p1), 'test1: parent=' + path.normalize(p1) + '; child=' + path.normalize(c1) + ' >> ' + path.relative(p1, c1))
      
      // const p2 = 'foo/**/x'
      // const c2 = 'foo/bar'
      // la(!isChildFolder(c2, p2), 'test2: parent=' + path.normalize(p2) + '; child=' + path.normalize(c2) + ' >> ' + path.relative(p2, c2))
      
      // const p3 = 'foo/x/**'
      // const c3 = 'foo/bar'
      // la(!isChildFolder(c3, p3), 'test3: parent=' + path.normalize(p3) + '; child=' + path.normalize(c3) + ' >> ' + path.relative(p3, c3))
      
      // const p4 = 'foo/**'
      // const c4 = 'foo/bar/baz'
      // la(isChildFolder(c4, p4), 'test4: parent=' + path.normalize(p4) + '; child=' + path.normalize(c4) + ' >> ' + path.relative(p4, c4))
    // })
  // })
// })
