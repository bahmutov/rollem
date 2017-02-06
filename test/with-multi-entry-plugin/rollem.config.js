import multiEntry from 'rollup-plugin-multi-entry';

export default [{
  entry: ['src/b.js', 'src/a.js'],
  dest: 'dist/defined-with-array.js',
  format: 'iife',
  moduleName: 'dwa',
  plugins: [multiEntry()]
}/*, {
  entry: 'src/*.js',
  dest: 'dist/defined-with-pattern.js',
  format: 'iife',
  moduleName: 'dwp',
  plugins: [multiEntry()]
}*/]
