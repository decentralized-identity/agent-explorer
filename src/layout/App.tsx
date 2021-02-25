import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Frame from './Frame'
import { VeramoProvider } from '@veramo-community/veramo-react'

import { ThemeProvider } from '../context/ThemeProvider'
import { QueryClientProvider, QueryClient } from 'react-query'
import { PageModuleProvider } from '../context/WidgetProvider'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
declare global {
  interface Window {
    BASE_URL: string
  }
}
function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const App = () => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {
          // @ts-ignore
          <Web3ReactProvider getLibrary={getLibrary}>
            <VeramoProvider>
              <PageModuleProvider>
                <BrowserRouter>
                  <Route component={Frame} />
                </BrowserRouter>
              </PageModuleProvider>
            </VeramoProvider>
          </Web3ReactProvider>
        }
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
