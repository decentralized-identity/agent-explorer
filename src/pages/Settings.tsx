import React from 'react'
import { Card } from 'antd'
import Version from '../components/standard/Version'
import Web3 from '../components/standard/Web3'
import ThemeModule from '../components/standard/ThemeSwitch'
import { PageContainer } from '@ant-design/pro-components'

const Settings = () => {
  return (
    <PageContainer>
      <Card title={'Version'}>
        <Version />
      </Card>
      <ThemeModule />
      <Web3 />
    </PageContainer>
  )
}

export default Settings
