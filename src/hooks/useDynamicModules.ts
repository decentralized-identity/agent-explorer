import React, { useState } from 'react'
import { PageModuleConfig } from '../types'

export function useDynamicModules() {
  const [modules, setModules] = useState<PageModuleConfig[]>([])

  return { modules, setModules }
}
