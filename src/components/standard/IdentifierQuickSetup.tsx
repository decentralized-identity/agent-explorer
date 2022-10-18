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
      await agent?.didManagerAddService({
        did: identifier,
        service: {
          id: `${identifier}-didcomm-messaging`,
          type: 'DIDCommMessaging',
          serviceEndpoint,
        },
      })
    } catch (err) {
      console.log('err: ', err)
      setErrorMessage(
        'Unable to setup DIDCommMessaging service. If this is a did:ethr, make sure the controlling blockchain account has enough funds to update the DID Document.',
      )
    }
    setIsEnabled(true)
  }

  const handleLibp2pQuickSetup = async () => {
    setIsEnabled(false)
    // if (!data || !(data.length > 0)) {
    //   setErrorMessage(
    //     "No DID Found with provider 'did:web'. Must have at least one did:web with DIDCommMessaging endpoint setup to use this feature.",
    //   )
    //   setIsEnabled(true)
    //   return
    // }
    try {
      const multiAddr = (await agent?.getListenerMultiAddrs())[0].toString()
      console.log('multiAddr: ', multiAddr)
      // const serviceEndpoint = data[0].services.find(
      //   (e: any) => e.type === 'DIDCommMessaging',
      // ).serviceEndpoint
      const key = await agent?.keyManagerCreate({
        kms: 'local',
        type: 'Ed25519',
      })
      await agent?.didManagerAddKey({
        did: identifier,
        // @ts-ignore
        key,
      })
      await agent?.didManagerAddService({
        did: identifier,
        service: {
          id: `${identifier}-didcomm-messaging`,
          type: 'DIDCommMessaging',
          serviceEndpoint: {
            transportType: 'libp2p',
            multiAddr,
          },
        },
      })
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
      size="small"
      title={title}
      style={{ flexWrap: 'wrap' }}
      loading={isLoading}
      actions={[
        <Button disabled={!enabled} onClick={() => handleQuickSetup()}>
          Quick DIDComm Setup
        </Button>,
        <Button disabled={!enabled} onClick={() => handleLibp2pQuickSetup()}>
          Quick Libp2p DIDComm Setup
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
