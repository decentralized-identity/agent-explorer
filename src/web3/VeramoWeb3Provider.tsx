import React from 'react'
import { VeramoProvider } from '@veramo-community/veramo-react'
import { useWeb3React } from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from './hooks'
import { createWeb3Agent } from './web3Agent'
import { ProfileManager } from '../agent/ProfileManager'


export const VeramoWeb3Provider = (props: {children: any}) => {
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
  
  const plugins = [ new ProfileManager()]

  return (<VeramoProvider agents={web3agent && [web3agent]} plugins={plugins}>
    {props.children}
  </VeramoProvider>)
}