import React from 'react'
import { Button } from 'antd'
import { PageContainer } from '@ant-design/pro-components'
import { useWeb3Modal } from '@web3modal/wagmi/react'

export const Web3: React.FC = () => {
  const { open } = useWeb3Modal()
  return (
    <PageContainer>
      <Button onClick={() => open()}>Open Connect Modal</Button>
      <Button onClick={() => open({ view: 'Networks' })}>Open Network Modal</Button>
    </PageContainer>
  )
}
