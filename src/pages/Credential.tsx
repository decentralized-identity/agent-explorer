import React from 'react'
import { Typography, Card, Layout, Tag, Row, Col, Table, List } from 'antd'
import { format } from 'date-fns'
import Page from '../layout/Page'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import JsonBlock from '../components/standard/Json'
import IDModule from '../components/standard/Identifier'
import { BlockOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const { Title } = Typography

const Credential = () => {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo()

  const { data: credential, isLoading: credentialLoading } = useQuery(
    ['credential', { id }],
    () => agent?.dataStoreGetVerifiableCredential({ hash: id }),
  )
  const historyQuery: any = {
    where: [
      {
        column: 'issuer',
        value: [credential?.issuer.id as string],
      },
      {
        column: 'subject',
        value: [credential?.credentialSubject.id as string],
      },
    ],
  }
  const { data: credentials, isLoading: credentialHistoryLoading } = useQuery(
    ['credentials', historyQuery],
    () => agent?.dataStoreORMGetVerifiableCredentials(historyQuery),
    { enabled: !!credential },
  )

  const historyColumns = [
    {
      title: 'Issuance Date',
      dataIndex: 'verifiableCredential',
      render: (verifiableCredential: any) =>
        format(new Date(verifiableCredential.issuanceDate), 'PPP'),
      width: 200,
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
      width: 200,
    },
  ]

  const rightContent = () => {
    return (
      <Layout>
        <Card title="Context">
          <List
            dataSource={credential?.['@context']}
            renderItem={(item: any, i: number) => {
              return (
                <List.Item key={i}>
                  <List.Item.Meta
                    avatar={<BlockOutlined />}
                    title={
                      <Link to={item}>
                        <code>{item}</code>
                      </Link>
                    }
                    description={item.type}
                  />
                </List.Item>
              )
            }}
          ></List>
        </Card>
        <IDModule
          cacheKey="issuer"
          title="Issuer"
          identifier={credential?.issuer.id as string}
        />
        <IDModule
          cacheKey="subject"
          title="Subject"
          identifier={credential?.credentialSubject.id as string}
        />
      </Layout>
    )
  }

  return (
    <Page
      name="credential"
      header={
        <Layout>
          <Title style={{ fontWeight: 'bold' }}>Verifiable Credential</Title>
          <Row style={{}} justify="space-between">
            <Col>
              {credential?.type.map((type: string) => {
                return (
                  <Tag color="geekblue" key={type}>
                    {type}
                  </Tag>
                )
              })}
            </Col>
          </Row>
        </Layout>
      }
      rightContent={rightContent()}
    >
      <JsonBlock
        title="Credential Subject"
        data={credential?.credentialSubject}
        isLoading={credentialLoading}
      />

      <Card bodyStyle={{ padding: 0 }} title="Activity">
        <Table
          loading={credentialHistoryLoading}
          onRow={(record) => {
            return {
              onClick: (e) => history.push('/credential/' + record.hash),
            }
          }}
          rowKey={(record) => record.hash}
          columns={historyColumns}
          dataSource={credentials}
          pagination={false}
        />
      </Card>
      <JsonBlock
        title="Raw JSON"
        data={credential}
        isLoading={credentialLoading}
      />
    </Page>
  )
}

export default Credential
