import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import { ThemeProvider } from '../context/ThemeProvider'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ChatProvider } from '../context/ChatProvider'
import { VeramoWeb3Provider } from '../context/web3/VeramoWeb3Provider'
import { PluginProvider } from '@veramo-community/agent-explorer-plugin'
import { getcorePlugins } from '../plugins'
import { WagmiProvider } from '../context/web3/wagmi'

declare global {
  interface Window {
    BASE_URL: string
  }
}

const corePlugins = getcorePlugins()

const App = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WagmiProvider>
          <VeramoWeb3Provider>
            <PluginProvider corePlugins={corePlugins}>
              <ChatProvider>
                <BrowserRouter>
                  <Layout />
                </BrowserRouter>
              </ChatProvider>
            </PluginProvider>
          </VeramoWeb3Provider>
        </WagmiProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
