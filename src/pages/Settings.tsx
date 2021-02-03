import React from 'react'
import { Typography, Card, Layout, Space } from 'antd'
import Page from '../layout/Page'
import ThemeModule from '../components/modules/ThemeSwitch'
import Version from '../components/widgets/Version'

const { Title } = Typography
const { Content } = Layout

const Settings = () => {
  return (
    <Page
      header={
        <Content style={{ marginBottom: 30 }}>
          <Title style={{ fontWeight: 'bold' }}>Settings</Title>
        </Content>
      }
    >
      <Content style={{ marginBottom: 30 }}>
        <Title level={5}>Version Info</Title>
        <Card>
          <Version />
        </Card>
        <Title level={5}>Viewing Mode</Title>
        <ThemeModule />
      </Content>
    </Page>
  )
}

export default Settings
