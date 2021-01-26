import React from 'react'
import { Layout, Menu, Avatar } from 'antd'
import {
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

const { Sider } = Layout
const { SubMenu } = Menu

const SideMenu = () => {
  return (
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
            <Avatar style={{ marginRight: 15 }} icon={<AntDesignOutlined />} />
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
        <Menu.Item key="10" icon={<EyeOutlined style={{ fontSize: '17px' }} />}>
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
  )
}

export default SideMenu
