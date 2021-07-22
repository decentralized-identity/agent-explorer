import React, { useState } from 'react'
import { Card, Avatar, Radio, Space, Button, Row, Select } from 'antd'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { useVeramo } from '@veramo-community/veramo-react'
import { format } from 'date-fns'
import md5 from 'md5'
import useSelectedCredentials from '../../hooks/useSelectCredentials'
import { signVerifiablePresentation } from '../../utils/signing'
import { v4 as uuidv4 } from 'uuid'

// Move
const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'
const uri = (did: string) => {
  return GRAVATAR_URI + md5(did) + '?s=200&d=retro'
}

interface CreateResponseProps {}

const CreateResponse: React.FC<CreateResponseProps> = () => {
  const { agent } = useVeramo()
  const [presenter, setPresenter] = useState<string>('')
  const { messageId } = useParams<{ messageId: string }>()
  const { data: message, isLoading } = useQuery(
    ['message', { agentId: agent?.context.name }],
    () => agent?.dataStoreGetMessage({ id: messageId }),
  )
  const { data: sdr } = useQuery(
    [
      'sdr-credentials',
      { agentId: agent?.context.name, sdr: message && message.data },
    ],
    () => {
      if (message) {
        // @ts-ignore
        return agent?.getVerifiableCredentialsForSdr({ sdr: message.data })
      }
    },
    { enabled: !!message },
  )

  const { selected, onSelect, valid } = useSelectedCredentials(sdr)

  const { data: managedIdentifiers, isLoading: identifiersLoading } = useQuery(
    ['managed-identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const shareVCPresentation = async () => {
    const presentation = await signVerifiablePresentation(
      agent,
      presenter as string,
      [message?.from as string],
      Object.keys(selected).map((key) => selected[key].vc),
      'jwt',
    )
    if (presentation) {
      const messageId = uuidv4()
      const didCommMessage = {
        type: 'application/didcomm-encrypted+json',
        to: message?.from as string,
        from: presenter as string,
        id: messageId,
        body: presentation,
      }

      const packedMessage = await agent?.packDIDCommMessage({
        packing: 'anoncrypt',
        message: didCommMessage,
      })

      if (packedMessage) {
        await agent?.sendDIDCommMessage({
          messageId: messageId,
          packedMessage,
          recipientDidUrl: message?.from as string,
        })
      }
    }
    setPresenter('')
  }

  return (
    <Card loading={isLoading} title="Request Message">
      {message && (
        <>
          <Card.Meta
            avatar={<Avatar size="large" src={uri(message.from || '')} />}
            title={message.from}
            description={'Request to share data'}
          ></Card.Meta>

          <Card.Meta
            style={{ marginTop: 20 }}
            title={'Issuance Date'}
            description={format(
              new Date(message.createdAt as string),
              'do MMM yyyy',
            )}
          ></Card.Meta>
          <Card.Meta
            style={{ marginTop: 20 }}
            title={'Presenter'}
            description={
              <Select
                style={{ width: '80%' }}
                loading={identifiersLoading}
                value={presenter}
                onChange={(val) => setPresenter(val as string)}
              >
                {managedIdentifiers &&
                  managedIdentifiers?.map((identifier) => {
                    return (
                      <Select.Option
                        value={identifier.did}
                        key={identifier.did}
                      >
                        {identifier.did}
                      </Select.Option>
                    )
                  })}
              </Select>
            }
          ></Card.Meta>

          <Card.Meta
            style={{ marginTop: 20 }}
            title={'Requested claims'}
            description={'Choose credentials to share'}
          ></Card.Meta>
        </>
      )}

      {sdr &&
        // @ts-ignore
        sdr.map((claim, i) => {
          return (
            <div key={i}>
              <Card.Meta
                style={{ marginTop: 20, marginBottom: 10 }}
                title={claim.claimType.toUpperCase()}
              ></Card.Meta>
              {claim.credentials.length === 0 && (
                <Card.Meta description="You do not have credentials that match this requirement"></Card.Meta>
              )}
              <Radio.Group
                onChange={(e) => onSelect(e.target.value, claim.claimType)}
                value={selected[claim.claimType]?.vc}
              >
                <Space direction="vertical">
                  {claim.credentials.map((vc, i) => {
                    return (
                      <Radio key={i} value={vc} style={{ display: 'flex' }}>
                        {
                          vc.verifiableCredential.credentialSubject[
                            claim.claimType
                          ]
                        }
                      </Radio>
                    )
                  })}
                </Space>
              </Radio.Group>
            </div>
          )
        })}

      <Row style={{ marginTop: 20 }}>
        <Button
          type="primary"
          disabled={!valid || !presenter}
          onClick={() => shareVCPresentation()}
        >
          Share Credentials
        </Button>
      </Row>
    </Card>
  )
}

export default CreateResponse
