import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Frame from './Frame'
import { VeramoProvider } from '@veramo-community/veramo-react'
import { defaultAgent } from '../agent'
import { ThemeProvider } from '../context/ThemeProvider'

const App = () => {
  return (
    <ThemeProvider>
      {
        // @ts-ignore
        <VeramoProvider>
          <BrowserRouter>
            <Route component={Frame} />
          </BrowserRouter>
        </VeramoProvider>
      }
    </ThemeProvider>
  )
}

export default App
