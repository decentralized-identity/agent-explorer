import React, { useMemo } from 'react'
import { App, Button, Card, List } from 'antd'
import { useQuery, useQueryClient } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IKeyManager, IResolver } from '@veramo/core-types'
import { createV3MediateRequestMessage, createV3RecipientUpdateMessage, Update, UpdateAction } from '@veramo/did-comm'
import { shortId } from '@veramo-community/agent-explorer-plugin'

const mediatorDID = 'did:web:dev-didcomm-mediator.herokuapp.com'

interface IdentifierQuickSetupProps {
  identifier: string
}

const IdentifierQuickSetup: React.FC<IdentifierQuickSetupProps> = ({
  identifier,
}) => {
  const { agent, agents } = useVeramo<IResolver & IDIDManager & IKeyManager>()
  const [addingKey, setAddingKey] = React.useState(false)
  const [addingService, setAddingService] = React.useState(false)
  const queryClient  = useQueryClient()
  const { notification } = App.useApp()

  const localAgent = useMemo(
    () => agents.find((a) => a.context.id === 'web3Agent'),
  [agents])

  const { data, isLoading } = useQuery(
    ['identifier', {did: identifier, agentID: agent?.context.id}],
    () => agent?.resolveDid({ didUrl: identifier }),
    { enabled: !!identifier },
  )

  const { data: managedDID } = useQuery(
    ['managedDid', {did: identifier, agentID: localAgent?.context.id}], () =>
    localAgent?.didManagerGet({ did: identifier }),
  )



  const {hasDIDCommKeys, key} =  useMemo(() => 
    {
      const key = managedDID?.keys?.find((key) => key.type === 'X25519' || key.type === 'Ed25519')
      return {
        hasDIDCommKeys: !!key,
        key
      }
    }
  , [managedDID])

  const { hasDIDCommService, service } = useMemo(() => {
    const service = data?.didDocument?.service?.find((s) => s.type === 'DIDCommMessaging')
    return {
      hasDIDCommService: !!service,
      service
    }
  }, [data])

  const sendMediationRequest = async () => {
    const message = createV3MediateRequestMessage(
      identifier,
      mediatorDID,
    )

    const stored = await agent?.dataStoreSaveMessage({ message })
    console.log('stored?: ', stored)

    const packedMessage = await agent?.packDIDCommMessage({
      packing: 'authcrypt',
      message,
    })

    // requests mediation, and then message handler adds service to DID
    const result = await agent?.sendDIDCommMessage({
      packedMessage,
      messageId: message.id,
      recipientDidUrl: mediatorDID,
    })

    console.log('result?: ', result)

    const update: Update = { recipient_did: identifier, action: UpdateAction.ADD }
    const updateMessage = createV3RecipientUpdateMessage(identifier, mediatorDID, [update])
    const updateMessageContents = { packing: 'authcrypt', message: updateMessage } as const
    const packedUpdateMessage = await agent?.packDIDCommMessage(updateMessageContents)
    await agent?.sendDIDCommMessage({
      messageId: updateMessage.id,
      packedMessage: packedUpdateMessage,
      recipientDidUrl: identifier,
    })
  }

  const handleAddEncryptionKey = async () => {
    setAddingKey(true)
    try {
      const key = await localAgent?.keyManagerCreate({
        kms: 'local',
        type: 'X25519',
        meta: {
          did: identifier
        }
      })
      await localAgent?.didManagerAddKey({
        did: identifier,
        // @ts-ignore
        key,
      })
      queryClient.invalidateQueries(['managedDid', {did: identifier, agentID: localAgent?.context.id}])
      queryClient.invalidateQueries(['identifier', {did: identifier, agentID: localAgent?.context.id}])

      if (hasDIDCommService) {
        await sendMediationRequest()
      }

    } catch (e: any) {
      notification.error({ message: e.message })
    }
    setAddingKey(false)
  }

  const handleAddDIDCommService = async () => {
    setAddingService(true)
    try {
      await agent?.didManagerAddService({
        did: identifier,
        service: {
          id: `${identifier}-didcomm-messaging`,
          type: 'DIDCommMessaging',
          serviceEndpoint: 'did:web:dev-didcomm-mediator.herokuapp.com',
        },
      })

      if (hasDIDCommKeys) {
        await sendMediationRequest()
      }

    } catch (e: any) {
      notification.error({ message: e.message })
    }
    setAddingService(false)
  }


  return (
    <Card
      size="small"
      title={'Capabilities'}
      style={{ flexWrap: 'wrap' }}
      loading={isLoading}
    >
      <List>
      <List.Item
          actions={[
            <Button
              type="primary"
              loading={addingKey}
              onClick={handleAddEncryptionKey}
              disabled={hasDIDCommKeys}
              >Add</Button>
          ]}
        >
          <List.Item.Meta
            avatar={hasDIDCommKeys ? '✅' : '❌'}
            title="Local encryption key"
            description={shortId(key?.kid || '')}
          />
        </List.Item>
        <List.Item
          actions={[
            <Button
              type="primary"
              loading={addingService}
              disabled={!hasDIDCommKeys || hasDIDCommService}
              onClick={handleAddDIDCommService}
              >Add</Button>
          ]}
        >
          <List.Item.Meta
            avatar={hasDIDCommService ? '✅' : '❌'}
            title="DIDComm messaging service"
            description={String(service?.serviceEndpoint) || ''}
          />
        </List.Item>
      </List>
    </Card>
  )
}

export default IdentifierQuickSetup
