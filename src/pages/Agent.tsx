import React, { useState } from 'react'
import {
  Typography,
  Card,
  Button,
  Row,
  Space,
  Tag,
  Layout,
  Col,
  Input,
  Form,
  Radio,
  Select,
  Divider,
  Collapse,
} from 'antd'
import Page from '../layout/Page'
import { useVeramo } from '@veramo-community/veramo-react'
import { PushpinOutlined, DatabaseOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import Chart from '../components/simple/Chart'
import { useQuery, useQueryClient } from 'react-query'

const { Title, Text } = Typography
const { Panel } = Collapse

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

const Agents = () => {
  const { id } = useParams<{ id: string }>()
  const { activeAgentId, setActiveAgentId, getAgent } = useVeramo()
  const agent = getAgent(id)
  const [agentNameConfirm, setAgentNameConfirm] = useState<string>()
  const [identifierType, setIdentifierType] = useState<string>()
  const [identifierCount, setIdentifierCount] = useState<number>(50)
  const [identifiersGenerating, setIdentifiersGenerating] = useState<boolean>(
    false,
  )

  const queryClient = useQueryClient()

  const { data: identifiers } = useQuery(
    ['identifiers', { agentId: agent?.context.id }],
    () => agent?.dataStoreORMGetIdentifiers(),
  )
  const [credentialsGenerating, setCredentialsGenerating] = useState<boolean>(
    false,
  )
  const [
    issueCredentialFromCount,
    setIssueCredentialFromCount,
  ] = useState<number>(1)
  const [issueCredentialToCount, setIssueCredentialToCount] = useState<number>(
    1,
  )
  const [
    credentialsRandomGenerating,
    setCredentialsRandomGenerating,
  ] = useState<boolean>(false)

  /**
   * Data generation code to be extracted as set of common libs to be used in CLI tool
   * Add hooks to veramo-react
   * */

  const getRandomProfiles = async (count: number) => {
    const url = `https://randomuser.me/api/?results=${count}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
    return await response.json()
  }

  const createIdentifer = () => {
    return agent.didManagerCreate({ provider: identifierType })
  }

  const generateIdentifiers = async () => {
    setIdentifiersGenerating(true)

    if (identifierCount) {
      let i
      for (i = 0; i < identifierCount; i++) {
        await createIdentifer()
      }

      setIdentifiersGenerating(false)
      queryClient.invalidateQueries('identifiers')
    }
  }

  function getRandomDate(from: Date, to: Date) {
    const fromTime = from.getTime()
    const toTime = to.getTime()
    return new Date(fromTime + Math.random() * (toTime - fromTime))
  }

  const selectRandomIndexes = (total: number, count: number) => {
    const min = Math.ceil(0)
    const max = Math.floor(total)
    let selected = []
    let n
    for (n = 1; n <= count; n++) {
      var i = Math.floor(Math.random() * (max - min) + min)
      selected.push(i)
    }

    return selected
  }

  const createRandomCredentials = () => {
    createRandomCredentialsFromRanges(
      issueCredentialFromCount,
      issueCredentialToCount,
    )
  }

  const createRandomCredentialsFromRanges = async (
    from: number,
    to: number,
  ) => {
    if (!identifiers) return

    setCredentialsRandomGenerating(true)

    const fromSelected = selectRandomIndexes(identifiers.length, from)
    const toSelected = selectRandomIndexes(identifiers.length, to)

    await Promise.all(
      fromSelected.map(async (fromIndex: number) => {
        await Promise.all(
          toSelected.map(async (toIndex: number) => {
            await agent.createVerifiableCredential({
              save: true,
              proofFormat: 'jwt',
              credential: {
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                type: ['VerifiableCredential', 'Kudos'],
                issuer: { id: identifiers[fromIndex].did as string },
                issuanceDate: getRandomDate(
                  new Date('2019-01-01T00:00:00.271Z'),
                  new Date('2021-02-01T01:00:00.271Z'),
                ).toISOString(),
                credentialSubject: {
                  id: identifiers[toIndex].did,
                  kudos: 1,
                },
              },
            })
          }),
        )
      }),
    )

    setCredentialsRandomGenerating(false)
    console.log('issue from index', fromSelected)
    console.log('issue to index', toSelected)
  }

  const createProfileCredentials = async () => {
    if (!identifiers) return

    setCredentialsGenerating(true)

    const { results } = await getRandomProfiles(identifiers?.length as number)

    await Promise.all(
      results.map(async (profile: any, key: number) => {
        await agent.createVerifiableCredential({
          save: true,
          proofFormat: 'jwt',
          credential: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential', 'Profile'],
            issuer: { id: identifiers[key].did as string },
            issuanceDate: new Date().toISOString(),
            credentialSubject: {
              id: identifiers[key].did,
              name: profile.name.first + ' ' + profile.name.last,
              firstName: profile.name.first,
              lastName: profile.name.last,
              nickname: profile.username,
              email: profile.email,
              profileImage: profile.picture.large,
            },
          },
        })
      }),
    )

    setCredentialsGenerating(false)
  }

  return (
    <Page
      rightContent={
        <Layout>
          <Card>
            <Chart type="line" data={data1}></Chart>
          </Card>
          <Card title="Query Composer">
            Options with current view populated to save for future queries
          </Card>
        </Layout>
      }
      header={
        <Layout>
          <Title style={{ fontWeight: 'bold' }}>{agent.context.name}</Title>
          <Row>
            {activeAgentId === agent.context.id && (
              <Tag color="geekblue">Default Agent</Tag>
            )}
            <Tag color="">Schema</Tag>
            <Tag color="">W3C</Tag>
          </Row>
        </Layout>
      }
    >
      <Card title="Agent info">
        <Row>
          <Space>
            <Button
              icon={<PushpinOutlined />}
              disabled={activeAgentId === agent.context.id}
              onClick={() =>
                agent.context.id && setActiveAgentId(agent.context.id)
              }
            >
              Make Default
            </Button>
          </Space>
        </Row>
      </Card>
      <Card title="Data Generator">
        <Collapse>
          <Panel header="Identifiers" key="1">
            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="vertical"
            >
              <Text>Generate multiple identifiers</Text>

              <Form.Item label="Identifier count">
                <Input
                  defaultValue={identifierCount}
                  onChange={(e) => setIdentifierCount(parseInt(e.target.value))}
                />
              </Form.Item>
              <Form.Item label="Provider">
                <Select
                  onSelect={(value: string) => setIdentifierType(value)}
                  defaultValue="did:ethr:rinkeby"
                >
                  <Select.Option value="did:ethr:rinkeby">
                    did:ethr:rinkeby
                  </Select.Option>
                  <Select.Option value="did:ethr">did:ethr</Select.Option>
                  <Select.Option value="did:ethr:ropsten">
                    did:ethr:ropsten
                  </Select.Option>
                  <Select.Option value="did:ethr:kovan">
                    did:ethr:kovan
                  </Select.Option>
                  <Select.Option value="did:ethr:goerli">
                    did:ethr:goerli
                  </Select.Option>
                  <Select.Option value="did:web">did:web</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  onClick={() => generateIdentifiers()}
                  disabled={
                    identifiersGenerating || !identifierCount || !identifierType
                  }
                >
                  Generate
                </Button>
              </Form.Item>
              {identifiersGenerating && (
                <Text>Generating {identifierCount} identifiers..</Text>
              )}
            </Form>
          </Panel>
          <Panel header="Credentials" key="2">
            <Title level={4}>Profile Credentials</Title>

            <Form
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="vertical"
            >
              <Text>
                Generate self-signed random profile credentials for{' '}
                <b>{identifiers?.length}</b> identifiers. Note profiles will be
                different everytime this is run.
              </Text>

              <Row style={{ padding: '20px 0' }}>
                <pre>
                  <code>
                    {JSON.stringify(
                      {
                        name: 'string',
                        nickname: 'string',
                        email: 'string',
                        profileImage: 'string',
                      },
                      null,
                      2,
                    )}
                  </code>
                </pre>
              </Row>

              <Form.Item>
                <Button
                  onClick={() => createProfileCredentials()}
                  disabled={credentialsGenerating}
                >
                  Generate
                </Button>
              </Form.Item>
              {credentialsGenerating && (
                <Text>Generating {identifierCount} credentials..</Text>
              )}
            </Form>

            <Divider></Divider>
            <Title level={4}>Peer to Peer Credentials</Title>
            <Form>
              <Text>Issue kudos credentials between identifiers</Text>

              <Row style={{ padding: '20px 0' }}>
                <pre>
                  <code>
                    {JSON.stringify(
                      {
                        kudos: 1,
                      },
                      null,
                      2,
                    )}
                  </code>
                </pre>
              </Row>
              <Form.Item label="Issuer count">
                <Input
                  max={identifiers?.length}
                  defaultValue={issueCredentialFromCount}
                  onChange={(e) =>
                    setIssueCredentialFromCount(parseInt(e.target.value))
                  }
                />
              </Form.Item>
              <Form.Item label="Subject count">
                <Input
                  max={identifiers?.length}
                  defaultValue={issueCredentialToCount}
                  onChange={(e) =>
                    setIssueCredentialToCount(parseInt(e.target.value))
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button onClick={() => createRandomCredentials()}>Issue</Button>
              </Form.Item>
              {credentialsRandomGenerating && (
                <Text>
                  Issuing credentials from <b>{issueCredentialFromCount}</b>{' '}
                  identifiers to <b>{issueCredentialToCount}</b> identifers
                </Text>
              )}
            </Form>
          </Panel>
          <Panel header="Requests" key="3">
            <Text>Generate requests between identifiers</Text>
          </Panel>
          <Panel header="Presentations" key="4">
            <Text>Generate presentations between identifiers</Text>
          </Panel>
        </Collapse>
      </Card>
      <Card title="Wipe Agent Data">
        <Row>
          <Col>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Text>
                To erase all data from this agent please enter the name of the
                agent below:
              </Text>
              <Input
                placeholder="Enter agent name"
                style={{ width: 300 }}
                onChange={(e) => setAgentNameConfirm(e.target.value)}
              />
              <Button
                danger
                icon={<DatabaseOutlined />}
                disabled={agentNameConfirm !== agent.context.name}
              >
                Yes, I'm sure
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </Page>
  )
}

export default Agents
