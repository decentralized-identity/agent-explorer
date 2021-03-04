import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Frame from './Frame'
import { VeramoProvider } from '@veramo-community/veramo-react'

import { ThemeProvider } from '../context/ThemeProvider'
import { QueryClientProvider, QueryClient } from 'react-query'
import { PageModuleProvider } from '../context/PageModuleProvider'
import { useWeb3React, Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useEagerConnect, useInactiveListener } from '../web3/hooks'
import { createWeb3Agent } from '../web3/web3Agent'
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

const VeramoWeb3Provider = (props: {children: any}) => {
  const { account, library, chainId, connector } = useWeb3React()

  const [web3agent, setWeb3Agent] = React.useState<any>()
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  // useInactiveListener(!triedEager || !!activatingConnector)
  useInactiveListener(!triedEager)

  React.useEffect((): any => {
    if (!!account && !!library && !!connector && !!chainId) {

      createWeb3Agent({connector, chainId, account})
        .then(setWeb3Agent)

      return () => {
        setWeb3Agent(undefined)
      }
    }
  }, [account, library, chainId, connector]) // ensures refresh if referential identity of library doesn't change across chainIds
  return (<VeramoProvider agents={web3agent && [web3agent]}>
    {props.children}
  </VeramoProvider>)
}

const App = () => {
  const queryClient = new QueryClient()
  const baseUrl = window.BASE_URL || '/'

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {
          // @ts-ignore
          <Web3ReactProvider getLibrary={getLibrary}>
            <VeramoWeb3Provider>
              <PageModuleProvider>
                <BrowserRouter basename={baseUrl}>
                  <Route component={Frame} />
                </BrowserRouter>
              </PageModuleProvider>
            </VeramoWeb3Provider>
          </Web3ReactProvider>
        }
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
