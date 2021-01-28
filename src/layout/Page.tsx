import React from 'react'
import { Layout, Row, Col } from 'antd'

interface PageProps {
  header: any
  rightContent?: any
  fullWidth?: boolean
}

const PageDoubleCol: React.FC<PageProps> = ({
  children,
  header,
  rightContent,
  fullWidth,
}) => {
  const base = { padding: 20 }
  const style = fullWidth ? { ...base } : { ...base, margin: '0 auto' }

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

export default PageDoubleCol
