import React, { useState } from 'react'
import { Typography, Card, Button } from 'antd'
import { hooks as metamaskHooks, metaMask } from '../../context/web3/metaMask'

const Web3: React.FC = () => {
  const metaMaskIsActive = metamaskHooks.useIsActive()
  const [disabled, setDisabled] = useState(false)
  return (
    <Card>
      <Typography>Metamask</Typography>
      {!metaMaskIsActive && (
        <Button
          disabled={disabled}
          onClick={async () => {
            setDisabled(true)
            await metaMask.activate()
            setDisabled(false)
          }}
        >
          Connect
        </Button>
      )}
      {metaMaskIsActive && (
        <Button onClick={() => metaMask.resetState()}>Disconnect</Button>
      )}
    </Card>
  )
}

export default Web3
