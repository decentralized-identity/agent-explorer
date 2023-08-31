import React from 'react'
import { Col, Row, Statistic, Typography } from 'antd'

import { useVeramo } from '@veramo-community/veramo-react'
import { IDataStoreORM } from '@veramo/core'
import { useQuery } from 'react-query'
import { PageContainer } from '@ant-design/pro-components'

const Statistics: React.FC = () => {
  const { agent } = useVeramo<IDataStoreORM>()

  const { data: credentialsCount, isLoading: loading1 } = useQuery(
    ['credentialsCount', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetVerifiableCredentialsCount(),
  )

  const { data: identifiersCount, isLoading: loading2 } = useQuery(
    ['identifiersCount', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetIdentifiersCount(),
  )

  const { data: managedIdentifiersCount, isLoading: loading3 } =  useQuery(['identifiers', { agentId: agent?.context.id }], () =>
  agent?.didManagerFind().then((identifiers) => identifiers.length),
)


  return (
    <PageContainer title={'Statistics'} loading={loading1 || loading2}>
      <Typography.Title level={3}>{agent?.context.name}</Typography.Title>
      <Row justify={'space-between'}>
        <Col>
          <Statistic
            title="Managed identifiers"
            value={managedIdentifiersCount}
            loading={loading3}
          />
        </Col>
        <Col>
          <Statistic
            title="Credentials"
            value={credentialsCount}
            loading={loading1}
          />
        </Col>
        <Col>
          <Statistic
            title="Contacts"
            value={identifiersCount}
            loading={loading2}
          />
        </Col>
      </Row>
    </PageContainer>
  )
}

export default Statistics
