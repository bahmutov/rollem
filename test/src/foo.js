import {bar} from './child-folder/bar'

export function foo () {
  console.log('foo')
  console.log('bar says', bar())
}
