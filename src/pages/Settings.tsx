import React, { useContext } from 'react'
import { Typography, Card, Layout, Button } from 'antd'
import Page from '../layout/Page'
import ThemeModule from '../components/standard/ThemeSwitch'
import Version from '../components/standard/Version'
import Web3 from '../components/standard/Web3'
// import { useContext } from 'react-router/node_modules/@types/react'
import { Libp2pContext } from '../layout/App'
import createStream from '../context/libp2p/libp2p-dialer'

const { Title } = Typography
const { Content } = Layout

const Settings = () => {
  const libp2p = useContext(Libp2pContext)
  console.log('Settings libp2p: ', libp2p)
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
            onClick={async () => {
              const stream = await createStream(
                'QmWxH8kQTSMGcCKutW57SUVzQuvveKbJqMxuErA6tkFsj7',
                libp2p,
              )
              console.log('stream: ', stream)
              // sendMessage(
              //   'QmWxH8kQTSMGcCKutW57SUVzQuvveKbJqMxuErA6tkFsj7',
              //   'ok this is the message',
              // )
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
