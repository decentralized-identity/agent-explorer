import React, { useState } from 'react'
import { Typography, Form, Input, Button, List, Row, Col } from 'antd'
import Page from '../layout/Page'
import { useAgent } from '../agent'
import { useQuery } from 'react-query'

const { Title } = Typography

const Connect = () => {
  const { agent, agents, addAgentConfig } = useAgent()
  const [name, setName] = useState<string>()
  const [schemaUrl, setSchemaUrl] = useState<string>()
  const [agentUrl, setAgentUrl] = useState<string>('')
  const [apiKey, setApiKey] = useState<string>()

  const newAgentConfig = () => {
    addAgentConfig({
      context: { name },
      remoteAgents: [
        {
          url: agentUrl,
          enabledMethods: Object.keys(schema['x-methods']),
          token: apiKey,
        },
      ],
    })
  }

  const {
    data: schema,
    isLoading: schemaLoading,
    isError: schemaError,
  } = useQuery(
    ['schema'],
    async () => {
      if (schemaUrl) {
        const response = await fetch(schemaUrl)
        return await response.json()
      }
    },
    {
      enabled: !!schemaUrl,
    },
  )

  const methods = () => {
    return (
      schema &&
      schema['x-methods'] && (
        <div
          style={{
            height: 300,
            margin: '20px 0',
            overflow: 'scroll',
            border: '1px solid #e8e8e8',
            borderRadius: 4,
            padding: '8px 24px',
          }}
        >
          <List
            header={
              <Typography.Title level={5}>Available methods</Typography.Title>
            }
            dataSource={Object.keys(schema['x-methods'])}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text></Typography.Text> {item}
              </List.Item>
            )}
          />
        </div>
      )
    )
  }

  return (
    <Page header={<Title style={{ fontWeight: 'bold' }}>Connect</Title>}>
      <Form layout={'vertical'}>
        <Form.Item label="Agent name">
          <Input
            size="large"
            placeholder="Remote Agent"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Agent Url">
          <Input
            size="large"
            placeholder="Agent Url"
            value={agentUrl}
            onChange={(e) => setAgentUrl(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          hasFeedback
          validateStatus={
            !schemaUrl
              ? ''
              : schemaLoading
              ? 'validating'
              : schemaError
              ? 'error'
              : 'success'
          }
          label="Agent Schema URL"
        >
          <Input
            id="validating"
            size="large"
            placeholder="Agent schema"
            value={schemaUrl}
            onChange={(e) => setSchemaUrl(e.target.value)}
          />
        </Form.Item>
        {methods()}
        <Form.Item label="API Key">
          <Input
            size="large"
            placeholder="API Key"
            value={apiKey}
            type="password"
            onChange={(e) => setApiKey(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            type="primary"
            block
            shape="round"
            disabled={!name || !schemaUrl || !apiKey || !agentUrl}
            onClick={() => newAgentConfig()}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Page>
  )
}

export default Connect
