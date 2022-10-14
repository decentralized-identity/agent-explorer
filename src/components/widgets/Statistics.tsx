import React from 'react'
import { Col, Row, Statistic } from 'antd'
import PageWidget from '../../layout/PageWidget'
import { PageWidgetProps } from '../../types'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDataStoreORM } from '@veramo/core'
import { useQuery } from 'react-query'

const Statistics: React.FC<PageWidgetProps> = ({
  title,
  isLoading,
  remove,
}) => {
  const { agent } = useVeramo<IDataStoreORM>()
  
  const { data: credentialsCount, isLoading: loading1 } = useQuery(
    ['credentialsCount', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetVerifiableCredentialsCount(),
  )

  const { data: identifiersCount, isLoading: loading2 } = useQuery(
    ['identifiersCount', { agentId: agent?.context.name }],
    () => agent?.dataStoreORMGetIdentifiersCount(),
  )

  return (
    <PageWidget title={title} remove={remove} isLoading={isLoading}>
      <Row gutter={16}>
      <Col span={12}>
      <Statistic title="Issued Credentials" value={credentialsCount} loading={loading1} />
      </Col>
      <Col span={12}>
      <Statistic title="Known Identifiers" value={identifiersCount} loading={loading2} />
      </Col>
    </Row>


    </PageWidget>
  )
}

export default Statistics
