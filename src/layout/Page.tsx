import React, { useState, useEffect, Suspense } from 'react'
import { Layout, Button, Popover, List, Col, Row } from 'antd'
import { FundViewOutlined } from '@ant-design/icons'
import { DYNAMIC_MODULES, MODULE_MAP } from '../components/modules'
import { usePageModules } from '../context/PageModuleProvider'
import { PageModuleConfig } from '../types'

interface PageProps {
  name?: string
  header: any
  rightContent?: any
  fullWidth?: boolean
}

const Page: React.FC<PageProps> = ({
  children,
  name,
  header,
  rightContent,
  fullWidth,
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

  const addPageModule = (pageName: string, moduleKeyName: string) => {
    addModule(pageName, moduleKeyName)
    toggleVisible((s) => !s)
  }

  const renderPageModules = () => {
    return modules.map((m: PageModuleConfig, i: number) => {
      // @ts-ignore
      const DynamicModule = DYNAMIC_MODULES[m.moduleName]
      return (
        <DynamicModule
          id={i}
          title={m.moduleLabel}
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
            {Object.keys(MODULE_MAP).map((key, i) => {
              const conditions =
                !MODULE_MAP[key].unlisted &&
                (MODULE_MAP[key].pages === undefined ||
                  MODULE_MAP[key].pages?.indexOf(name) !== -1)

              return (
                conditions && (
                  <List.Item onClick={() => addPageModule(name, key)} key={i}>
                    {MODULE_MAP[key].moduleLabel}
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
            {children}
            {name && (
              <>
                <Suspense fallback={<div>Loading</div>}>
                  {renderPageModules()}
                </Suspense>
                {renderPopOver(name)}
              </>
            )}
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
