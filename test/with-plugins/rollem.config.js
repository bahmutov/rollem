import nodeResolve from 'rollup-plugin-node-resolve'
export default [{
  entry: 'src/foo.js',
  dest: 'dist/foo.js',
  plugins: [nodeResolve()]
}, {
  entry: 'src/child-folder/bar.js',
  dest: 'dist/bar.js',
  format: 'umd',
  moduleName: 'bar',
  plugins: [nodeResolve()]
}]
