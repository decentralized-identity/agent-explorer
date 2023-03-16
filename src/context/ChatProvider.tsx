import { useVeramo } from '@veramo-community/veramo-react'
import { IDIDManager } from '@veramo/core'
import React, { createContext, useState, useContext, useEffect } from 'react'
import { pickup } from '../utils/didcomm-mediation'

const ChatContext = createContext<any>({})

const ChatProvider = (props: any) => {
  const [selectedDid, setSelectedDid] = useState()
  const [composing, setComposing] = useState(false)
  const [newRecipient, setNewRecipient] = useState()

  const MINUTE_MS = 6000
  const { agent } = useVeramo<IDIDManager>()
  const checkMyDIDs = async () => {
    console.log('agent: ', agent)
    const knownDIDs = await agent?.didManagerFind()
    console.log('knownDIDs: ', knownDIDs)
    const myDIDs = knownDIDs?.filter((d) => d.keys.length > 0)
    console.log('myDIDs: ', myDIDs)
    if (myDIDs && myDIDs.length > 0) {
      for (let d in myDIDs) {
        const did = myDIDs[d].did
        pickup(agent, did, 'did:web:dev-didcomm-mediator.herokuapp.com')
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => checkMyDIDs(), MINUTE_MS)
    return () => clearInterval(interval)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        selectedDid,
        setSelectedDid,
        composing,
        setComposing,
        newRecipient,
        setNewRecipient,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  )
}

const useChat = () => useContext(ChatContext)

export { ChatProvider, useChat }
