import React from 'react'
import { Typography, Table, Button, Form, Select, Input, Card } from 'antd'
import Page from '../layout/Page'
import { FundViewOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useVeramo } from '@veramo-community/veramo-react'
import * as generatorUtils from '../utils/dataGenerator'
import { useGenerator } from '../hooks/useGenerator'

const { Title } = Typography

const columns = [
  {
    title: 'DID',
    dataIndex: 'did',
    key: 'did',
    render: (did: string) => <Link to={'/identifier/' + did}>{did}</Link>,
  },
  {
    title: 'Provider',
    dataIndex: 'provider',
    key: 'provider',
    responsive: ['md'],
  },
  {
    title: 'Alias',
    dataIndex: 'alias',
    key: 'alias',
    responsive: ['lg'],
  },
  {
    title: 'Explore',
    width: 100,
    dataIndex: 'did',
    render: (did: string) => <Button icon={<FundViewOutlined />} />,
  },
]

const Identifiers = () => {
  const {
    alias,
    domain,
    identifierProvider,
    identifiersGenerating,
    setDomain,
    setIdentifierProvider,
    setIdentifiersGenerating,
    setAlias,
  } = useGenerator()
  const { agent } = useVeramo()
  const { data: providers } = useQuery(
    ['providers', { agentId: agent?.context.id }],
    () => agent?.didManagerGetProviders(),
  )
  const { data: identifiers, isLoading, refetch } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.dataStoreORMGetIdentifiers(),
  )
  const generateIdentifier = async () => {
    setIdentifiersGenerating(true)

    await generatorUtils.createIdentifiers(
      agent?.didManagerCreate,
      domain,
      identifierProvider,
      1,
      alias,
    )
    setIdentifiersGenerating(false)
    refetch()
  }

  return (
    <Page
      renderModulesBefore
      header={<Title style={{ fontWeight: 'bold' }}>Identifiers</Title>}
    >
      <Card title="Create Identifier">
        <Form labelCol={{ span: 10 }} wrapperCol={{ span: 30 }} layout="inline">
          <Form.Item label="Provider">
            <Select
              style={{ width: 200 }}
              onSelect={(value: string) => setIdentifierProvider(value)}
              defaultValue="did:ethr:rinkeby"
            >
              {providers?.map((provider) => {
                return (
                  <Select.Option key={provider} value={provider}>
                    {provider}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          {identifierProvider === 'did:web' && (
            <Form.Item label="Domain">
              <Input
                defaultValue={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </Form.Item>
          )}
          <Form.Item label="Alias">
            <Input
              defaultValue={alias}
              onChange={(e) => setAlias(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              onClick={() => generateIdentifier()}
              disabled={
                (identifierProvider === 'did:web' && !domain) ||
                identifiersGenerating ||
                !identifierProvider
              }
            >
              Generate
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Table
        loading={isLoading}
        rowKey={(record) => record.did as string}
        dataSource={identifiers}
        // @ts-ignore
        columns={columns}
      />
    </Page>
  )
}

export default Identifiers
