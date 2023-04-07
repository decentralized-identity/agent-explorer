import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'

import Sidemenu from '../layout/SideMenu'
import Connect from '../pages/Connect'
import Overview from '../pages/Overview'
import Identifiers from '../pages/Identifiers'
import Identifier from '../pages/Identifier'
import Credentials from '../pages/Credentials'
import Credential from '../pages/Credential'
import Activity from '../pages/Messages'
import Requests from '../pages/Requests'
import Inbox from '../pages/Inbox'
import Network from '../pages/Network'
import Discover from '../pages/Discover'
import Settings from '../pages/Settings'
import Agents from '../pages/Agents'
import Agent from '../pages/Agent'
import Chats from '../pages/Chats'

const { Content } = Layout

const Frame = () => {
  const { agent } = useVeramo()

  return (
    <Layout style={{ height: '100%' }}>
      <Sidemenu />
      <Layout>
        <Content className="main-content-container">
          <Routes>
            <Route path="/connect" element={<Connect />} />
            {agent ? (
              <>
                <Route path="/" element={<Overview />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/agent/:id" element={<Agent />} />
                <Route path="/chats/threads/:threadId" element={<Chats />} />
                <Route path="/identifiers" element={<Identifiers />} />
                <Route path="/identifier/:id" element={<Identifier />} />
                <Route path="/credentials" element={<Credentials />} />
                <Route path="/credential/:id" element={<Credential />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/requests/*" element={<Requests />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/network" element={<Network />} />
                <Route path="/discover" element={<Discover />} />
              </>
            ) : (
              <Route path="/" element={<Navigate replace to="/connect" />} />
            )}
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Frame
