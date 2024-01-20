import { InjectionKey, Ref } from 'vue'
import { TreeNode, Engine } from '@antdev/designable-core'
import { IDesignerComponents } from './types'

export const DesignerEngineContext: InjectionKey<Ref<Engine>> = Symbol(
  'DesignerEngineContext'
)
export const DesignerComponentsContext: InjectionKey<Ref<IDesignerComponents>> =
  Symbol('DesignerComponentsContext')

export const TreeNodeContext: InjectionKey<Ref<TreeNode>> =
  Symbol('TreeNodeContext')
