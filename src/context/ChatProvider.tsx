import React, { createContext, useState, useContext } from 'react'

const ChatContext = createContext<any>({})

const ChatProvider = (props: any) => {
  const [selectedDid, setSelectedDid] = useState()
  console.log('selectedDid: ', selectedDid)
  const [composing, setComposing] = useState(false)
  const [newRecipient, setNewRecipient] = useState()
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
