import { Dropdown, App } from 'antd'
import React from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import { useNavigate } from 'react-router-dom'
import { PicLeftOutlined } from '@ant-design/icons'
import { IDataStore, UniqueVerifiableCredential } from '@veramo/core'
import { getIssuerDID } from '../utils/did.js'
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

  const handleCopyEmbed = () => {
    let embed = ''
    if (verifiableCredential.proof?.jwt) {
      embed = `\`\`\`vc+jwt\n${verifiableCredential.proof.jwt}\n\`\`\``
    } else {
      embed = `\`\`\`vc+json\n${JSON.stringify(verifiableCredential, null, 2)}\n\`\`\``
    }
    navigator.clipboard.writeText(embed)
    notification.success({
      message: 'Credential embed copied to clipboard',
    })
  }

  const handleCopyReference = () => {
    const reference = `\`\`\`vc+multihash\n${getIssuerDID(verifiableCredential)}/${hash}\n\`\`\``
    
    navigator.clipboard.writeText(reference)
    notification.success({
      message: 'Credential reference copied to clipboard',
    })
  }



  return (
    <Dropdown
      menu={{
        items: [
          ...menuItems,
          {
            key: 'embed',
            label: 'Copy embed',
            icon: <PicLeftOutlined />,
            onClick: handleCopyEmbed,
          },
          {
            key: 'reference',
            label: 'Copy reference',
            icon: <PicLeftOutlined />,
            onClick: handleCopyReference,
          },
        ],
      }}
    >
      {children}
    </Dropdown>
  )
}
