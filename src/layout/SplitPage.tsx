import React, { useState, useEffect, Suspense } from 'react'
import { Layout, Col, Row } from 'antd'
import { usePageModules } from '../context/WidgetProvider'
import '../theme/splitpage.less'

interface PageProps {
  name?: string
  header: any
  rightContent?: any
  leftContent?: any
  fullWidth?: boolean
  renderModulesBefore?: boolean
}

const Page: React.FC<PageProps> = ({
  children,
  name,
  header,
  rightContent,
  leftContent,
}) => {
  const { setPageName } = usePageModules()

  useEffect(() => {
    setPageName(name)
  }, [name, setPageName])

  return (
    <Layout
      style={{
        borderLeft: '2px solid white',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {header}
      <Row style={{ height: '94vh' }}>
        <Col xs={10} sm={10} md={10} lg={10} xl={8}>
          {leftContent}
        </Col>
        {rightContent && (
          <Col xs={14} sm={14} md={14} lg={14} xl={16}>
            {rightContent}
          </Col>
        )}
      </Row>
    </Layout>
  )
}

export default Page
