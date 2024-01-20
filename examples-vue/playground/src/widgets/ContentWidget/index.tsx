import { observer, ReactFC } from '@formily/reactive-react'
import { useDesigner, usePrefix, useTree } from '@antdev/designable-react'
import { ComponentTreeWidget, IDesignerComponents } from '@antdev/designable-vue'
import cls from 'classnames'
import React, { createElement, useEffect, useRef } from 'react'
import {
  createApp,
  defineComponent,
  Fragment,
  h,
  onErrorCaptured,
  ref,
} from 'vue'
import './styles.scss'

export interface IComponentTreeWidgetProps {
  style?: React.CSSProperties
  className?: string
  components: IDesignerComponents
}

export const ContentWidget: ReactFC<IComponentTreeWidgetProps> = observer(
  (props) => {
    const { components } = props
    const divRef = useRef<HTMLDivElement>(null)
    const tree = useTree()
    const prefix = usePrefix('component-tree')
    const designer = useDesigner()
    useEffect(() => {
      if (!tree || !components || !designer || !divRef.current) return
      const App = defineComponent({
        setup() {
          const errorRef = ref<any>(null)
          onErrorCaptured((err) => {
            console.error(err, 'error')
            errorRef.value = err
          })
          return () => {
            if (errorRef.value) return h(Fragment, null, errorRef.value)
            return h(ComponentTreeWidget, {
              tree,
              components,
              designer,
            })
          }
        },
      })
      const app = createApp(App)
      app.mount(divRef.current)
      return () => {
        app.unmount()
      }
    }, [tree, components, designer])
    const dataId = {}
    if (designer && tree) {
      dataId[designer.props?.nodeIdAttrName] = tree.id
    }
    return createElement('div', {
      ref: divRef,
      ...dataId,
      style: props.style,
      className: cls(prefix, props.className),
    })
  }
)
