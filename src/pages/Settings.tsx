import React from 'react'
import { Typography, Form, Radio, Card } from 'antd'
import Page from '../layout/Page'
import { Content } from 'antd/lib/layout/layout'
import { useTheme } from '../context/ThemeProvider'

const { Title, Text } = Typography

const Settings = () => {
  const [form] = Form.useForm()
  const { theme, switchTheme } = useTheme()

  const themes = [
    {
      name: 'light-theme',
      label: 'Light',
    },
    {
      name: 'dark-theme',
      label: 'Dark',
    },
    // {
    //   name: 'system-theme',
    //   label: 'System',
    // },
  ]

  return (
    <Page
      header={
        <Content style={{ marginBottom: 30 }}>
          <Title style={{ fontWeight: 'bold' }}>Settings</Title>
        </Content>
      }
    >
      <Content style={{ marginBottom: 30 }}>
        <Title level={5}>Viewing Mode</Title>
        <Card>
          <Radio.Group
            value={theme}
            onChange={(e) => switchTheme(e.target.value)}
          >
            {themes.map((themeOptions) => {
              console.log(themeOptions, theme)

              return (
                <Radio key={themeOptions.name} value={themeOptions.name}>
                  {themeOptions.label}
                </Radio>
              )
            })}
          </Radio.Group>
        </Card>
      </Content>
    </Page>
  )
}

export default Settings
