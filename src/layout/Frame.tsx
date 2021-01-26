import React from 'react'
import { Route } from 'react-router-dom'
import { Layout, Row, Col } from 'antd'
import Sidemenu from '../layout/SideMenu'
import Connect from '../pages/Connect'
import Connect2Col from '../pages/Connect2Col'
import '../theme/base.less'

const { Header, Content } = Layout

const Frame = () => {
  return (
    <Layout style={{ height: '100%' }}>
      <Sidemenu />
      <Layout>
        <Header style={{ padding: 0 }} className="mobile-header"></Header>
        <Content className="main-content-container">
          <div style={{ margin: '0 auto', maxWidth: 960, padding: 20 }}>
            <Route path="/" exact component={Connect} />
            <Route path="/2col" component={Connect2Col} />
            {/* <Row>
              <Col span={24} style={{ padding: '20px' }}>
                <Route path="/" exact component={Connect} />
                <Route path="/2col" component={Connect2Col} />
              </Col>
            </Row> */}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Frame
