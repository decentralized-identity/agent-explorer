import React from 'react'
import { Row, theme } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import ChatThreadProfileHeader from './ChatThreadProfileHeader'
const { useToken } = theme

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
  const { token } = useToken()
  const { agent } = useVeramo()

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

  if (!counterParty || !counterParty.did) {
    return (
      <Row
        style={{
          cursor: 'pointer',
          padding: 20,
          backgroundColor: token.colorBgTextHover,
          alignItems: 'center',
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
    </div>
  )
}

export default ChatThreadHeader
