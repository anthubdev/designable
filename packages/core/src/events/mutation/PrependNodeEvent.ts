import { ICustomEvent } from '@antdev/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class PrependNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'prepend:node'
}
