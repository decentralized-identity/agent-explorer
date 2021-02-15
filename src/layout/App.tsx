import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Frame from './Frame'
import { VeramoProvider } from '@veramo-community/veramo-react'
import { defaultAgent } from '../agent'
import { ThemeProvider } from '../context/ThemeProvider'
import { QueryClientProvider, QueryClient } from 'react-query'
import { PageModuleProvider } from '../context/PageModuleProvider'

const App = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {
          // @ts-ignore
          <VeramoProvider>
            <PageModuleProvider>
              <BrowserRouter>
                <Route component={Frame} />
              </BrowserRouter>
            </PageModuleProvider>
          </VeramoProvider>
        }
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
