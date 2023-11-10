import { Dropdown, App } from 'antd'
import React from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import { useNavigate } from 'react-router-dom'
import { IDataStore, UniqueVerifiableCredential } from '@veramo/core'
import { usePlugins } from '../PluginProvider.js'
import { MenuProps } from 'antd'

export const CredentialActionsDropdown: React.FC<{
  children: React.ReactNode
  uniqueCredential: UniqueVerifiableCredential
}> = ({ children, uniqueCredential:{ hash, verifiableCredential } }) => {
  const { agents, getAgent, agent } = useVeramo<IDataStore>()
  const { plugins } = usePlugins()
  const navigate = useNavigate()
  const { notification } = App.useApp()

  let menuItems: MenuProps['items'] = []
  plugins.forEach((plugin) => {
    if (menuItems && plugin.config?.enabled && plugin.getCredentialContextMenuItems) {
      const items = plugin.getCredentialContextMenuItems({ hash, verifiableCredential })
      if (items) {
        menuItems = [...menuItems, ...items]
      }
    }
  })

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: [
          ...menuItems,
          
        ],
      }}
    >
      {children}
    </Dropdown>
  )
}
