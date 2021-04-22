import React, { useState, useEffect, Suspense } from 'react'
import { Layout, Button, Popover, List, Col, Row } from 'antd'
import { FundViewOutlined } from '@ant-design/icons'
import { DYNAMIC_COMPONENTS, WIDGET_MAP } from '../components/widgets'
import { usePageModules } from '../context/WidgetProvider'
import { PageWidgetConfig, PageWidgetProps } from '../types'

interface PageProps {
  name?: string
  header: any
  rightContent?: any
  fullWidth?: boolean
  renderModulesBefore?: boolean
}

const Page: React.FC<PageProps> = ({
  children,
  name,
  header,
  rightContent,
  fullWidth,
  renderModulesBefore,
}) => {
  const {
    modules,
    addModule,
    removeModule,
    saveConfig,
    setPageName,
  } = usePageModules()
  const [visible, toggleVisible] = useState(false)

  const base = { padding: 20 }
  const style = fullWidth ? { ...base } : { ...base, margin: '0 auto' }

  useEffect(() => {
    setPageName(name)
  }, [name])

  const addPageModule = (pageName: string, widgetKeyName: string) => {
    addModule(pageName, widgetKeyName)
    toggleVisible((s) => !s)
  }

  const renderPageWidget = () => {
    return modules.map((m: PageWidgetConfig, i: number) => {
      const DynamicWidgetComponent: React.LazyExoticComponent<
        React.FC<PageWidgetProps>
      > = DYNAMIC_COMPONENTS[m.widgetName]
      return (
        <DynamicWidgetComponent
          id={i}
          title={m.widgetLabel}
          key={i}
          remove={() => removeModule(name, i)}
          removeDisabled={modules.length === 1}
          config={m.config}
          saveConfig={(config: any, label?: string) =>
            saveConfig(name, i, config, label)
          }
        />
      )
    })
  }

  const renderPopOver = (name: string) => {
    return (
      <Popover
        style={{ padding: 0 }}
        content={
          <List>
            {Object.keys(WIDGET_MAP).map((key, i) => {
              const conditions =
                !WIDGET_MAP[key].unlisted &&
                (WIDGET_MAP[key].pages === undefined ||
                  WIDGET_MAP[key].pages?.indexOf(name) !== -1)

              return (
                conditions && (
                  <List.Item onClick={() => addPageModule(name, key)} key={i}>
                    {WIDGET_MAP[key].widgetLabel}
                  </List.Item>
                )
              )
            })}
          </List>
        }
        title="Modules"
        trigger="click"
        visible={visible}
        onVisibleChange={() => toggleVisible((s) => !s)}
      >
        <Button style={{ marginBottom: 20 }} icon={<FundViewOutlined />} />
      </Popover>
    )
  }

  return (
    <div style={style} className="main-content-width">
      <Layout>
        {header}
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ paddingTop: 30 }}
        >
          <Col xs={24} sm={24} md={24} lg={24} xl={rightContent ? 16 : 24}>
            {!renderModulesBefore && children}
            {name && (
              <>
                <Suspense fallback={<div>Loading</div>}>
                  {renderPageWidget()}
                </Suspense>
                {renderPopOver(name)}
              </>
            )}
            {renderModulesBefore && children}
          </Col>
          {rightContent && (
            <Col xs={24} sm={24} md={24} lg={24} xl={8}>
              {rightContent}
            </Col>
          )}
        </Row>
      </Layout>
    </div>
  )
}

export default Page
