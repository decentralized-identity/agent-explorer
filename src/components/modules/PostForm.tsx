import React, { useState } from 'react'
import { Button, Card, Form, Input, Select, Tag } from 'antd'
import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager, IDataStore } from '@veramo/core'
import shortId from 'shortid'

interface Props {
  id: string
}

interface FormValues {
  headline: string
  subject: string
  articleBody: string
  agents: string[]
}

const Module: React.FC<Props> = (props: Props) => {
  const { agent, agents, getAgent } = useVeramo<IDIDManager & IDataStore>()
  const [vc, setVc] = useState()

  const filteredAgents = agents.filter(a => a.availableMethods().includes('dataStoreSaveVerifiableCredential'))

  const initialValues: FormValues = {
    headline: 'Title',
    subject: 'https://example.org/posts/' + shortId(),
    articleBody: 'Body',
    agents: []
  }

  const createPost = async (values: FormValues) => {
    try {


      const verifiableCredential = await agent?.createVerifiableCredential({
        credential: {
          issuer: { id: props.id },
          '@context': [
            'https://www.w3.org/2018/credentials/v1',
            'https://www.w3id.org/veramolabs/socialmedia/context/v1'
          ],
          type: [
            'VerifiableCredential',
            'VerifiableSocialPosting'
          ],
          id: initialValues.subject,
          issuanceDate: new Date().toISOString(),
          credentialSubject: {
            id: values.subject,
            type: 'SocialMediaPosting',
            author: {
              id: props.id,
              type: 'Person',
              thumbnail: 'https://google.com',
              image: 'https://google.com',
              name: 'cryptopunk'
            },
            headline: values.headline,
            articleBody: values.articleBody
          },
        },
        proofFormat: 'jwt',
      })

      for (const agentId of values.agents) {
        try {
          const result = await getAgent(agentId).dataStoreSaveVerifiableCredential({ verifiableCredential })
          console.log({ result })
        } catch (e) {
          console.log(e)
        }
      }

      setVc(verifiableCredential)
    } catch (error) {
      console.log(error)
    }
  }


  function tagRender(props: any) {
    const { label, closable, onClose } = props;

    return (
      <Tag closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
        {label}
      </Tag>
    );
  }



  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };


  return (
    <Card title='Create post'>

      <Form
        {...layout}
        name="basic"
        initialValues={initialValues}
        onFinish={createPost}
        onFinishFailed={onFinishFailed}
      >
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

        <Form.Item
          label="Save to"
          name="agents"
        >
          <Select
            mode="multiple"
            showArrow
            tagRender={tagRender}
            style={{ width: '100%' }}
            options={filteredAgents.map(a => ({ label: a?.context.name as string, value: a?.context.id as string }))}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
        </Button>
        </Form.Item>
      </Form>

      {vc && (<pre>{JSON.stringify(vc, null, 2)}</pre>)}
    </Card>

  )
}

export default Module
