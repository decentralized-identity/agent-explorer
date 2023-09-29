/* eslint-disable */

import React from 'react';
import { IIdentifierHoverComponentProps } from "@veramo-community/agent-explorer-plugin";
import { IDataStoreORM } from '@veramo/core-types';
import { useVeramo } from '@veramo-community/veramo-react';
import { useQuery } from 'react-query';
import { Typography } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';

export const IdentifierHoverComponent: React.FC<IIdentifierHoverComponentProps> = ({did}) => {
  const { agent } = useVeramo<IDataStoreORM>()
  
  const { data: issuedCount } = useQuery(
    [
      'identifierIssuedCredentialsCount',
      did,
      { agentId: agent?.context.name },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentialsCount({
        where: [
          {
            column: 'issuer',
            value: [did],
          },
        ],
      })
  )

  const { data: receivedCount } = useQuery(
    [
      'identifierReceivedCredentialsCount',
      did,
      { agentId: agent?.context.name },
    ],
    () =>
      agent?.dataStoreORMGetVerifiableCredentialsCount({
        where: [
          {
            column: 'subject',
            value: [did],
          },
        ],
      })
  )

  return (
    <Typography.Text>
      <SafetyOutlined /> issued: {issuedCount}, received: {receivedCount}
    </Typography.Text>
  )
}


