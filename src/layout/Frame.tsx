import React from 'react'
import { Redirect, Route } from 'react-router-dom'
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
import Messages from '../pages/Messages'
import Inbox from '../pages/Inbox'
import Network from '../pages/Network'
import Discover from '../pages/Discover'
import Settings from '../pages/Settings'
import Agents from '../pages/Agents'
import Agent from '../pages/Agent'

const { Header, Content } = Layout

const Frame = () => {
  const { agent } = useVeramo()

  return (
    <Layout style={{ height: '100%' }}>
      <Sidemenu />
      <Layout>
        <Header style={{ padding: 0 }} className="mobile-header"></Header>
        <Content className="main-content-container">
          {agent ? (
            <>
              <Route path="/" exact component={Overview} />
              <Route path="/connect" component={Connect} />
              <Route path="/agents" exact component={Agents} />
              <Route path="/agent/:id" component={Agent} />
              <Route path="/identifiers" exact component={Identifiers} />
              <Route path="/identifier/:id" component={Identifier} />
              <Route path="/credentials" exact component={Credentials} />
              <Route path="/credential/:id" component={Credential} />
              <Route path="/messages" component={Messages} />
              <Route path="/inbox" component={Inbox} />
              <Route path="/network" component={Network} />
              <Route path="/discover" component={Discover} />
            </>
          ) : (
            <>
              <Redirect from="/" to="/connect" />
              <Route path="/connect" exact component={Connect} />
            </>
          )}

          <Route path="/settings" component={Settings} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default Frame
