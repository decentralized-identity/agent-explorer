import React from 'react'
import { Typography, Button } from 'antd'
import { hooks as metamaskHooks, metaMask } from '../../context/web3/metaMask'
import { PageContainer } from '@ant-design/pro-components'

export const Web3: React.FC = () => {
  const metaMaskIsActive = metamaskHooks.useIsActive()

  return (
    <PageContainer>
      <Typography>Metamask</Typography>
      {!metaMaskIsActive && (
        <Button onClick={() => metaMask.activate()}>Connect</Button>
      )}
      {metaMaskIsActive && (
        <Button onClick={() => metaMask.resetState()}>Disconnect</Button>
      )}
    </PageContainer>
  )
}
