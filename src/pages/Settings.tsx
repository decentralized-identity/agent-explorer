import React from 'react'
import { Typography, Card, Layout, Button } from 'antd'
import Page from '../layout/Page'
import ThemeModule from '../components/standard/ThemeSwitch'
import Version from '../components/standard/Version'
import Web3 from '../components/standard/Web3'
import sendMessage from '../context/libp2p/libp2p-dialer'

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
        <Title level={5}>Web3</Title>
        <Web3 />
        <Title level={5}>Test DIDComm over libp2p</Title>
        <Card>
          <Button
            onClick={() => {
              sendMessage(
                'QmWxH8kQTSMGcCKutW57SUVzQuvveKbJqMxuErA6tkFsj7',
                'ok this is the message',
              )
            }}
          >
            Do Thing
          </Button>
        </Card>
      </Content>
    </Page>
  )
}

export default Settings
