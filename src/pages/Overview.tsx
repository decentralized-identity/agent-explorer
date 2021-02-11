import React from 'react'
import { Typography, Card, Layout } from 'antd'
import Page from '../layout/Page'
import Chart from '../components/simple/Chart'
import { chart2 } from '../stubbs/chart'

const { Title } = Typography

const Overview = () => {
  const rightContent = () => {
    return (
      <Layout>
        <Card title="Agent Module">
          <p>Card content</p>
          <p>Card content</p>
        </Card>
        <Card title="Side Module">
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
    >
      <Card title="Credentials Issued">
        <Chart type="bar" data={chart2} />
      </Card>
    </Page>
  )
}

export default Overview
