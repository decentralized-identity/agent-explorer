import React, { useState } from 'react'
import { Button, Form, Input, Select, Tag, notification, Progress } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IDataStore } from '@veramo/core'
import shortId from 'shortid'
import { IProfileManager } from '../../agent/ProfileManager'
import { useQuery } from 'react-query'
import IdentifierProfileSelectOption from './IdentifierProfileSelectOption'

interface Props {
  id?: string
  onFinish?: () => void
}

interface FormValues {
  from: string
  to: string
  headline: string
  subject: string
  articleBody: string
  agents: string[]
}

const Module: React.FC<Props> = (props: Props) => {
  const { agent, agents, getAgent } = useVeramo<
    IDIDManager & IDataStore & IProfileManager
  >()

  const [progressStatus, setProgressStatus] = useState<
    'active' | 'exception' | undefined
  >(undefined)
  const [progress, setProgress] = useState<number | undefined>(undefined)

  const filteredAgents = agents.filter((a) =>
    a.availableMethods().includes('dataStoreSaveVerifiableCredential'),
  )

  const { data: identifiers, isLoading: isLoadingIdentifiers } = useQuery(
    ['managedIdentifiers', { agentId: agent?.context.id }],
    () => agent?.didManagerFind(),
  )

  const initialValues: FormValues = {
    from: '',
    to: 'did:web:pulsar.veramo.io',
    headline: 'Title',
    subject: 'https://pulsar.veramo.io/posts/' + shortId(),
    articleBody: 'Body',
    agents: [],
  }

  const createPost = async (values: FormValues) => {
    setProgressStatus('active')
    setProgress(20)
    try {
      const profile = await agent?.getProfile({ did: values.from })

      const verifiableCredential = await agent?.createVerifiableCredential({
        credential: {
          issuer: { id: values.from },
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://www.w3id.org/veramolabs/socialmedia/context/v1',
          ],
          type: ['VerifiableCredential', 'VerifiableSocialPosting'],
          id: initialValues.subject,
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: values.subject,
            type: 'SocialMediaPosting',
            author: {
              id: values.from,
              image: profile?.picture,
              name: profile?.name,
            },
            headline: values.headline,
            articleBody: values.articleBody,
          },
        },
        proofFormat: 'jwt',
      })
      setProgress(40)

      for (const agentId of values.agents) {
        try {
          await getAgent(agentId).dataStoreSaveVerifiableCredential({
            verifiableCredential,
          })
          notification.success({
            message: 'Credential saved in: ' + getAgent(agentId).context.name,
          })
        } catch (e: any) {
          notification.error({
            message: e.message,
          })
          setProgressStatus('exception')
        }
      }
      setProgress(80)

      if (values.to) {
        try {
          await agent?.sendMessageDIDCommAlpha1({
            data: {
              from: values.from,
              to: values.to,
              body: verifiableCredential.proof.jwt,
              type: 'jwt',
            },
          })
          notification.success({
            message: 'Message sent to: ' + values.to,
          })
        } catch (e: any) {
          notification.error({
            message: e.message,
          })
          setProgressStatus('exception')
        }
      }
    } catch (e: any) {
      notification.error({
        message: e.message,
      })
      setProgressStatus('exception')
    }
    setProgress(100)

    setTimeout(() => {
      setProgress(undefined)
      if (props.onFinish) {
        props.onFinish()
      }
    }, 1000)
  }

  function tagRender(props: any) {
    const { label, closable, onClose } = props

    return (
      <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    )
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={initialValues}
      onFinish={createPost}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="From"
        name="from"
        rules={[{ required: true, message: 'Please select From!' }]}
      >
        <Select loading={isLoadingIdentifiers}>
          {identifiers?.map((i) => (
            <Select.Option value={i.did} key={i.did}>
              <IdentifierProfileSelectOption did={i.did} />
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Subject"
        name="subject"
        rules={[{ required: true, message: 'Please input Subject!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Headline"
        name="headline"
        rules={[{ required: true, message: 'Please input Headline!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Article body"
        name="articleBody"
        rules={[{ required: true, message: 'Please input Article body!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Send to" name="to">
        <Input />
      </Form.Item>

      <Form.Item label="Save to" name="agents">
        <Select
          mode="multiple"
          showArrow
          tagRender={tagRender}
          style={{ width: '100%' }}
          options={filteredAgents.map((a) => ({
            label: a?.context.name as string,
            value: a?.context.id as string,
          }))}
        />
      </Form.Item>

      <Form.Item {...tailLayout}>
        {progress === undefined && (
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        )}
        {progress && (
          <Progress type="circle" percent={progress} status={progressStatus} />
        )}
      </Form.Item>
    </Form>
  )
}

export default Module
