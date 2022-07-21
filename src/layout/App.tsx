import React, { useState, useEffect } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Frame from './Frame'
import { ThemeProvider } from '../context/ThemeProvider'
import { QueryClientProvider, QueryClient } from 'react-query'
import { PageModuleProvider } from '../context/WidgetProvider'
import { ChatProvider } from '../context/ChatProvider'
import { VeramoWeb3Provider } from '../context/web3/VeramoWeb3Provider'
import setupLibp2p from '../context/libp2p/libp2p'

declare global {
  interface Window {
    BASE_URL: string
  }
}

export const Libp2pContext = React.createContext({})

const App = () => {
  const [libp2p, setLibp2p] = useState({})
  const setupLib = async () => {
    const node = await setupLibp2p()
    setLibp2p(node)
  }
  useEffect(() => {
    setupLib()
  }, [])

  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {
          <VeramoWeb3Provider>
            <Libp2pContext.Provider value={libp2p}>
              <ChatProvider>
                <PageModuleProvider>
                  <BrowserRouter>
                    <Route component={Frame} />
                  </BrowserRouter>
                </PageModuleProvider>
              </ChatProvider>
            </Libp2pContext.Provider>
          </VeramoWeb3Provider>
        }
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
