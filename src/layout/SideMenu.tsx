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
            <Avatar
              size="large"
              style={{ marginRight: 15 }}
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.hdwallpaper.nu%2Fwp-content%2Fuploads%2F2015%2F02%2Ffunny_cat_face_pictures.jpg&f=1&nofb=1"
            />
          }
          title="My Agent"
          className="agent-selector"
        >
          <Menu.Item key="1">
            <Link to="/">All</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/">Agent 1</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="/">Agent 2</Link>
          </Menu.Item>
          <Menu.Divider></Menu.Divider>
          <Menu.Item key="6" icon={<PlusOutlined />}>
            <Link to="/">Connect Agent</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<CloudServerOutlined />}>
            <Link to="/">Manage Agent</Link>
          </Menu.Item>
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
