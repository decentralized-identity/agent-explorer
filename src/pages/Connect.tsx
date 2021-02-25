import React, { useState } from 'react'
import { Typography, Form, Input, Button, List } from 'antd'
import Page from '../layout/Page'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { createAgent } from '@veramo/core'

const { Title } = Typography
const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })

const Connect = () => {
  const history = useHistory()
  const { addAgentConfig, addAgent, getAgent } = useVeramo()
  const [name, setName] = useState<string>()
  const [schemaUrl, setSchemaUrl] = useState<string>()
  const [agentUrl, setAgentUrl] = useState<string>('')
  const [apiKey, setApiKey] = useState<string>()

  const {
    connector,
    chainId,
    account,
    activate,
    deactivate,
    active,
  } = useWeb3React<Web3Provider>()
  const [activatingConnector, setActivatingConnector] = React.useState<any>()

  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  React.useEffect(() => {
    if (chainId && account && active) {
      const id = `${chainId}:${account}`
      try {
        getAgent(id)
      } catch (e) {
        const agent = createAgent({
          context: {
            id,
            name: `Web3 injected ${chainId}`,
          },
          plugins: [],
        })
        addAgent(agent as any)
      }
    }
  }, [account, chainId, addAgent, active, getAgent])

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
    history.push('/agents')
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
                <Typography.Text>{item}</Typography.Text>
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
            <Form.Item label="Agent Url">
              <Input
                size="large"
                placeholder="Agent Url"
                value={agentUrl}
                onChange={(e) => setAgentUrl(e.target.value)}
              />
            </Form.Item>
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
          </>
        )}
      </Form>
      {/* <Card title="Deploy agent">Deploy an agent to heroku</Card> */}
      {!active && (
        <Button
          disabled={activatingConnector}
          onClick={() => {
            setActivatingConnector(injected)
            activate(injected)
          }}
        >
          {activatingConnector ? 'Waiting...' : 'Login'}
        </Button>
      )}
      {active && <Button onClick={() => deactivate()}>Logout</Button>}
      Account: {account}
      <br />
      chainId: {chainId}
    </Page>
  )
}

export default Connect
