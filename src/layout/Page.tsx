import React from 'react'
import { Layout, Row, Col } from 'antd'

interface PageProps {
  header: any
  rightContent?: any
}

const PageDoubleCol: React.FC<PageProps> = ({
  children,
  header,
  rightContent,
}) => {
  return (
    <Layout>
      {header}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col xs={24} sm={24} md={24} lg={24} xl={rightContent ? 16 : 24}>
          {children}
        </Col>
        {rightContent && (
          <Col xs={24} sm={24} md={24} lg={24} xl={8}>
            {rightContent}
          </Col>
        )}
      </Row>
    </Layout>
  )
}

export default PageDoubleCol
