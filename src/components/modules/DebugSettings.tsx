import React, { useState } from 'react'
import { Card, Input } from 'antd'
import debug from 'debug'

const DebugSettings = () => {
  const [namespace, setNamespace] = useState(localStorage.debug)

  const handleNamespaceChange = (s: string) => {
    debug.enable(s)
    setNamespace(s)
  }

  return (
    <Card>
      <Input
        type="text"
        value={namespace}
        onChange={(e) => handleNamespaceChange(e.target.value)}
      />
    </Card>
  )
}

export default DebugSettings
