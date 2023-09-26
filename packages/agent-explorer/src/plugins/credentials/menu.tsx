import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { useVeramo } from "@veramo-community/veramo-react";
import { IDataStore, UniqueVerifiableCredential } from "@veramo/core-types";
import { App, MenuProps } from "antd";

export const getCredentialContextMenuItems = (credential: UniqueVerifiableCredential): MenuProps['items'] => {
  const { notification } = App.useApp()
  const { agents, getAgent, agent } = useVeramo<IDataStore>()
  const { verifiableCredential, hash } = credential

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

  const agentsToCopyTo = agents.filter((agent) =>
    agent.availableMethods().includes('dataStoreSaveVerifiableCredential'),
  )



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

  return [
    {
      key: 'download',
      label: 'Download',
      icon: <DownloadOutlined />,
      onClick: handleDownload,
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
  ]
}