import { MenuDataItem, ProLayout } from '@ant-design/pro-components'
import { SettingOutlined } from '@ant-design/icons'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { useVeramo } from '@veramo-community/veramo-react'
import md5 from 'md5'
import AgentDropdown from '../components/AgentDropdown'
import { usePlugins } from '../context/PluginProvider'
import { Landing } from '../pages/Landing'
import { Appearance } from '../pages/settings/Appearance'
import { Plugins } from '../pages/settings/Plugins'
import { Web3 } from '../pages/settings/Web3'
import { Version } from '../pages/settings/Version'
import { Agents } from '../pages/settings/Agents'
import { useTheme } from '../context/ThemeProvider'
import { Avatar, Space, Typography } from 'antd'
import { useState } from 'react'
import { theme } from 'antd'

const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'

const Layout = () => {
  const { agent } = useVeramo()
  const { plugins } = usePlugins()
  const location = useLocation()
  const { primaryColor } = useTheme()
  const [ collapsed, setCollapsed ] = useState(false)
  const { token } = theme.useToken()

  const availableMethods = agent?.availableMethods() || []


  const uri =
    agent?.context?.name &&
    GRAVATAR_URI + md5(agent?.context?.name) + '?s=200&d=retro'

  const mainMenuItems: MenuDataItem = []

  plugins.forEach((plugin) => {
    if (plugin.config.enabled 
      && plugin.menuItems 
      && (
        !plugin.requiredMethods 
        || plugin.requiredMethods && plugin.requiredMethods.every(method => availableMethods.includes(method)))
    ) {
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
        name: 'Agents',
        path: '/settings/agents',
      },
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
        contentWidth="Fixed"
        title="Agent explorer"
        logo={false}
        colorPrimary={primaryColor}
        // collapsed={collapsed}
        onCollapse={setCollapsed}
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
                state={menuItemProps.state}
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

        menuFooterRender={() => (

          <div style={{
            borderTop: '1px solid ' + token.colorBorder,
            paddingRight: token.paddingContentHorizontal,
            paddingLeft: token.paddingContentHorizontal,
            paddingTop: token.paddingContentHorizontal,
          }}>

          <AgentDropdown >
            <Space><Avatar src={uri} size={'small'}/>{!collapsed && <Typography.Text >{agent?.context.name}</Typography.Text>}</Space>
          </AgentDropdown>
          </div>
        )}
        token={{
          pageContainer: {
            paddingBlockPageContainerContent: 20,
            paddingInlinePageContainerContent: 20,
          },
        }}
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/settings/agents" element={<Agents />} />
          <Route path="/settings/appearance" element={<Appearance />} />
          <Route path="/settings/plugins" element={<Plugins />} />
          <Route path="/settings/web3" element={<Web3 />} />
          <Route path="/settings/version" element={<Version />} />
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
