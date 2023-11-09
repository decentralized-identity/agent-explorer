import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Layout from './Layout'
import { ThemeProvider } from '../context/ThemeProvider'
import { QueryClientProvider, QueryClient } from 'react-query'
import { ChatProvider } from '../context/ChatProvider'
import { PluginProvider } from '@veramo-community/agent-explorer-plugin'
import { getcorePlugins } from '../plugins'

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
        <PluginProvider corePlugins={corePlugins}>
          <ChatProvider>
            <BrowserRouter>
              <Layout />
            </BrowserRouter>
          </ChatProvider>
        </PluginProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
