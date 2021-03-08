import React from 'react'
import { Layout, Menu, Avatar, Typography, Row, Button } from 'antd'
import Version from '../components/standard/Version'
import {
  EyeOutlined,
  UserOutlined,
  SafetyOutlined,
  BarsOutlined,
  InteractionOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  CloudServerOutlined,
  MessageOutlined,
  DeploymentUnitOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useVeramo } from '@veramo-community/veramo-react'
import md5 from 'md5'

const { Sider } = Layout
const { SubMenu } = Menu
const { Title, Text } = Typography

const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'

const mainMenu = [
  {
    url: '/',
    label: 'Dashboard',
    icon: EyeOutlined,
  },
  {
    url: '/activity',
    label: 'Activity',
    icon: BarsOutlined,
  },
  {
    url: '/requests',
    label: 'Requests',
    icon: InteractionOutlined,
  },
  {
    url: '/managed-identifiers',
    label: 'Managed identifiers',
    icon: UserOutlined,
  },
  {
    url: '/identifiers',
    label: 'Identifiers',
    icon: UserOutlined,
  },
  {
    url: '/credentials',
    label: 'Credentials',
    icon: SafetyOutlined,
  },
  {
    url: '/messages',
    label: 'Messages',
    icon: MessageOutlined,
  },
  {
    url: '/network',
    label: 'Network',
    icon: DeploymentUnitOutlined,
  },
  {
    url: '/discover',
    label: 'Discover',
    icon: SearchOutlined,
  },
  {
    url: '/posts',
    label: 'Social Posts',
    icon: MessageOutlined,
  },
]

const subMenu = [
  {
    url: '/connect',
    label: 'Connect Agent',
    icon: PlusOutlined,
  },
  {
    url: '/agents',
    label: 'Manage Agents',
    icon: CloudServerOutlined,
  },
]

const SideMenu = () => {
  const { agent, agents, setActiveAgentId, activeAgentId } = useVeramo()
  const uri =
    agent?.context?.name &&
    GRAVATAR_URI + md5(agent?.context?.schema || ' ') + '?s=200&d=retro'

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
      {!agent && (
        <Row style={{ justifyContent: 'center', padding: '30px 5px' }}>
          <Title
            style={{
              textAlign: 'center',
              margin: '15px 0',
              fontWeight: 'bold',
            }}
            level={3}
          >
            Agent Explorer
          </Title>
          <Text
            style={{
              textAlign: 'center',
              margin: '15px 5px',
              fontWeight: 'bold',
            }}
          >
            Connect, manage and explore Veramo agents in one place
          </Text>
          <Button type="primary" size="large" shape="round">
            <Link to="/connect">Connect Agent</Link>
          </Button>
        </Row>
      )}
      {agent && (
        <Menu
          className="main-menu"
          mode="inline"
          defaultSelectedKeys={['4']}
          style={{ width: 250 }}
        >
          <SubMenu
            key="connected-agents"
            icon={<Avatar size="large" style={{ marginRight: 15 }} src={uri} />}
            title={agent.context?.name}
            className="agent-selector"
          >
            {agents.map((_agent: any, index: number) => {
              return (
                <Menu.Item
                  key={index}
                  onClick={() => setActiveAgentId(_agent.context?.id)}
                  icon={
                    <CheckCircleOutlined
                      style={{
                        fontSize: '17px',
                        opacity: _agent.context?.id === activeAgentId ? 1 : 0.1,
                      }}
                    />
                  }
                >
                  {_agent.context?.name}
                </Menu.Item>
              )
            })}
            <Menu.Divider></Menu.Divider>
            {subMenu.map((menuItem) => {
              return (
                <Menu.Item key={menuItem.label}>
                  <Link to={menuItem.url}>{menuItem.label}</Link>
                </Menu.Item>
              )
            })}
            <Menu.Divider></Menu.Divider>
          </SubMenu>
          {mainMenu.map((menuItem) => {
            return (
              <Menu.Item
                key={menuItem.label}
                icon={<menuItem.icon style={{ fontSize: '17px' }} />}
              >
                <Link to={menuItem.url}>{menuItem.label}</Link>
              </Menu.Item>
            )
          })}
        </Menu>
      )}
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
        <Menu.Item></Menu.Item>
        <Menu.Item>
          <Link to="/settings">Settings</Link>
          (<Version versionOnly />)
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/veramolabs"
          >
            Contribute
          </a>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default SideMenu
