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
        theme={'light'}
        mode="inline"
        defaultSelectedKeys={['4']}
        style={{ height: '100%', width: 250 }}
      >
        <SubMenu
          key="sub1"
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
          <Link to="/">Overview</Link>
        </Menu.Item>
        <Menu.Item
          key="11"
          icon={<UserOutlined style={{ fontSize: '17px' }} />}
        >
          <Link to="/2col">Identifiers</Link>
        </Menu.Item>
        <Menu.Item
          key="12"
          icon={<SafetyOutlined style={{ fontSize: '17px' }} />}
        >
          <Link to="/settings">Credentials</Link>
        </Menu.Item>
        <Menu.Item
          key="13"
          icon={<MessageOutlined style={{ fontSize: '17px' }} />}
        >
          <Link to="/">Messages</Link>
        </Menu.Item>
        <Menu.Item
          key="14"
          icon={<DeploymentUnitOutlined style={{ fontSize: '17px' }} />}
        >
          <Link to="/">Network</Link>
        </Menu.Item>
        <Menu.Item
          key="15"
          icon={<SearchOutlined style={{ fontSize: '17px' }} />}
        >
          <Link to="/">Discover</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default SideMenu
