import { GlobalRegistry, IDesignerRegistry } from '@antdev/designable-core'
import { globalThisPolyfill } from '@antdev/designable-shared'

export const useRegistry = (): IDesignerRegistry => {
  return globalThisPolyfill['__DESIGNER_REGISTRY__'] || GlobalRegistry
}
