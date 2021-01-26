import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Frame from './Frame'

const App = () => {
  return (
    <BrowserRouter>
      <Route component={Frame} />
    </BrowserRouter>
  )
}

export default App
