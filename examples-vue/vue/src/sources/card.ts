import { createBehavior, createResource } from '@antdev/designable-core'
import { DnFC } from '@antdev/designable-vue'
import { Card as InCard } from '../components'

export const Card: DnFC = InCard

Card.Behavior = createBehavior({
  name: 'Card',
  selector: 'Card',
  designerProps: {
    droppable: true,
    resizable: {
      width(node, element) {
        const width = Number(
          node.props?.style?.width ?? element.getBoundingClientRect().width
        )
        return {
          plus: () => {
            node.props = node.props || {}
            node.props.style = node.props.style || {}
            node.props.style.width = width + 10
          },
          minus: () => {
            node.props = node.props || {}
            node.props.style = node.props.style || {}
            node.props.style.width = width - 10
          },
        }
      },
      height(node, element) {
        const height = Number(
          node.props?.style?.height ?? element.getBoundingClientRect().height
        )
        return {
          plus: () => {
            node.props = node.props || {}
            node.props.style = node.props.style || {}
            node.props.style.height = height + 10
          },
          minus: () => {
            node.props = node.props || {}
            node.props.style = node.props.style || {}
            node.props.style.height = height - 10
          },
        }
      },
    },
    translatable: {
      x(node, element, diffX) {
        const left =
          parseInt(node.props?.style?.left ?? element?.style.left) || 0
        const rect = element.getBoundingClientRect()
        return {
          translate: () => {
            node.props = node.props || {}
            node.props.style = node.props.style || {}
            node.props.style.position = 'absolute'
            node.props.style.width = rect.width
            node.props.style.height = rect.height
            node.props.style.left = left + parseInt(String(diffX)) + 'px'
          },
        }
      },
      y(node, element, diffY) {
        const top = parseInt(node.props?.style?.top ?? element?.style.top) || 0
        const rect = element.getBoundingClientRect()
        return {
          translate: () => {
            node.props = node.props || {}
            node.props.style = node.props.style || {}
            node.props.style.position = 'absolute'
            node.props.style.width = rect.width
            node.props.style.height = rect.height
            node.props.style.top = top + parseInt(String(diffY)) + 'px'
          },
        }
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '卡片',
    },
    'en-US': {
      title: 'Card',
    },
    'ko-KR': {
      title: '카드',
    },
  },
})

Card.Resource = createResource({
  title: {
    'zh-CN': '卡片',
    'en-US': 'Card',
    'ko-KR': '카드 상자',
  },
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Card',
      props: {
        title: '卡片',
      },
    },
  ],
})
