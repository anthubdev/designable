import { TreeNode } from '@antdev/designable-core'
import { inject, Ref } from 'vue'
import { TreeNodeContext } from '../context'

export function useTreeNode() {
  const designer = inject(TreeNodeContext)
  return designer as Ref<TreeNode>
}
