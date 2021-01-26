import React from 'react'
import { Typography, Form, Radio, Card } from 'antd'
import Page from '../layout/Page'
import { Content } from 'antd/lib/layout/layout'
const { Title, Text } = Typography

const Settings = () => {
  const [form] = Form.useForm()

  return (
    <Page
      header={
        <Content style={{ marginBottom: 30 }}>
          <Title>Settings</Title>
        </Content>
      }
    >
      <Content style={{ marginBottom: 30 }}>
        <Title level={5}>Viewing Mode</Title>
        <Card>
          <Radio.Group>
            <Radio value="small">Light</Radio>
            <Radio value="middle">System</Radio>
            <Radio value="large">Dark</Radio>
          </Radio.Group>
        </Card>
      </Content>

      <Content>
        <Title level={5}>Options</Title>
        <Card>
          <Radio.Group>
            <Radio value="small">Light</Radio>
            <Radio value="middle">System</Radio>
            <Radio value="large">Dark</Radio>
          </Radio.Group>
        </Card>
      </Content>
    </Page>
  )
}

export default Settings
