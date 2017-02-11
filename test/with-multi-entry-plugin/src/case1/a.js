const g = typeof window === 'undefined' ? global : window

import {c} from './subfolder/c'

export function a () {
  console.log('c says: ' + c());
  console.log('x is: ', g.x);
}
