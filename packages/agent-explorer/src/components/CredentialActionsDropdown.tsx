import { Dropdown, App } from 'antd'
import React from 'react'
import { useVeramo } from '@veramo-community/veramo-react'
import { useNavigate } from 'react-router-dom'
import { DeleteOutlined, DownloadOutlined, InfoCircleOutlined, PicLeftOutlined } from '@ant-design/icons'
import { IDataStore, UniqueVerifiableCredential } from '@veramo/core'
import { getIssuerDID } from '../utils/did'

const CredentialActionsDropdown: React.FC<{
  children: React.ReactNode
  uniqueCredential: UniqueVerifiableCredential
}> = ({ children, uniqueCredential:{ hash, verifiableCredential } }) => {
  const { agents, getAgent, agent } = useVeramo<IDataStore>()
  const navigate = useNavigate()
  const { notification } = App.useApp()

  const agentsToCopyTo = agents.filter((agent) =>
    agent.availableMethods().includes('dataStoreSaveVerifiableCredential'),
  )

  const handleCopyTo = async (agentId: string) => {
    const agent = getAgent(agentId)
    try {
      await agent.dataStoreSaveVerifiableCredential({
        verifiableCredential,
      })
      notification.success({
        message: 'Credential copied to: ' + agent.context.name,
      })
    } catch (e: any) {
      notification.error({
        message: 'Error copying credential to: ' + agent.context.name,
        description: e.message,
      })
    }
  }

  const handleDelete = async () => {
    try {
      await agent?.dataStoreDeleteVerifiableCredential({
        hash,
      })
      notification.success({
        message: 'Credential deleted',
      })
    } catch (e: any) {
      notification.error({
        message: 'Error deleting credential',
        description: e.message,
      })
    }
  }

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

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(verifiableCredential, null, 2)], {
      type: 'text/plain',
    })
    element.href = URL.createObjectURL(file)
    element.download = 'verifiable-credential.json'
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
  }

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: 'issuer',
            label: 'Issuer',
            icon: <InfoCircleOutlined />,
            onClick: () => navigate('/contacts/' + getIssuerDID(verifiableCredential)),
          },
          {
            key: 'subject',
            label: 'Subject',
            icon: <InfoCircleOutlined />,
            onClick: () =>
              navigate(
                '/contacts/' +
                  encodeURIComponent(verifiableCredential.credentialSubject.id as string),
              ),
          },
          {
            key: 'download',
            label: 'Download',
            icon: <DownloadOutlined />,
            onClick: handleDownload,
          },
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
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            onClick: handleDelete,
          },
          {
            key: 'copy',
            label: 'Copy to',
            type: 'group',
            children: agentsToCopyTo.map((_agent: any, index: number) => {
              return {
                key: index,
                onClick: () => handleCopyTo(_agent.context?.id),
                label: _agent.context?.name,
              }
            }),
          },
        ],
      }}
    >
      {children}
    </Dropdown>
  )
}
export default CredentialActionsDropdown
