import { GithubOutlined } from '@ant-design/icons'
import { observer } from '@formily/react'
import {
  createDesigner,
  GlobalRegistry,
  IResourceLike,
} from '@antdev/designable-core'
import {
  CompositePanel,
  Designer,
  DesignerToolsWidget,
  HistoryWidget,
  IconWidget,
  OutlineTreeWidget,
  ResourceListWidget,
  SettingsPanel,
  StudioPanel,
  ToolbarPanel,
  ViewPanel,
  ViewportPanel,
  ViewToolsWidget,
  Workbench,
  WorkspacePanel,
} from '@antdev/designable-react'
import { SettingsForm } from '@antdev/designable-react-settings-form'
import { Button, Radio, Space } from 'antd'
import React, { createElement, useEffect, useMemo } from 'react'
import { SchemaEditorWidget } from './widgets'

const Logo: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
    {createElement(IconWidget, {
      infer: 'Logo',
      style: { margin: 10, height: 24, width: 'auto' },
    })}
  </div>
)

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Displays: '展示控件',
      Feedbacks: '反馈控件',
      Others: '其他控件',
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Displays: 'Displays',
      Feedbacks: 'Feedbacks',
      Others: 'Others',
    },
  },
  'ko-KR': {
    sources: {
      Inputs: '입력',
      Displays: '디스플레이',
      Feedbacks: '피드백',
      Others: '기타',
    },
  },
})

const Actions = observer(() => {
  const supportLocales = ['zh-cn', 'en-us', 'ko-kr']
  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage('zh-cn')
    }
  }, [])

  return (
    <Space style={{ marginRight: 10 }}>
      <Radio.Group
        value={GlobalRegistry.getDesignerLanguage()}
        optionType="button"
        options={[
          { label: 'English', value: 'en-us' },
          { label: '简体中文', value: 'zh-cn' },
          { label: '한국어', value: 'ko-kr' },
        ]}
        onChange={(e) => {
          GlobalRegistry.setDesignerLanguage(e.target.value)
        }}
      />
      <Button href="https://github.com/anthubdev/designable" target="_blank">
        <GithubOutlined />
        Github
      </Button>
      <Button>保存</Button>
      <Button type="primary">发布</Button>
    </Space>
  )
})
export interface AppProps {
  Content: React.FC
  sources: IResourceLike[]
}

export const App: React.FC<AppProps> = (props) => {
  const engine = useMemo(() => {
    return createDesigner()
  }, [])
  const { Content, sources } = props
  return (
    <Designer engine={engine}>
      <Workbench>
        <StudioPanel logo={<Logo />} actions={<Actions />}>
          <CompositePanel>
            <CompositePanel.Item title="panels.Component" icon="Component">
              <ResourceListWidget sources={sources} />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
              <OutlineTreeWidget />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.History" icon="History">
              <HistoryWidget />
            </CompositePanel.Item>
          </CompositePanel>
          <WorkspacePanel>
            <ToolbarPanel>
              <DesignerToolsWidget />
              <ViewToolsWidget />
            </ToolbarPanel>
            <ViewportPanel>
              <ViewPanel type="DESIGNABLE">{() => <Content />}</ViewPanel>
              <ViewPanel type="JSONTREE">
                {(tree, onChange) => (
                  <SchemaEditorWidget tree={tree} onChange={onChange} />
                )}
              </ViewPanel>
            </ViewportPanel>
          </WorkspacePanel>
          <SettingsPanel title="panels.PropertySettings">
            <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
          </SettingsPanel>
        </StudioPanel>
      </Workbench>
    </Designer>
  )
}
