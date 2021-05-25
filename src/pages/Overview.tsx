import React from 'react'
import { Typography } from 'antd'
import Page from '../layout/Page'

const { Title } = Typography

const Overview = () => {
  return (
    <Page
      name="dashboard"
      header={<Title style={{ fontWeight: 'bold' }}>Dashboard</Title>}
    ></Page>
  )
}

export default Overview
