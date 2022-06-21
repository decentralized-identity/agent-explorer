import React from 'react'
import { useHistory } from 'react-router'
import { useChat } from '../../context/ChatProvider'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import ChatThreadProfileHeader from './ChatThreadProfileHeader'

interface ChatThreadProps {
  thread: any
  threadId: string
  threadSelected: boolean
}

const ChatThread: React.FC<ChatThreadProps> = ({
  thread,
  threadId,
  threadSelected,
}) => {
  const { agent } = useVeramo()
  const { selectedDid, setComposing } = useChat()
  const history = useHistory()
  const lastMessage = thread[thread.length - 1]
  const viewThread = () => {
    setComposing(false)
    history.push(`/chats/threads/${threadId}`)
  }

  const counterPartyDid =
    lastMessage.from === selectedDid ? lastMessage.to : lastMessage.from
  const { data: counterPartyProfileCredentials } = useQuery(
    [
      'counterPartyProfileCredentials',
      { agentId: agent?.context.name, counterPartyDid },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [
          { column: 'issuer', value: [counterPartyDid], op: 'Equal' },
          {
            column: 'type',
            value: ['VerifiableCredential,ProfileCredentialSchema'],
            op: 'Equal',
          },
        ],
        order: [{ column: 'issuanceDate', direction: 'DESC' }],
      }),
  )
  const profileCredential =
    counterPartyProfileCredentials?.length > 0 &&
    counterPartyProfileCredentials[0].verifiableCredential
  return (
    <ChatThreadProfileHeader
      did={counterPartyDid}
      profileCredential={profileCredential}
      onRowClick={viewThread}
      selected={threadSelected}
    />
  )
}

export default ChatThread
