import React, { useState } from 'react'
import { Alert, Button, Card } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'

interface IdentifierQuickSetupProps {
  title: string
  identifier: string
  cacheKey: any
}

const IdentifierQuickSetup: React.FC<IdentifierQuickSetupProps> = ({
  title,
  identifier,
  cacheKey,
}) => {
  const { agent } = useVeramo()
  const { data, isLoading } = useQuery(
    [cacheKey],
    () => agent?.didManagerFind({ provider: 'did:web' }),
    { enabled: !!identifier },
  )
  const [errorMessage, setErrorMessage] = useState('')
  const [enabled, setIsEnabled] = useState(true)

  const handleQuickSetup = async () => {
    setIsEnabled(false)
    if (!data || !(data.length > 0)) {
      setErrorMessage(
        "No DID Found with provider 'did:web'. Must have at least one did:web with DIDCommMessaging endpoint setup to use this feature.",
      )
      setIsEnabled(true)
      return
    }
    try {
      const serviceEndpoint = data[0].services.find(
        (e: any) => e.type === 'DIDCommMessaging',
      ).serviceEndpoint
      const key = await agent?.keyManagerCreate({
        kms: 'local',
        type: 'X25519',
      })
      await agent?.didManagerAddKey({
        did: identifier,
        // @ts-ignore
        key,
      })
      if (serviceEndpoint) {
        // can just use normal https endpoint
        await agent?.didManagerAddService({
          did: identifier,
          service: {
            id: `${identifier}-didcomm-messaging`,
            type: 'DIDCommMessaging',
            serviceEndpoint,
          },
        })
      } else {
        // use libp2p
        await agent?.didManagerAddService({
          did: identifier,
          service: {
            id: `${identifier}-didcomm-messaging`,
            type: 'DIDCommMessaging',
            serviceEndpoint: {
              transportType: 'libp2p',
              network: 'didcomm-public',
              supportedProtocols: ['didcomm/v2', 'ipfs'],
              peerId: localStorage.getItem('libp2p-peerId'),
            },
          },
        })
      }
    } catch (err) {
      console.log('err: ', err)
      setErrorMessage(
        'Unable to setup DIDCommMessaging service. If this is a did:ethr, make sure the controlling blockchain account has enough funds to update the DID Document.',
      )
    }
    setIsEnabled(true)
  }

  return (
    <Card
      title={title}
      style={{ flexWrap: 'wrap' }}
      loading={isLoading}
      actions={[
        <Button disabled={!enabled} onClick={() => handleQuickSetup()}>
          Quick DIDComm Setup
        </Button>,
      ]}
    >
      Create and add DIDComm appropriate Key to DIDDoc and add DIDComm Messaging
      Endpoint to DIDDoc
      {errorMessage && <Alert message={errorMessage} type="error" />}
    </Card>
  )
}

export default IdentifierQuickSetup
