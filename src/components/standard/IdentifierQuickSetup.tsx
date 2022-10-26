import React, { useState } from 'react'
import { Alert, Button, Card } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { DIDResolver } from 'did-resolver'
import { IDIDManager } from '@veramo/core'

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
  const { agent } = useVeramo<DIDResolver & IDIDManager>()
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
      )?.serviceEndpoint
      if (serviceEndpoint) {
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
      } else {
        setErrorMessage('no services.')
      }
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
      const xEncryptionKey = await agent?.keyManagerGetWhere({
        type: 'X25519',
        did: identifier,
      })

      // TODO(nickreynolds): should also replace existing key if there is one that doesn't
      // match DIDDocument
      if (!xEncryptionKey) {
        const key = await agent?.keyManagerCreate({
          kms: 'local',
          type: 'X25519',
        })
        await agent?.didManagerAddKey({
          did: identifier,
          key,
        })
      } else {
        console.log("X25519 found, don't need to create new one.")
      }

      const existingService = (await agent?.resolveDid({ didUrl: identifier }))
        .didDocument.service
      console.log('existingService: ', existingService)

      if (!existingService) {
        console.log("no existing service. let's add.")
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
      }
    } catch (err) {
      console.log('err: ', err)
      setErrorMessage(
        'Unable to setup DIDCommMessaging service. If this is a did:ethr, make sure the controlling blockchain account has enough funds to update the DID Document. This setup also requires an ILibp2pClient in your Veramo agent',
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
