import { useEffect, useState } from 'react'
import { VeramoProvider } from '@veramo-community/veramo-react'
import { IAgentPlugin, IResolver, TAgent } from '@veramo/core'
import { createWeb3Agent } from './web3Agent'
import { hooks as metamaskHooks, metaMask } from './metaMask'

export const VeramoWeb3Provider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const [web3agent, setWeb3Agent] = useState<TAgent<IResolver>>()

  const metaMaskIsActive = metamaskHooks.useIsActive()
  const metaMaskChainId = metamaskHooks.useChainId()
  const metaMaskAccounts = metamaskHooks.useAccounts()
  const metaMaskProvider = metamaskHooks.useProvider()

  // attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask')
    })
  }, [])

  useEffect(() => {
    if (
      metaMaskProvider &&
      metaMaskChainId &&
      metaMaskAccounts &&
      metaMaskIsActive
    ) {
      const connectors = [
        {
          chainId: metaMaskChainId,
          accounts: metaMaskAccounts,
          provider: metaMaskProvider,
          isActive: metaMaskIsActive,
          name: 'metamask',
        },
      ]

      void createWeb3Agent({ connectors }).then(setWeb3Agent)
    }

    return () => {
      setWeb3Agent(undefined)
    }
  }, [metaMaskIsActive, metaMaskChainId, metaMaskAccounts, metaMaskProvider])

  const plugins: IAgentPlugin[] = []

  return (
    <VeramoProvider agents={web3agent && [web3agent]} plugins={plugins}>
      {children}
    </VeramoProvider>
  )
}
