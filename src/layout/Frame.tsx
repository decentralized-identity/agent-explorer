import React from 'react'
import { Route } from 'react-router-dom'
import { Layout, Row, Col } from 'antd'
import '../theme/base.less'

import Sidemenu from '../layout/SideMenu'
import Connect from '../pages/Connect'
import Overview from '../pages/Overview'
import Identifiers from '../pages/Identifiers'
import Credentials from '../pages/Credentials'
import Messages from '../pages/Messages'
import Network from '../pages/Network'
import Discover from '../pages/Discover'
import Settings from '../pages/Settings'

const { Header, Content } = Layout

const Frame = () => {
  return (
    <Layout style={{ height: '100%' }}>
      <Sidemenu />
      <Layout>
        <Header style={{ padding: 0 }} className="mobile-header"></Header>
        <Content className="main-content-container">
          <Route path="/" exact component={Connect} />
          <Route path="/overview" exact component={Overview} />
          <Route path="/identifiers" exact component={Identifiers} />
          <Route path="/credentials" exact component={Credentials} />
          <Route path="/messages" exact component={Messages} />
          <Route path="/network" exact component={Network} />
          <Route path="/discover" exact component={Discover} />
          <Route path="/settings" exact component={Settings} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default Frame
