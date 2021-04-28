import React, { useEffect, useState } from 'react'
import { Card, List, Avatar, Radio, Space, Button, Row, Select } from 'antd'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { useVeramo } from '@veramo-community/veramo-react'
import { format } from 'date-fns'
import md5 from 'md5'
import useSelectedCredentials from '../../hooks/useSelectCredentials'
import { signVerifiablePresentation } from '../../utils/signing'

// Move
const GRAVATAR_URI = 'https://www.gravatar.com/avatar/'
const uri = (did: string) => {
  return GRAVATAR_URI + md5(did) + '?s=200&d=retro'
}

interface CreateResponseProps {}

const CreateResponse: React.FC<CreateResponseProps> = ({}) => {
  const { agent } = useVeramo()
  const [presenter, setPresenter] = useState<string>()
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
  const { data: managedIdentifiers, isLoading: identifiersLoading } = useQuery(
    ['managed-identifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const { selected, onSelect, valid } = useSelectedCredentials(sdr)

  const shareVCPresentation = async () => {
    const presentation = await signVerifiablePresentation(
      agent,
      presenter as string,
      [message?.from as string],
      Object.keys(selected).map((key) => selected[key].vc),
      'jwt',
    )

    console.log(presentation)
  }

  // console.log('sdr', sdr)
  // console.log('selected', selected)
  // console.log('managedIdentifiers', managedIdentifiers)

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
                style={{ width: '60%' }}
                loading={identifiersLoading}
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
            <Radio.Group
              key={i}
              onChange={(e) => onSelect(e.target.value, claim.claimType)}
              value={selected[claim.claimType]?.vc}
            >
              <Card.Meta
                style={{ marginTop: 20, marginBottom: 10 }}
                title={claim.claimType.toUpperCase()}
              ></Card.Meta>
              <Space direction="vertical">
                {claim.credentials.map((vc, i) => {
                  return (
                    <Radio key={i} value={vc} style={{ display: 'flex' }}>
                      {vc.credentialSubject[claim.claimType]}
                    </Radio>
                  )
                })}
              </Space>
            </Radio.Group>
          )
        })}

      <Row style={{ marginTop: 20 }}>
        <Button
          type="primary"
          disabled={!valid}
          onClick={() => shareVCPresentation()}
        >
          Share Credentials
        </Button>
      </Row>
    </Card>
  )
}

export default CreateResponse
