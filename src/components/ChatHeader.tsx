import React, { useEffect, useState } from 'react'
import { Row, Button, theme, Dropdown, Space } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { useChat } from '../context/ChatProvider'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDDiscovery } from '@veramo/did-discovery'
import { useQuery } from 'react-query'
import { FormOutlined } from '@ant-design/icons'
import { IIdentifier } from '@veramo/core'
import IdentifierProfile from './IdentifierProfile'
import {
  IIdentifierProfile,
  IIdentifierProfilePlugin,
} from '../context/plugins/IdentifierProfile'
import NewChatThreadModal from './NewChatThreadModal'
const { useToken } = theme

interface ChatHeaderProps {}

const ChatHeader: React.FC<ChatHeaderProps> = () => {
  const { token } = useToken()
  const { agent } = useVeramo<IDIDDiscovery & IIdentifierProfilePlugin>()
  const { selectedDid, setSelectedDid, setComposing, setNewRecipient } =
    useChat()
  const [agentChatIdentifiers, setAgentChatIdentifiers] = useState<
    IIdentifier[]
  >([])
  const [
    agentChatIdentifiersWithProfiles,
    setAgentChatIdentifiersWithProfiles,
  ] = useState<IIdentifierProfile[]>([])

  const [newThreadModalVisible, setNewThreadModalVisible] =
    useState<boolean>(false)

  const composeNewThread = () => {
    setComposing(true)
    setNewThreadModalVisible(true)
  }

  useQuery(
    ['identifiers', { id: agent?.context.id }],
    () => agent?.didManagerFind(),
    {
      onSuccess: (data: IIdentifier[]) => {
        if (data) {
          const didsWithDIDComm = data.filter((did) =>
            did.keys.some(
              (key) => key.type === 'X25519' || key.type === 'Ed25519',
            ),
          )
          setAgentChatIdentifiers(didsWithDIDComm)
          setSelectedDid(didsWithDIDComm[0].did)
        }
      },
    },
  )

  useEffect(() => {
    if (agent) {
      Promise.all(
        agentChatIdentifiers.map((identifier) => {
          return agent.getIdentifierProfile({ did: identifier.did })
        }),
      )
        .then((profiles) => {
          setAgentChatIdentifiersWithProfiles(profiles)
        })
        .catch(console.log)
    }
  }, [agentChatIdentifiers, agent])

  return (
    <>
      <Row align={'top'} justify={'space-between'}>
        {agentChatIdentifiersWithProfiles.length > 0 && (
          <Dropdown
            overlayStyle={{ width: '160px', height: '50px' }}
            menu={{
              items: [
                ...agentChatIdentifiersWithProfiles.map((profile) => {
                  return {
                    key: profile.did,
                    onClick: () => setSelectedDid(profile.did),
                    label: <IdentifierProfile did={profile.did} />,
                  }
                }),
              ],
              selectable: true,
              defaultSelectedKeys: [selectedDid],
            }}
          >
            <Button style={{ height: 'auto', border: 0 }} type={'text'}>
              <Space>
                {selectedDid && <IdentifierProfile did={selectedDid} />}
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        )}
        <Button
          style={{ margin: token.margin }}
          onClick={() => composeNewThread()}
          icon={<FormOutlined style={{ fontSize: 20 }} />}
          type={'text'}
        />
      </Row>

      <NewChatThreadModal
        visible={newThreadModalVisible}
        onCancel={() => {
          setNewThreadModalVisible(false)
          setComposing(false)
        }}
        onCreate={(did) => {
          setNewRecipient(did)
          setNewThreadModalVisible(false)
        }}
      />
    </>
  )
}

export default ChatHeader
