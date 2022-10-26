import React from 'react'
import { Row } from 'antd'
import { useChat } from '../../context/ChatProvider'
import { v4 } from 'uuid'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { signVerifiablePresentation } from '../../utils/signing'
import ChatThreadProfileHeader from './ChatThreadProfileHeader'

interface ChatThreadHeaderProps {
  counterParty: CounterParty
  threadId?: string
}

interface CounterParty {
  did: string
}

const ChatThreadHeader: React.FC<ChatThreadHeaderProps> = ({
  counterParty,
  threadId,
}) => {
  const { selectedDid } = useChat()
  const { agent } = useVeramo()
  const { data: selectedDidProfileCredentials } = useQuery(
    [
      'selectedDidProfileCredentials',
      { agentId: agent?.context.name, selectedDid },
    ],
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
  const selectedDidProfileCredential =
    selectedDidProfileCredentials?.[0]?.verifiableCredential

  const { data: counterPartyProfileCredentials } = useQuery(
    [
      'counterPartyProfileCredentials',
      { agentId: agent?.context.name, counterPartyDid: counterParty?.did },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [
          { column: 'issuer', value: [counterParty?.did], op: 'Equal' },
          {
            column: 'type',
            value: ['VerifiableCredential,ProfileCredentialSchema'],
            op: 'Equal',
          },
        ],
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
      }),
  )

  const counterPartyProfileCredential =
    counterPartyProfileCredentials &&
    counterPartyProfileCredentials.length > 0 &&
    counterPartyProfileCredentials[0].verifiableCredential

  const messageId = v4()
  const sendMessage = async (msg: string, attachment?: any) => {
    const message = {
      type: 'veramo.io-chat-v1',
      to: counterParty.did as string,
      from: selectedDid as string,
      id: messageId,
      thid: threadId,
      body: { message: msg },
    }
    const packedMessage = await agent?.packDIDCommMessage({
      packing: 'authcrypt',
      message,
    })!
    await agent?.sendDIDCommMessage({
      packedMessage,
      messageId,
      recipientDidUrl: counterParty.did,
    })
  }

  if (!counterParty || !counterParty.did) {
    return (
      <Row
        style={{
          cursor: 'pointer',
          padding: 20,
          backgroundColor: '#f7f7f7',
          alignItems: 'center',
          borderBottom: '1px solid white',
        }}
      >
        Loading
      </Row>
    )
  }
  return (
    <div>
      <ChatThreadProfileHeader
        did={counterParty?.did}
        profileCredential={counterPartyProfileCredential}
      />
      <button
        onClick={async () => {
          try {
            const signedPresentation = await signVerifiablePresentation(
              agent,
              selectedDid,
              [],
              selectedDidProfileCredential
                ? [selectedDidProfileCredential]
                : [],
              'jwt',
            )
            sendMessage('Attached Profile', signedPresentation)
          } catch (err) {
            console.error('err: ', err)
          }
        }}
      >
        share profile
      </button>
    </div>
  )
}

export default ChatThreadHeader
