import multiEntry from 'rollup-plugin-multi-entry';

export default [{
  entry: ['src/**/b.js', 'src/**/a.js'],
  dest: 'dist/defined-with-array.js',
  format: 'iife',
  moduleName: 'dwa',
  plugins: [multiEntry()]
}]
