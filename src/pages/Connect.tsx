import React, { useEffect, useState } from 'react'
import { Typography, Form, Input, Button, List } from 'antd'
import Page from '../layout/Page'
import { useVeramo } from '@veramo-community/veramo-react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import {
  createAgent,
  IKeyManager,
  IDIDManager,
  IResolver,
  IKey,
} from '@veramo/core'
import { DIDManager } from '@veramo/did-manager'
import { KeyManager } from '@veramo/key-manager'
import { EthrDIDProvider } from '@veramo/did-provider-ethr'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'

import { MemoryDIDStore } from '../web3/DIDStore'
import { MemoryKeyStore } from '../web3/KeyStore'
import { Web3KeyManagementSystem } from '../web3/KeyManagementSystem'

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
    if (connector && chainId && account && active) {
      const id = `${chainId}:${account}`
      try {
        getAgent(id)
      } catch (e) {
        const init = async () => {
          const web3Provider = await connector.getProvider()
          const agent = createAgent<IDIDManager & IKeyManager & IResolver>({
            context: {
              id,
              name: `Web3 injected ${chainId}`,
            },
            plugins: [
              new DIDResolverPlugin({
                resolver: new Resolver({
                  ethr: ethrDidResolver({
                    provider: web3Provider,
                  }).ethr,
                  web: webDidResolver().web,
                }),
              }),
              new KeyManager({
                store: new MemoryKeyStore(),
                kms: {
                  web3: new Web3KeyManagementSystem(web3Provider),
                },
              }),
              new DIDManager({
                store: new MemoryDIDStore(),
                defaultProvider: 'did:ethr',
                providers: {
                  'did:ethr': new EthrDIDProvider({
                    defaultKms: 'web3',
                    network: 'mainnet',
                    web3Provider: web3Provider,
                  }),
                },
              }),
            ],
          })

          const didDoc = await agent.resolveDid({
            didUrl: `did:ethr:${account}`,
          })

          await agent.didManagerImport({
            did: `did:ethr:${account}`,
            provider: 'did:ethr',
            controllerKeyId: didDoc.id + '#controller',
            keys: didDoc.publicKey.map(
              (pub) =>
                ({
                  kid: pub.id,
                  type: 'Secp256k1',
                  kms: 'web3',
                  publicKeyHex: pub.publicKeyHex,
                } as IKey),
            ),
            services: didDoc.service || [],
          })

          addAgent(agent as any)
        }

        init()
      }
    }
  }, [connector, account, chainId, addAgent, active, getAgent])

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
        <div className={'option-list'}>
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

  useEffect(() => {
    if (schema) {
      setAgentUrl(schema.servers[0].url)
      setName(schema.info.title)
    }
  }, [schema])

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
                defaultValue={schema.servers[0].url}
                value={agentUrl}
                onChange={(e) => setAgentUrl(e.target.value)}
              />
            </Form.Item>
            {/* <Form.Item label="Agent Url">
              <Select>
                {schema && schema.servers.map((server: {url: string}) => {
                    <Select.Option key={server.url} value={server.url}>{server.url}</Select.Option>
                })}
              </Select>
            </Form.Item> */}
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
          {activatingConnector ? 'Waiting...' : 'Add web3 agent'}
        </Button>
      )}
      {active && <Button onClick={() => deactivate()}>Logout</Button>}
    </Page>
  )
}

export default Connect
