import React, { useEffect, useState } from 'react'
import { Typography, Form, Input, Button, List, Collapse } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'

type Props = {
  onSuccess: () => void
  url?: string
}

export const Connect: React.FC<Props> = ({ onSuccess, url }) => {
  const { addAgentConfig } = useVeramo()
  const [name, setName] = useState<string>()
  const [schemaUrl, setSchemaUrl] = useState<string | undefined>(url)
  const [agentUrl, setAgentUrl] = useState<string>('')
  const [apiKey, setApiKey] = useState<string>()

  const newAgentConfig = () => {
    addAgentConfig({
      context: { name, schema: schemaUrl },
      remoteAgents: [
        {
          url: agentUrl,
          enabledMethods: Object.keys(schema['x-methods']),
          token: apiKey,
        },
      ],
    })
    setSchemaUrl(undefined)
    setAgentUrl('')
    setApiKey('')
    onSuccess()
  }

  const {
    data: schema,
    isLoading: schemaLoading,
    isError: schemaError,
  } = useQuery(
    ['schema', { endpoint: schemaUrl }],
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
        <Collapse accordion size='small' items={[
          {
            key: '1',
            label: `Available methods (${Object.keys(schema['x-methods']).length})`,
            children: <List
            size='small'
            dataSource={Object.keys(schema['x-methods'])}
            renderItem={(item) => (
              <List.Item>
                <Typography.Text>{item}</Typography.Text>
              </List.Item>
            )}
            />,
          }
        ]}>
        </Collapse>
      )
    )
  }

  useEffect(() => {
    if (schema) {
      setAgentUrl(schema.servers[0].url)
      setName(schema.info.title)
    }
  }, [schema])

  const needsApiKey = schema?.components?.securitySchemes?.auth?.scheme === 'bearer'

  return (
    <>
      <Form layout={'vertical'}>
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
        
        {schema && (
          <>
            <Form.Item label="Agent name">
              <Input
                size="large"
                placeholder="Remote Agent"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
            {needsApiKey && 
            <Form.Item label="API Key">
              <Input
                size="large"
                placeholder="API Key"
                value={apiKey}
                type="password"
                onChange={(e) => setApiKey(e.target.value)}
              />
            </Form.Item>}
            <Form.Item>
              {methods()}
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                disabled={!name || !schemaUrl || !agentUrl || (needsApiKey && !apiKey)}
                onClick={() => newAgentConfig()}
              >
                Add connection
              </Button>
            </Form.Item>
          </>
        )}
      </Form>

    </>
  )
}
