import React from 'react'
import { Card, Space } from 'antd'
import Version from '../components/Version'
import Web3 from '../components/Web3'
import ThemeModule from '../components/ThemeSwitch'
import PluginManager from '../components/PluginManager'
import { PageContainer } from '@ant-design/pro-components'

const Settings = () => {
  return (
    <PageContainer>
      <Space direction="vertical" style={{width: '100%'}}>
      <Card title={'Version'}>
        <Version />
      </Card>
      <ThemeModule />
      <Web3 />
      <PluginManager />
      </Space>
    </PageContainer>
  )
}

export default Settings
