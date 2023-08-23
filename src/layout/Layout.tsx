import { MenuDataItem, ProLayout } from '@ant-design/pro-components'
import {
  EyeOutlined,
  UserOutlined,
  SafetyOutlined,
  BarsOutlined,
  InteractionOutlined,
  MessageOutlined,
  SettingOutlined,
  GlobalOutlined,
  FileProtectOutlined,
} from '@ant-design/icons'
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom'
import Connect from '../pages/Connect'
import Identifier from '../pages/Identifier'
import Credentials from '../pages/Credentials'
import Credential from '../pages/Credential'
import Activity from '../pages/Messages'
import Requests from '../pages/Requests'
import Agents from '../pages/Agents'
import Agent from '../pages/Agent'
import Chats from '../pages/Chats'
import { useVeramo } from '@veramo-community/veramo-react'
import CreateResponse from '../components/CreateResponse'
import Statistics from '../pages/Statistics'
import md5 from 'md5'
import AgentDropdown from '../components/AgentDropdown'
import KnownIdentifiers from '../pages/KnownIdentifiers'
import ManagedIdentifiers from '../pages/ManagedIdentifiers'
import CredentialVerifier from '../pages/CredentialVerifier'
import { usePlugins } from '../context/PluginProvider'
import { Appearance } from '../pages/settings/Appearance'
import { Plugins } from '../pages/settings/Plugins'
import { Web3 } from '../pages/settings/Web3'
import { Version } from '../pages/settings/Version'

const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'

const Layout = () => {
  const { agent } = useVeramo()
  const { plugins } = usePlugins()
  const location = useLocation()

  const availableMethods = agent?.availableMethods() || []
  const currentAgentName = agent?.context?.name || 'No Agent Connected'

  const uri =
    agent?.context?.name &&
    GRAVATAR_URI + md5(agent?.context?.name) + '?s=200&d=retro'

  const mainMenuItems: MenuDataItem = []

  if (availableMethods.includes('dataStoreORMGetVerifiableCredentials')) {
    mainMenuItems.push({
      path: '/statistics',
      name: 'Statistics',
      icon: <EyeOutlined />,
    })
  }
  if (availableMethods.includes('didManagerFind')) {
    mainMenuItems.push({
      path: '/managed-identifiers',
      name: 'Managed identifiers',
      icon: <UserOutlined />,
    })
  }

  if (availableMethods.includes('dataStoreORMGetVerifiableCredentials')) {
    mainMenuItems.push({
      path: '/credentials',
      name: 'Credentials',
      icon: <SafetyOutlined />,
    })
  }

  if (availableMethods.includes('dataStoreORMGetMessages')) {
    mainMenuItems.push({
      path: '/activity',
      name: 'Activity',
      icon: <BarsOutlined />,
    })
    mainMenuItems.push({
      path: '/requests',
      name: 'Requests',
      icon: <InteractionOutlined />,
    })
  }

  if (
    availableMethods.includes('packDIDCommMessage') &&
    availableMethods.includes('sendDIDCommMessage')
  ) {
    mainMenuItems.push({
      path: '/chats/threads',
      name: 'DID Chats',
      icon: <MessageOutlined />,
    })
  }

  if (availableMethods.includes('dataStoreORMGetIdentifiers')) {
    mainMenuItems.push({
      path: '/known-identifiers',
      name: 'Known identifiers',
      icon: <GlobalOutlined />,
    })
  }

  if (availableMethods.includes('verifyCredential')) {
    mainMenuItems.push({
      path: '/credential-verifier',
      name: 'Credential verifier',
      icon: <FileProtectOutlined />,
    })
  }

  plugins.forEach((plugin) => {
    if (plugin.config.enabled && plugin.menuItems) {
      mainMenuItems.push(...plugin.menuItems)
    }
  })

  mainMenuItems.push({ type: 'divider' })

  mainMenuItems.push({
    path: '/settings',
    name: 'Settings',
    icon: <SettingOutlined />,
    routes: [
      {
        name: 'Appearance',
        path: '/settings/appearance',
      },
      {
        name: 'Plugins',
        path: '/settings/plugins',
      },
      {
        name: 'Web3',
        path: '/settings/web3',
      },
      {
        name: 'Version',
        path: '/settings/version',
      },
    ]
  })



  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        locale="en-US"
        contentWidth="Fixed"
        title="Agent explorer"
        logo={require('../assets/icon.png')}

        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom
          }
          if (menuItemProps.path && location.pathname !== menuItemProps.path) {
            return (
              // handle wildcard route path, for example /slave/* from qiankun
              <Link
                to={menuItemProps.path.replace('/*', '')}
                target={menuItemProps.target}
              >
                {defaultDom}
              </Link>
            )
          }
          return defaultDom
        }}
        route={{
          routes: mainMenuItems,
        }}
        layout="mix"
        avatarProps={{
          src: uri,
          size: 'small',
          title: currentAgentName,
          render: (props, children) => (
            <AgentDropdown>{children}</AgentDropdown>
          ),
        }}
        token={{
          pageContainer: {
            paddingBlockPageContainerContent: 15,
            paddingInlinePageContainerContent: 15,
          },
        }}
      >
        <Routes>
          <Route path="/connect" element={<Connect />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent/:id" element={<Agent />} />
          <Route path="/chats/threads/:threadId" element={<Chats />} />
          <Route path="/chats/threads" element={<Chats />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/known-identifiers" element={<KnownIdentifiers />} />
          <Route path="/managed-identifiers" element={<ManagedIdentifiers />} />
          <Route path="/identifier/:id" element={<Identifier />} />
          <Route path="/credentials" element={<Credentials />} />
          <Route path="/credential/:id" element={<Credential />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/credential-verifier" element={<CredentialVerifier />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/requests/sdr/:messageId" element={<CreateResponse />} />
          
          <Route path="/settings/appearance" element={<Appearance />} />
          <Route path="/settings/plugins" element={<Plugins />} />
          <Route path="/settings/web3" element={<Web3 />} />
          <Route path="/settings/version" element={<Version />} />
          {!agent && (
            <Route path="/" element={<Navigate replace to="/connect" />} />
          )}
          {plugins.map((plugin) => {
            if (plugin.config.enabled && plugin.routes) {
              return plugin.routes.map((route) => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                )
              })
            }
            return null
          })}
        </Routes>
      </ProLayout>
    </div>
  )
}

export default Layout
