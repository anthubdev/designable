import { ReactFC } from '@formily/reactive-react'
import { each } from '@antdev/designable-shared'
import cls from 'classnames'
import React, { Fragment, useContext, useLayoutEffect, useRef } from 'react'
import { DesignerLayoutContext } from '../context'
import { IDesignerLayoutProps } from '../types'

export const Layout: ReactFC<IDesignerLayoutProps> = ({
  theme = 'light',
  prefixCls = 'dn-',
  position = 'fixed',
  variables,
  children,
}) => {
  const layout = useContext(DesignerLayoutContext)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const { current } = ref
    if (current && variables) {
      each(variables, (value, key) => {
        current.style.setProperty(`--${key}`, value)
      })
    }
  }, [variables])

  if (layout) {
    return <Fragment>{children}</Fragment>
  }
  return (
    <div
      ref={ref}
      className={cls({
        [`${prefixCls}app`]: true,
        [`${prefixCls}${theme}`]: theme,
      })}
    >
      <DesignerLayoutContext.Provider
        value={{
          theme: theme,
          prefixCls: prefixCls as string,
          position: position as Required<IDesignerLayoutProps>['position'],
        }}
      >
        {children}
      </DesignerLayoutContext.Provider>
    </div>
  )
}
