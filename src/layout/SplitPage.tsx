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
    <Layout style={{ borderLeft: '2px solid white' }}>
      {header}
      <Row style={{ height: '94vh' }}>
        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
          {leftContent}
        </Col>
        {rightContent && (
          <Col xs={16} sm={16} md={16} lg={16} xl={16}>
            {rightContent}
          </Col>
        )}
      </Row>
    </Layout>
  )
}

export default Page
