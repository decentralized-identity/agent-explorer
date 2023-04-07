import React from 'react'
import { Layout, Menu, Avatar, Typography, Row, Button } from 'antd'
import type { MenuProps } from 'antd'
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
  SettingOutlined,
} from '@ant-design/icons'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useVeramo } from '@veramo-community/veramo-react'
import md5 from 'md5'

const { Sider } = Layout
const { Title, Text } = Typography

const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'

const subMenu: MenuProps['items'] = [
  {
    type: 'divider',
  },
  {
    key: '/connect',
    label: 'Connect Agent',
    icon: <PlusOutlined />,
  },
  {
    key: '/agents',
    label: 'Manage Agents',
    icon: <CloudServerOutlined />,
  },
]

const SideMenu = () => {
  const { agent, agents, setActiveAgentId, activeAgentId } = useVeramo()
  const navigate = useNavigate()
  const location = useLocation()

  const uri =
    agent?.context?.name &&
    GRAVATAR_URI + md5(agent?.context?.name) + '?s=200&d=retro'

  const availableMethods = agent?.availableMethods() || []
  const currentAgentName = agent?.context?.name || 'No Agent Connected'

  const mainMenuItems: MenuProps['items'] = [
    {
      key: 'connected-agents',
      icon: <Avatar size="large" style={{ marginRight: 15 }} src={uri} />,
      label: currentAgentName,
      className: 'agent-selector',
      children: [
        ...agents.map((_agent: any, index: number) => {
          return {
            key: index,
            onClick: () => setActiveAgentId(_agent.context?.id),
            icon: (
              <CheckCircleOutlined
                style={{
                  fontSize: '17px',
                  opacity: _agent.context?.id === activeAgentId ? 1 : 0.1,
                }}
              />
            ),
            label: _agent.context?.name,
          }
        }),
        ...subMenu,
      ],
    },
    {
      key: '/',
      label: 'Dashboard',
      icon: <EyeOutlined />,
    },
  ]

  if (availableMethods.includes('dataStoreORMGetIdentifiers')) {
    mainMenuItems.push({
      key: '/identifiers',
      label: 'Identifiers',
      icon: <UserOutlined />,
    })
  }

  if (availableMethods.includes('dataStoreORMGetVerifiableCredentials')) {
    mainMenuItems.push({
      key: '/credentials',
      label: 'Credentials',
      icon: <SafetyOutlined />,
    })
  }

  if (availableMethods.includes('dataStoreORMGetMessages')) {
    mainMenuItems.push({
      key: '/activity',
      label: 'Activity',
      icon: <BarsOutlined />,
    })
    mainMenuItems.push({
      key: '/requests',
      label: 'Requests',
      icon: <InteractionOutlined />,
    })
  }

  if (
    availableMethods.includes('packDIDCommMessage') &&
    availableMethods.includes('sendDIDCommMessage')
  ) {
    mainMenuItems.push({
      key: '/chats/threads/new-thread',
      label: 'DID Chats',
      icon: <MessageOutlined />,
    })
  }

  mainMenuItems.push({ type: 'divider' })
  mainMenuItems.push({
    key: '/settings',
    label: 'Settings',
    icon: <SettingOutlined />,
  })

  const onClick = (e: any) => {
    if (e.key.startsWith('/')) {
      navigate(e.key)
    }
  }

  return (
    <Sider breakpoint="sm" collapsedWidth="0" width="250">
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
          mode="inline"
          style={{ width: 250, height: '100%' }}
          onClick={onClick}
          selectedKeys={[location.pathname]}
          items={mainMenuItems}
        />
      )}
    </Sider>
  )
}

export default SideMenu
