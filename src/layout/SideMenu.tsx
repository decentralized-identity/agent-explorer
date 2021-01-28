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
import { Link } from 'react-router-dom'
import { useAgent } from '../agent'

const { Sider } = Layout
const { SubMenu } = Menu

const SideMenu = () => {
  const { agent, agents } = useAgent()

  console.log(agents)

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
        className="main-menu"
        mode="inline"
        defaultSelectedKeys={['4']}
        style={{ width: 250 }}
      >
        <SubMenu
          key="connected-agents"
          icon={
            <Avatar
              size="large"
              style={{ marginRight: 15 }}
              src={agent.context?.picture}
            />
          }
          title={agent.context?.name}
          className="agent-selector"
        >
          <Menu.Item key="1">
            <Link to="/">All</Link>
          </Menu.Item>
          {agents.map((_agent: any, index: number) => {
            return (
              <Menu.Item key={index}>
                <Link to="/">{_agent.context?.name}</Link>
              </Menu.Item>
            )
          })}
        </SubMenu>
        <Menu.Item key="10" icon={<EyeOutlined style={{ fontSize: '17px' }} />}>
          <Link to="/overview">Overview</Link>
        </Menu.Item>
        <Menu.Item
          key="11"
          icon={<UserOutlined style={{ fontSize: '17px' }} />}
        >
          <Link to="/identifiers">Identifiers</Link>
        </Menu.Item>
        <Menu.Item
          key="12"
          icon={<SafetyOutlined style={{ fontSize: '17px' }} />}
        >
          <Link to="/credentials">Credentials</Link>
        </Menu.Item>
        <Menu.Item
          key="13"
          icon={<MessageOutlined style={{ fontSize: '17px' }} />}
        >
          <Link to="/messages">Messages</Link>
        </Menu.Item>
        <Menu.Item
          key="14"
          icon={<DeploymentUnitOutlined style={{ fontSize: '17px' }} />}
        >
          <Link to="/network">Network</Link>
        </Menu.Item>
        <Menu.Item
          key="15"
          icon={<SearchOutlined style={{ fontSize: '17px' }} />}
        >
          <Link to="/discover">Discover</Link>
        </Menu.Item>
      </Menu>
      <Menu
        className="secondary-menu"
        mode="inline"
        defaultSelectedKeys={['4']}
        style={{
          width: 250,
          position: 'absolute',
          bottom: 0,
          marginBottom: 50,
        }}
      >
        <Menu.Item>
          <Link to="/settings">Settings</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/">Contribute</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default SideMenu
