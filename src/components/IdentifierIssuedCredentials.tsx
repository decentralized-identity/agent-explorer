import React from 'react'
import { Table, Tag, Card } from 'antd'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDataStoreORM } from '@veramo/core'

const columns = [
  {
    title: 'Subject',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) =>
      verifiableCredential.credentialSubject.id,
    ellipsis: {
      showTitle: false,
    },
  },
  {
    title: 'Type',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) =>
      verifiableCredential.type.map((type: string, i: number) => (
        <Tag color="geekblue" key={i}>
          {type}
        </Tag>
      )),
    responsive: ['lg'],
    width: 200,
  },
  {
    title: 'Issuance Date',
    dataIndex: 'verifiableCredential',
    render: (verifiableCredential: any) =>
      format(new Date(verifiableCredential.issuanceDate), 'PPP'),
    responsive: ['lg'],
    width: 200,
  },
]

interface IdentifierCredentialsProps {
  identifier: string
}

const IdentifierIssuedCredentials: React.FC<IdentifierCredentialsProps> = ({
  identifier,
}) => {
  const navigate = useNavigate()
  const { agent } = useVeramo<IDataStoreORM>()
  const { data: credentials, isLoading } = useQuery(
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
    <Card
      size="small"
      title={'Issued Credentials'}
      style={{ flexWrap: 'wrap' }}
      loading={isLoading}
    >
      <Table
        loading={isLoading}
        rowKey={(record) => record.hash}
        onRow={(record, rowIndex) => {
          return {
            onClick: (e) => navigate('/credential/' + record.hash),
          }
        }}
        dataSource={credentials}
        // bordered
        // @ts-ignore
        columns={columns}
      />
    </Card>
  )
}

export default IdentifierIssuedCredentials
