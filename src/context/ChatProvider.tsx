import React, { createContext, useState, useContext } from 'react'

const ChatContext = createContext<any>({})

const ChatProvider = (props: any) => {
  const [selectedDid, setSelectedDid] = useState()

  return (
    <ChatContext.Provider value={{ selectedDid, setSelectedDid }}>
      {props.children}
    </ChatContext.Provider>
  )
}

const useChat = () => useContext(ChatContext)

export { ChatProvider, useChat }
