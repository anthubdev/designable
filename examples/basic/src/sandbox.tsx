import React from 'react'
import { Content } from './content'
import { renderSandboxContent } from '@antdev/designable-react-sandbox'
import './theme.scss'

renderSandboxContent(() => {
  return <Content />
})
