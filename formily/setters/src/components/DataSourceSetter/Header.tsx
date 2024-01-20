import React, { ReactNode } from 'react'
import { observer } from '@formily/reactive-react'
import { usePrefix } from '@antdev/designable-react'
import './styles.scss'

export interface IHeaderProps {
  extra: ReactNode | null
  title: ReactNode | string
}

export const Header: React.FC<IHeaderProps> = observer(({ extra, title }) => {
  const prefix = usePrefix('data-source-setter')
  return (
    <div className={`${prefix + '-layout-item-header'}`}>
      <div className={`${prefix + '-layout-item-title'}`}>{title}</div>
      {extra}
    </div>
  )
})
