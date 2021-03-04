import React from 'react'
import { Typography, Card, Layout } from 'antd'
import Page from '../layout/Page'
import ThemeModule from '../components/standard/ThemeSwitch'
import DebugSettings from '../components/modules/DebugSettings'
import Version from '../components/standard/Version'
import { Web3 } from '../web3/Web3'

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
        <Title level={5}>Debug</Title>
        <DebugSettings />

        <Title level={5}>Web3</Title>
        <Card>
          <Web3 />
        </Card>
      </Content>
    </Page>
  )
}

export default Settings
