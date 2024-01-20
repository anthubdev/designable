import { ICustomEvent } from '@antdev/designable-shared'
import { AbstractMutationNodeEvent } from './AbstractMutationNodeEvent'

export class UnSelectNodeEvent
  extends AbstractMutationNodeEvent
  implements ICustomEvent
{
  type = 'unselect:node'
}
