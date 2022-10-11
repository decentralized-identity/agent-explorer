import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from 'antd'
import '../theme/base.less'
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

const { Header, Content } = Layout

const Frame = () => {
  const { agent } = useVeramo()

  return (
    <Layout style={{ height: '100%' }}>
      <Sidemenu />
      <Layout>
        <Header style={{ padding: 0 }} className="mobile-header"></Header>
        <Content className="main-content-container">
          <Routes>
            {agent ? (
              <>
                <Route path="/" element={<Overview />} />
                <Route path="/connect" element={<Connect />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/agent/:id" element={<Agent />} />
                <Route path="/chats/threads/:threadId" element={<Chats />} />
                <Route path="/identifiers" element={<Identifiers />} />
                <Route path="/identifier/:id" element={<Identifier />} />
                <Route path="/credentials" element={<Credentials />} />
                <Route path="/credential/:id" element={<Credential />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/network" element={<Network />} />
                <Route path="/discover" element={<Discover />} />
              </>
            ) : (
              <>
                <Navigate to="/connect" />
                <Route path="/connect" element={<Connect />} />
              </>
            )}

            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Frame
