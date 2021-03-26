import React, { useState } from 'react'
import {
  Typography,
  Card,
  Layout,
  Tag,
  Row,
  Col,
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
} from 'antd'
import { format } from 'date-fns'
import Page from '../layout/Page'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import JsonBlock from '../components/modules/Json'
import IDModule from '../components/modules/Identifier'
import Chart from '../components/simple/Chart'
import SubjectKey from '../components/widgets/SubjectKey'
import { chart1 } from '../stubbs/chart'

const { Title, Text } = Typography
const { Option } = Select

const Credential = () => {
  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { agent } = useVeramo()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

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

  const [queryWidgetKey, setQueryWidgetKey] = useState<string>('')
  const [queryModuleKey, setQueryModuleKey] = useState<string>('')
  const [queryModuleIdentifier, setQueryModuleIdentifier] = useState(
    credential?.credentialSubject.id,
  )

  const [userModules, setUserModules] = useState<any[]>([])

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
          {credential?.['@context'].map((ctx: string) => {
            return (
              <Text key={ctx}>
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
            <Col>
              <Button type="primary" shape="round" onClick={showModal}>
                Add Query
              </Button>
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
