import React, { FC, createElement, useState } from 'react'
import {
  Layout,
  Menu,
  Card,
  Avatar,
  Divider,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Radio,
} from 'antd'
import {
  MenuFoldOutlined,
  EyeOutlined,
  UserOutlined,
  SearchOutlined,
  SafetyOutlined,
  MessageOutlined,
  DeploymentUnitOutlined,
  AntDesignOutlined,
  PlusOutlined,
  CloudServerOutlined,
} from '@ant-design/icons'

import './theme/base.less'

const { Header, Content, Footer, Sider } = Layout
const { Title } = Typography
const { SubMenu } = Menu

const App: FC = () => {
  const [form] = Form.useForm()

  return (
    <Layout style={{ height: '100%' }}>
      <Sider
        breakpoint="sm"
        collapsedWidth="0"
        width="250"
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          zIndex: 100,
        }}
      >
        <div className="logo" />
        <Menu
          theme={'light'}
          mode="inline"
          defaultSelectedKeys={['4']}
          style={{ height: '100%', width: 250 }}
        >
          <SubMenu
            key="sub1"
            icon={
              <Avatar
                style={{ marginRight: 15 }}
                icon={<AntDesignOutlined />}
              />
            }
            title="Agent 1"
            style={{}}
          >
            <Menu.Item key="1">All</Menu.Item>
            <Menu.Item key="2">Agent 1</Menu.Item>
            <Menu.Item key="3">Agent 2</Menu.Item>
            <Menu.Item key="4">Agent 3</Menu.Item>
            <Menu.Item key="5">Agent 4</Menu.Item>
            <Menu.Divider></Menu.Divider>
            <Menu.Item key="6" icon={<PlusOutlined />}>
              Connect Agent
            </Menu.Item>
            <Menu.Item key="7" icon={<CloudServerOutlined />}>
              Manage Agents
            </Menu.Item>
          </SubMenu>
          <Menu.Item
            key="10"
            icon={<EyeOutlined style={{ fontSize: '17px' }} />}
          >
            Overview
          </Menu.Item>
          <Menu.Item
            key="11"
            icon={<UserOutlined style={{ fontSize: '17px' }} />}
          >
            Identifiers
          </Menu.Item>
          <Menu.Item
            key="12"
            icon={<SafetyOutlined style={{ fontSize: '17px' }} />}
          >
            Credentials
          </Menu.Item>
          <Menu.Item
            key="13"
            icon={<MessageOutlined style={{ fontSize: '17px' }} />}
          >
            Messages
          </Menu.Item>
          <Menu.Item
            key="14"
            icon={<DeploymentUnitOutlined style={{ fontSize: '17px' }} />}
          >
            Network
          </Menu.Item>
          <Menu.Item
            key="15"
            icon={<SearchOutlined style={{ fontSize: '17px' }} />}
          >
            Discover
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ padding: 0 }} className="mobile-header"></Header>
        <Content className="main-content-container">
          <div style={{ margin: '0 auto', maxWidth: 800 }}>
            <Row>
              <Col
                className="left-col"
                span={24}
                style={{ padding: '80px 20px 20px' }}
              >
                <Title>Connect Agent</Title>
                <Form form={form} layout={'vertical'}>
                  <Form.Item label="Agent Schema URL">
                    <Input size="large" placeholder="Agent schema" />
                  </Form.Item>
                  <Form.Item label="API Key">
                    <Input size="large" placeholder="API Key" />
                  </Form.Item>
                  <Form.Item>
                    <Button size="large" type="primary" block shape="round">
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
          {/* <Row>
            <Col className="left-col" xs={24} sm={24} lg={16}>
              <Title>Hello</Title>
            </Col>
            <Col className="right-col" xs={24} sm={24} lg={8}>
              Right Column
            </Col>
          </Row> */}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
