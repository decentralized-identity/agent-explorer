import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Frame from './Frame'
import { VeramoProvider } from '@veramo-community/veramo-react'
import { defaultAgent } from '../agent'

const App = () => {
  return (
    // @ts-ignore
    <VeramoProvider agent={defaultAgent}>
      <BrowserRouter>
        <Route component={Frame} />
      </BrowserRouter>
    </VeramoProvider>
  )
}

export default App
