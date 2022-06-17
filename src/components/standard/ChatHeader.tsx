import React, { useState } from 'react'
import { Row, Col, Avatar, Button, Input, AutoComplete, Select } from 'antd'
import { useChat } from '../../context/ChatProvider'
import { identiconUri } from '../../utils/identicon'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDDiscovery } from '@veramo/did-discovery'
import { useQuery } from 'react-query'
import { FormOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import { SelectProps } from 'antd/es/select'
import { IIdentifier } from '@veramo/core'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'

const { Option } = Select

interface ChatHeaderProps {}

const ChatHeader: React.FC<ChatHeaderProps> = () => {
  const { agent } = useVeramo<IDIDDiscovery>()
  // const [uri, setUri] = useState<string>()
  const {
    selectedDid,
    setSelectedDid,
    composing,
    setComposing,
    newRecipient,
    setNewRecipient,
  } = useChat()
  const history = useHistory()
  const [options, setOptions] = useState<SelectProps<object>['options']>([])
  const [agentChatIdentifiers, setAgentChatIdentifiers] = useState<
    IIdentifier[]
  >([])

  const searchResult = async (query: string) => {
    const response = await agent?.discoverDid({ query })
    const selectOptions: Array<{ value: string; label: any }> = []
    response?.results.forEach((r) => {
      r.matches.forEach((m) => {
        selectOptions.push({
          value: m.did,
          label: (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span>{m.did}</span>
              <span>{r.provider}</span>
            </div>
          ),
        })
      })
    })
    return selectOptions
  }

  const handleSearch = async (value: string) => {
    setOptions(value ? await searchResult(value) : [])
  }

  const onSelect = (value: string) => {
    console.log('onSelect', value)
  }

  const composeNewThread = () => {
    history.push('/chats/threads/new-thread')
    setComposing(true)
  }

  useQuery(
    ['identifiers', { id: agent?.context.id }],
    () => agent?.didManagerFind(),
    {
      onSuccess: (data: IIdentifier[]) => {
        if (data) {
          const didsWithDIDComm = data.filter((did) =>
            did.services.some((service) => service.type === 'DIDCommMessaging'),
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
        backgroundColor: '#eaeaea',
        borderBottom: '1px solid white',
        height: 80,
        alignItems: 'center',
      }}
    >
      <Col xs={10} sm={10} md={10} lg={10} xl={8}>
        <Row
          style={{
            alignItems: 'center',
          }}
        >
          <Col>
            <Row style={{ alignItems: 'center' }}>
              {uri ? (
                <Avatar size={35} src={uri} style={{ marginLeft: 27 }} />
              ) : (
                <Avatar size={50} />
              )}
              <Title level={5}>{name}</Title>
            </Row>
          </Col>
          <Col style={{ marginLeft: 24, flex: 1 }}>
            {agentChatIdentifiers.length > 0 && (
              <Select
                defaultValue={selectedDid}
                style={{ width: 480 }}
                onChange={(value) => {
                  const id = agentChatIdentifiers.filter(
                    (id) => id.did === value,
                  )[0]
                  setSelectedDid(id.did)
                }}
              >
                {agentChatIdentifiers.map((identifier) => {
                  return (
                    <Option value={identifier.did}>{identifier.did}</Option>
                  )
                })}
              </Select>
            )}
          </Col>
          <Button
            onClick={() => composeNewThread()}
            style={{ marginRight: 20 }}
            icon={<FormOutlined style={{ fontSize: 20 }} />}
            type={'text'}
          />
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
              <Row>
                <AutoComplete
                  dropdownMatchSelectWidth={true}
                  style={{ width: '100%' }}
                  options={options}
                  onSelect={onSelect}
                  onSearch={handleSearch}
                >
                  <Input
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      paddingTop: 10,
                      paddingBottom: 10,
                    }}
                  />
                </AutoComplete>
              </Row>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  )
}

export default ChatHeader
