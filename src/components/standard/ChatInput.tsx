import React from 'react'
import { Input } from 'antd'

const { TextArea } = Input

interface SimpleProps {}

const ChatInput: React.FC<SimpleProps> = () => {
  return (
    <div
      style={{
        background: '#eaeaea',
        padding: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <TextArea placeholder="Autosize height based on content lines" autoSize />
    </div>
  )
}

export default ChatInput
