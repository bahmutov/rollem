import multiEntry from 'rollup-plugin-multi-entry'

export default [
// {
  // entry: ['src/**/b.js', 'src/**/a.js'],
  // dest: 'dist/case1.js',
  // format: 'iife',
  // moduleName: 'case1',
  // plugins: [multiEntry()]
// },

{
  entry: ['src/case2/foo.js'],
  dest: 'dist/case2.js',
  format: 'iife',
  moduleName: 'case2',
  plugins: [multiEntry()]
}]
