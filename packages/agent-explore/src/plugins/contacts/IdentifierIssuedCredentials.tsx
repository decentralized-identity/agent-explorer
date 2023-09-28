import React from 'react'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDataStoreORM } from '@veramo/core'
import { VerifiableCredentialComponent } from '@veramo-community/agent-explorer-plugin'
import { List } from 'antd'

interface IdentifierCredentialsProps {
  identifier: string
}

const IdentifierIssuedCredentials: React.FC<IdentifierCredentialsProps> = ({
  identifier,
}) => {
  const { agent } = useVeramo<IDataStoreORM>()
  const { data: credentials } = useQuery(
    [
      'identifierIssuedCredentials',
      identifier,
      { agentId: agent?.context.name },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentials({
        where: [
          {
            column: 'issuer',
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

export default IdentifierIssuedCredentials
