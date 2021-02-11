import React, { useState, useEffect, Suspense } from 'react'
import { Layout, Button, Popover, List, Col, Row } from 'antd'
import { FundViewOutlined } from '@ant-design/icons'
import { DYNAMIC_MODULES, MODULE_MAP } from '../components/modules'
import { useDynamicModules } from '../hooks/useDynamicModules'

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
  const { modules, setModules } = useDynamicModules()
  const [visible, toggleVisible] = useState(false)

  const base = { padding: 20 }
  const style = fullWidth ? { ...base } : { ...base, margin: '0 auto' }

  const addModule = (moduleKey: string) => {
    setModules((s) => {
      const updated = s.concat([MODULE_MAP[moduleKey]])
      localStorage.setItem(`${name}:modules`, JSON.stringify(updated))
      return updated
    })
    toggleVisible((s) => !s)
  }

  const removeModule = (index: number) => {
    setModules((s) => {
      const updated = s.filter((item, i) => i !== index)
      localStorage.setItem(`${name}:modules`, JSON.stringify(updated))
      return updated
    })
  }

  useEffect(() => {
    const localModuleStore = localStorage.getItem(`${name}:modules`)
    localModuleStore && setModules(JSON.parse(localModuleStore))
  }, [])

  const renderDynamicModules = () => {
    return modules.map((m, i) => {
      // @ts-ignore
      const DynamicModule = DYNAMIC_MODULES[m.moduleKey]
      return (
        <DynamicModule
          title={m.moduleLabel}
          key={i}
          remove={() => removeModule(i)}
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
                MODULE_MAP[key].pages === undefined ||
                MODULE_MAP[key].pages?.indexOf(name) != -1

              return (
                conditions && (
                  <List.Item onClick={() => addModule(key)} key={i}>
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
        <Button icon={<FundViewOutlined />} />
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
                  {renderDynamicModules()}
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
