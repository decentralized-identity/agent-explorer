import React from 'react'
import { Typography, Form, Input, Button } from 'antd'
import Page from '../layout/Page'
import { useAgent } from '../agent'

const { Title } = Typography

const Connect = () => {
  const [form] = Form.useForm()
  const { agent, agents } = useAgent()

  return (
    <Page header={<Title style={{ fontWeight: 'bold' }}>Connect</Title>}>
      <Form form={form} layout={'vertical'}>
        <Form.Item label="Agent Schema URL">
          <Input size="large" placeholder="Agent schema" />
        </Form.Item>
        <Form.Item label="API Key">
          <Input size="large" placeholder="API Key" />
        </Form.Item>
        <Form.Item>
          <Button size="large" type="primary" block shape="round">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Page>
  )
}

export default Connect
