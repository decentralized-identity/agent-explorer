import React from 'react'
import { List } from 'antd'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDataStoreORM } from '@veramo/core'
import { VerifiableCredentialComponent } from '@veramo-community/agent-explorer-plugin'

interface IdentifierCredentialsProps {
  identifier: string
}

const IdentifierReceivedCredentials: React.FC<IdentifierCredentialsProps> = ({
  identifier,
}) => {
  const { agent } = useVeramo<IDataStoreORM>()
  const { data: credentials } = useQuery(
    [
      'identifierReceivedCredentials',
      identifier,
      { agentId: agent?.context.name },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [
          {
            column: 'subject',
            value: [identifier],
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

export default IdentifierReceivedCredentials
