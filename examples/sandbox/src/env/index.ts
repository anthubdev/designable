import { globalThisPolyfill } from '@antdev/designable-shared'
import * as Formily from './formily'
import * as Designable from './designable'

globalThisPolyfill['Formily'] = globalThisPolyfill['Formily']
  ? {
      ...globalThisPolyfill['Formily'],
      ...Formily,
    }
  : Formily

globalThisPolyfill['Designable'] = globalThisPolyfill['Designable']
  ? {
      ...globalThisPolyfill['Designable'],
      ...Designable,
    }
  : Designable
