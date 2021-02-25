import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Frame from './Frame'
import { VeramoProvider } from '@veramo-community/veramo-react'

import { ThemeProvider } from '../context/ThemeProvider'
import { QueryClientProvider, QueryClient } from 'react-query'
import { PageModuleProvider } from '../context/PageModuleProvider'
declare global {
  interface Window {
    BASE_URL: string
  }
}

const App = () => {
  const queryClient = new QueryClient()
  const baseUrl = window.BASE_URL || '/'

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {
          // @ts-ignore
          <VeramoProvider>
            <PageModuleProvider>
              <BrowserRouter basename={baseUrl}>
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
