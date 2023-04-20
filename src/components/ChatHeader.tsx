import React, { useState } from 'react'
import { Row, Col, Avatar, Button, Select, theme } from 'antd'
import { useChat } from '../context/ChatProvider'
import { identiconUri } from '../utils/identicon'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDDiscovery } from '@veramo/did-discovery'
import { useQuery } from 'react-query'
import { FormOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { IIdentifier } from '@veramo/core'
import Title from 'antd/lib/typography/Title'
import DIDDiscoveryBar from './DIDDiscoveryBar'
const { useToken } = theme
const { Option } = Select

interface ChatHeaderProps {}

const ChatHeader: React.FC<ChatHeaderProps> = () => {
  const { token } = useToken()
  const { agent } = useVeramo<IDIDDiscovery>()
  const {
    selectedDid,
    setSelectedDid,
    composing,
    setComposing,
    setNewRecipient,
  } = useChat()
  const navigate = useNavigate()
  const [agentChatIdentifiers, setAgentChatIdentifiers] = useState<
    IIdentifier[]
  >([])

  const composeNewThread = () => {
    navigate('/chats/threads/new-thread')
    setComposing(true)
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

  const { data: selectedDidProfiles } = useQuery(
    ['selectedDidProfileCredentials', { id: agent?.context.id, selectedDid }],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [
          { column: 'issuer', value: [selectedDid], op: 'Equal' },
          {
            column: 'type',
            value: ['VerifiableCredential,ProfileCredentialSchema'],
            op: 'Equal',
          },
        ],
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
      }),
  )
  const name =
    selectedDidProfiles &&
    selectedDidProfiles.length > 0 &&
    selectedDidProfiles[0].verifiableCredential.credentialSubject.name
  const avatar =
    selectedDidProfiles &&
    selectedDidProfiles.length > 0 &&
    selectedDidProfiles[0].verifiableCredential.credentialSubject.avatar
  const uri = avatar || (selectedDid && identiconUri(selectedDid))

  return (
    <Row
      style={{
        borderBottom: `1px solid ${token.colorBorder}`,
        height: 80,
        alignItems: 'center',
      }}
    >
      <Col xs={10} sm={10} md={10} lg={10} xl={8}>
        <Row
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <div style={{ alignItems: 'center', flexShrink: 1, display: 'flex' }}>
            {uri ? (
              <Avatar size={35} src={uri} style={{ marginLeft: 27 }} />
            ) : (
              <Avatar size={50} />
            )}
            <Title level={5}>{name}</Title>
          </div>
          <Col style={{ marginLeft: 24, flex: 1 }}>
            {agentChatIdentifiers.length > 0 && (
              <Select
                defaultValue={selectedDid}
                style={{ width: '160px' }}
                onChange={(value) => {
                  const id = agentChatIdentifiers.filter(
                    (id) => id.did === value,
                  )[0]
                  setSelectedDid(id.did)
                }}
              >
                {agentChatIdentifiers.map((identifier) => {
                  return (
                    <Option value={identifier.did} key={identifier.did}>
                      {identifier.alias} - {identifier.did}
                    </Option>
                  )
                })}
              </Select>
            )}
          </Col>
          <Col>
            <Button
              onClick={() => composeNewThread()}
              style={{ marginRight: 20 }}
              icon={<FormOutlined style={{ fontSize: 20 }} />}
              type={'text'}
            />
          </Col>
        </Row>
      </Col>
      <Col xs={14} sm={14} md={14} lg={14} xl={16}>
        {composing && (
          <Row
            style={{
              alignItems: 'center',
            }}
          >
            <Col>
              <Avatar size={50} />
            </Col>
            <Col
              flex={1}
              style={{
                paddingLeft: 15,
                paddingRight: 24,
              }}
            >
              <DIDDiscoveryBar
                handleSelect={(value: any) => setNewRecipient(value)}
              />
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default ChatHeader
