import React from 'react'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDataStoreORM } from '@veramo/core'
import { VerifiableCredentialComponent } from '@veramo-community/agent-explorer-plugin'
import { List } from 'antd'

interface IdentifierCredentialsProps {
  did: string
}

export const IdentifierHoverComponent: React.FC<IdentifierCredentialsProps> = ({
  did,
}) => {
  const { agent } = useVeramo<IDataStoreORM>()
  const { data: credentials } = useQuery(
    [
      'identifierReactionCredentials',
      did,
      { agentId: agent?.context.name },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [
          {
            column: 'issuer',
            value: [did],
          },
          {
            column: 'type',
            value: ['VerifiableCredential,Reaction'],
          },
        ],
      }),
  )

  return (
    <List
    itemLayout="vertical"
    size="large"
    dataSource={credentials}
    renderItem={(item) => (
      <div style={{ width: '100%', marginBottom: 20 }}>
      <VerifiableCredentialComponent credential={item} />
    </div>
    )}
  />
  )
}
