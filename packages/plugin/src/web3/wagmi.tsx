import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { arbitrum, mainnet, sepolia, goerli, optimism } from 'wagmi/chains'
import { WagmiConfig } from 'wagmi'
import React, { PropsWithChildren } from 'react'
import { type WalletClient, useWalletClient } from 'wagmi'
import { BrowserProvider } from 'ethers'

const projectId = '8923f80c7aefd6f580a1f1d630633ab5'

const metadata = {
  name: 'Agent Explorer',
  description: 'Explore data across multiple DID agents',
  url: window.location.protocol + '//' + window.location.hostname,
  icons: ['https://explore.veramo.io/icon-192-maskable.png']
}

const chains = [mainnet, arbitrum, sepolia, goerli, optimism]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({ wagmiConfig, projectId, chains })

export const WagmiProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
}

export function walletClientToProvider(walletClient: WalletClient) {
  const { chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  // const signer = provider.getSigner(account.address)
  return provider
}

export function useEthersProvider() {
  const { data: walletClient } = useWalletClient()
  return React.useMemo(
    () => (walletClient ? walletClientToProvider(walletClient) : undefined),
    [walletClient],
  )
}
