import React from 'react'
import { Typography, Card, Layout } from 'antd'
import Page from '../layout/Page'

const { Title } = Typography

const Overview = () => {
  const rightContent = () => {
    return (
      <Layout>
        <Card title="Page Module" loading>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
        <Card title="Page Module" loading>
          <p>Card content</p>
          <p>Card content</p>
        </Card>
      </Layout>
    )
  }

  return (
    <Page
      name="overview"
      header={<Title style={{ fontWeight: 'bold' }}>Overview</Title>}
      rightContent={rightContent()}
    ></Page>
  )
}

export default Overview
