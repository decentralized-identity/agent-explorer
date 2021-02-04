import React from 'react'
import { Typography, Card, Layout } from 'antd'
import Page from '../layout/Page'
import { useVeramo } from '@veramo-community/veramo-react'
import Chart from '../components/simple/Chart'

const { Title, Text } = Typography

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: '# of Credentials',
      data: [500, 897, 234, 564, 765, 432],
      backgroundColor: 'rgb(47 89 138 / 20%)',
      borderColor: 'rgb(47 89 138 / 80%)',
      borderWidth: 1,
    },
  ],
}

const data1 = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: '# of Identifiers',
      data: [500, 897, 234, 564, 765, 432],
      backgroundColor: 'rgb(47 89 138 / 20%)',
      borderColor: 'rgb(47 89 138 / 80%)',
      borderWidth: 1,
    },
  ],
}

const data2 = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: '# of Messages',
      data: [
        {
          x: 200,
          y: 400,
          r: 10,
        },
        {
          x: 400,
          y: 700,
          r: 5,
        },
        {
          x: 900,
          y: 100,
          r: 3,
        },
        {
          x: 543,
          y: 324,
          r: 12,
        },
        {
          x: 767,
          y: 364,
          r: 16,
        },
      ],
      backgroundColor: 'rgb(47 89 138 / 20%)',
      borderColor: 'rgb(47 89 138 / 80%)',
      borderWidth: 1,
    },
  ],
}

const Overview = () => {
  const { agent } = useVeramo()

  if (agent) {
    console.log('Default Agent', agent)
  }

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
      header={<Title style={{ fontWeight: 'bold' }}>Overview</Title>}
      rightContent={rightContent()}
    >
      <Card title="Credentials Issued">
        <Chart type="bar" data={data} />
      </Card>
      <Card title="New Identifiers">
        <Chart type="line" data={data1} />
      </Card>
      <Card title="Messages Activity">
        <Chart type="bubble" data={data2} />
      </Card>
    </Page>
  )
}

export default Overview
