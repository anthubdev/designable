import { Engine, GlobalRegistry, TreeNode } from '@antdev/designable-core'
import { observer } from '@formily/reactive-vue'
import {
  computed,
  defineComponent,
  Fragment,
  h,
  PropType,
  provide,
  watch,
} from 'vue'
import {
  DesignerComponentsContext,
  DesignerEngineContext,
  TreeNodeContext,
} from '../../context'
import { useComponents, useDesigner } from '../../hooks'
import { IDesignerComponents } from '../../types'

export const TreeNodeWidget = observer(
  defineComponent({
    name: 'TreeNodeWidget',
    props: {
      node: {
        type: Object as PropType<TreeNode>,
        required: true,
      },
    },
    setup(props) {
      const designer = useDesigner()
      const components = useComponents()
      const nodeRef = computed(() => props.node)
      provide(TreeNodeContext, nodeRef)

      return () => {
        const node = props.node
        const renderChildren = () => {
          if (node?.designerProps?.selfRenderChildren) return []
          return node?.children?.map((child) => {
            return h(TreeNodeWidget, { node: child, key: child.id })
          })
        }

        const renderProps = (extendsProps: any = {}) => {
          const props = {
            ...node.designerProps?.defaultProps,
            ...extendsProps,
            ...node.props,
            ...node.designerProps?.getComponentProps?.(node),
          }
          if (node.depth === 0) {
            delete props.style
          }
          return props
        }

        const renderComponent = () => {
          const componentName = node.componentName
          const Component = components.value?.[componentName]
          const dataId = {}
          if (Component) {
            if (designer.value) {
              dataId[designer.value.props?.nodeIdAttrName] = node.id
            }
            return h(Component, renderProps(dataId), {
              default: renderChildren,
            })
          } else {
            if (node?.children?.length) {
              return h(Fragment, renderChildren())
            }
          }
        }
        if (!node) return null
        if (node.hidden) return null
        return h(Fragment, [renderComponent()])
      }
    },
  })
)

export const ComponentTreeWidget = observer(
  defineComponent({
    name: 'ComponentTreeWidget',
    props: {
      components: {
        type: Object as PropType<IDesignerComponents>,
        required: true,
      },
      tree: {
        type: Object as PropType<TreeNode>,
        required: true,
      },
      designer: {
        type: Object as PropType<Engine>,
        required: true,
      },
    },
    setup(props) {
      const treeRef = computed(() => props.tree)
      provide(TreeNodeContext, treeRef)
      const componentsRef = computed(() => props.components)
      provide(DesignerComponentsContext, componentsRef)
      const designerRef = computed(() => props.designer)
      provide(DesignerEngineContext, designerRef)
      watch(
        () => props.components,
        () => {
          GlobalRegistry.registerDesignerBehaviors(props.components)
        },
        { immediate: true }
      )
      return () => {
        const { tree } = props

        return h(Fragment, null, [h(TreeNodeWidget, { node: tree })])
      }
    },
  })
)
