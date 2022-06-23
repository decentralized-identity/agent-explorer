import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Frame from './Frame'
import { ThemeProvider } from '../context/ThemeProvider'
import { QueryClientProvider, QueryClient } from 'react-query'
import { PageModuleProvider } from '../context/WidgetProvider'
import { ChatProvider } from '../context/ChatProvider'
import { VeramoWeb3Provider } from '../context/web3/VeramoWeb3Provider'

declare global {
  interface Window {
    BASE_URL: string
  }
}

const App = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {
          <VeramoWeb3Provider>
            <ChatProvider>
              <PageModuleProvider>
                <BrowserRouter>
                  <Route component={Frame} />
                </BrowserRouter>
              </PageModuleProvider>
            </ChatProvider>
          </VeramoWeb3Provider>
        }
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
