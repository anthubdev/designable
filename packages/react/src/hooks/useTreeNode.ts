import { TreeNode } from '@antdev/designable-core'
import { useContext } from 'react'
import { TreeNodeContext } from '../context'

export const useTreeNode = () => {
  return useContext(TreeNodeContext) as TreeNode
}
