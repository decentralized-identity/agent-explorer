import React from 'react'
import { Row, Typography, Avatar } from 'antd'
import { useHistory } from 'react-router'
import { useChat } from '../../context/ChatProvider'
import { identiconUri } from '../../utils/identicon'
import { v4 } from 'uuid'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { signVerifiablePresentation } from '../../utils/signing'
import ChatThreadProfileHeader from './ChatThreadProfileHeader'

const { Title, Text } = Typography

interface ChatThreadHeaderProps {
  counterParty: CounterParty
  threadId: string
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
  // const history = useHistory()

  // console.log("selectedDid: ", selectedDid)
  const { data: selectedDidProfileCredentials } = useQuery(
    [
      'selectedDidProfileCredentials',
      { agentId: agent?.context.name, selectedDid },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [{ column: 'issuer', value: [selectedDid], op: 'Equal' }],
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
      }),
  )
  // console.log("credentials: ", selectedDidProfileCredentials)
  const selectedDidProfileCredential =
    selectedDidProfileCredentials &&
    selectedDidProfileCredentials.length > 0 &&
    selectedDidProfileCredentials[0].verifiableCredential
  // console.log("selectedDidProfileCredential: ", selectedDidProfileCredential)

  // console.log("counterParty.did: ", counterParty?.did)
  const { data: counterPartyProfileCredentials } = useQuery(
    [
      'counterPartyProfileCredentials',
      { agentId: agent?.context.name, counterPartyDid: counterParty?.did },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [{ column: 'issuer', value: [counterParty?.did], op: 'Equal' }],
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
      }),
  )

  // console.log("counterPartyProfileCredentials: ", counterPartyProfileCredentials);
  const counterPartyProfileCredential =
    counterPartyProfileCredentials &&
    counterPartyProfileCredentials.length > 0 &&
    counterPartyProfileCredentials[0].verifiableCredential

  // console.log("counterPartyProfileCredential: ", counterPartyProfileCredential);

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
      packing: 'jws',
      message,
    })!
    await agent?.sendDIDCommMessage({
      packedMessage,
      messageId,
      recipientDidUrl: counterParty.did,
    })
  }

  // console.log("counterParty: ", counterParty)
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
              [selectedDidProfileCredential],
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
