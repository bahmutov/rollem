export default [{
  entry: 'src/foo.js',
  dest: 'dist/foo.js'
}, {
  entry: 'src/child-folder/bar.js',
  dest: 'dist/bar.js',
  format: 'umd',
  moduleName: 'bar'
}]
