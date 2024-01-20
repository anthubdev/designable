import React from 'react'
import { observer, ReactFC } from '@formily/reactive-react'
import { DroppableWidget } from '@antdev/designable-react'
import './styles.scss'

export const Container: ReactFC = observer((props) => {
  return <DroppableWidget>{props.children}</DroppableWidget>
})

export const withContainer = (Target: React.JSXElementConstructor<any>) => {
  return (props: any) => {
    return (
      <DroppableWidget>
        <Target {...props} />
      </DroppableWidget>
    )
  }
}
