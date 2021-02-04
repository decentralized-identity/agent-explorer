import React from 'react'
import {
  Typography,
  Card,
  Layout,
  List,
  Tag,
  Row,
  Col,
  Table,
  Button,
} from 'antd'
import { format } from 'date-fns'
import Page from '../layout/Page'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import { FundViewOutlined } from '@ant-design/icons'
import JsonBlock from '../components/blocks/Json'
import IDModule from '../components/modules/Identifier'
import Chart from '../components/simple/Chart'

const { Title, Text } = Typography
const data1 = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  fill: false,
  datasets: [
    {
      label: 'Activity',
      data: [500, 897, 234, 564, 765, 432],
      borderColor: 'rgb(47 89 138 / 80%)',
      fill: false,
      lineTension: 0,
      backgroundColor: 'rgb(47 89 138 / 20%)',
      borderWidth: 1,
    },
  ],
  options: {
    scales: {
      xAxes: [
        {
          display: false,
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
  },
}

const Credential = () => {
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
  const { data: credentials } = useQuery(
    ['credentials', historyQuery],
    () => agent?.dataStoreORMGetVerifiableCredentials(historyQuery),
    { enabled: !!credential },
  )

  const historyColumns = [
    {
      title: 'Explore',
      dataIndex: 'hash',
      render: (hash: any) => (
        <Button
          icon={
            <Link to={'/credentials/' + hash}>
              <FundViewOutlined />
            </Link>
          }
        />
      ),
      width: 100,
    },
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
          {credential?.['@context'].map((ctx: string) => {
            return (
              <Text>
                <a href={ctx}>{ctx}</a>
              </Text>
            )
          })}
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
        <Card title="Query Composer">
          Options with current view populated to save for future queries
        </Card>
        <Card title="Agent Module">
          Show some meta data about current agent
        </Card>
        <Card>
          <Chart type="line" data={data1}></Chart>
        </Card>
      </Layout>
    )
  }

  return (
    <Page
      header={
        <Layout>
          <Title style={{ fontWeight: 'bold' }}>Verifiable Credential</Title>
          <Row>
            <Col>
              {credential?.type.map((type: string) => {
                return <Tag color="geekblue">{type}</Tag>
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
      <Card style={{ height: 400 }} loading>
        Card 1
      </Card>
    </Page>
  )
}

export default Credential
