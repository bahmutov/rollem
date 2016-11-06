# rollem

> Roll up multiple ES6 bundles at once

[![npm version](https://badge.fury.io/js/rollem.svg)](https://badge.fury.io/js/rollem)
[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]

## Why?

[Rollup](http://rollupjs.org/) is great, but
[does not handle multiple bundles](https://github.com/rollup/rollup/issues/703)
right out of the box. **Rollem** just handles a simple case

```js
// rollem.config.js
module.exports = [{
  entry: 'src/foo.js',
  dest: 'dist/foo.js'
}, {
  entry: 'src/bar.js',
  dest: 'dist/bar.js'
}]
```

Which builds two bundles `dist/foo.js` and `dist/bar.js` when you run
`rollem`.

## Install and use

```text
npm install -D rollem
// create rollem.config.js shown above
// then set script command
"build": "rollem"
```

You can pass `--watch` option in the command to enable simple bundle rebuild
on changes.

You can pass `-c <filename>` to specify a different config file.

## rollem.config.js

Almost the same syntax as [rollup.config.js](http://rollupjs.org/guide/#using-config-files)
but exports an Array. You can use JavaScript module to create the list of configs dynamically.

```js
// rollem.config.js with ES5
const configs = glob.sync('src/**/*-spec.js').map(toConfig)
module.exports = configs
```

```js
// rollem.config.js with ES6
export default [{
  entry: 'src/foo.js',
  dest: 'dist/foo.js'
}, {
  entry: 'src/child-folder/bar.js',
  dest: 'dist/bar.js',
  format: 'umd',
  moduleName: 'bar',
  sourceMap: 'inline'
}]
```

## API

In addition to the simple command line, you can use **rollem** via its
module API. It exports a single function

```js
const rollem = require('rollem')
rollem(configs, options)
```

* `configs` - simple Array of Rollup config objects
* `options` - object with options, right now only `watch` property is
  supported.

The `rollem(configs, options)` returns a Promise, resolved after the
bundles have been built. The promise is resolved with the list of built files.

If you run `rollem(configs, {watch: true})` then the resolved Promise will
give you an event emitter. Every time there is a file change, you first
will get "changed" event, and after the bundles have been built you will
get an event "rolled".

```js
rollem(configs, {watch: true})
  .then((ee) => {
    ee.on('changed', () => console.log('bundles will be rebuilt'))
    ee.on('rolled', () => console.log('new bundles have been built'))
  })
```

The **rollem** in watch mode tries to determine the folder to watch from the source files.
Because it only knows about the top level entry file, it just grabs and watches
the top parent folders. For example, if entries specify `src/entry.js, src/foo/bar.js` then
the top parent folder watched will be `src`.

## Debug

If something is wrong, run the tool with debug output enabled

```sh
DEBUG=rollem rollem
```

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2016


* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog)


License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/rollem/issues) on Github

## MIT License

Copyright (c) 2016 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/rollem.svg?downloads=true
[npm-url]: https://npmjs.org/package/rollem
[ci-image]: https://travis-ci.org/bahmutov/rollem.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/rollem
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
