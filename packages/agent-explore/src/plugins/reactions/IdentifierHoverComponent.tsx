import React from 'react'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDataStoreORM } from '@veramo/core'
import { Typography } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

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
    <Typography.Text><SmileOutlined /> {credentials?.length}</Typography.Text>
  )
}
