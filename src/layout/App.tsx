import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Frame from './Frame'
import { VeramoProvider } from '@veramo-community/veramo-react'
import { ThemeProvider } from '../context/ThemeProvider'
import { QueryClientProvider, QueryClient } from 'react-query'
import { PageModuleProvider } from '../context/WidgetProvider'
import { ChatProvider } from '../context/ChatProvider'

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
          <VeramoProvider>
            <ChatProvider>
              <PageModuleProvider>
                <BrowserRouter>
                  <Route component={Frame} />
                </BrowserRouter>
              </PageModuleProvider>
            </ChatProvider>
          </VeramoProvider>
        }
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
