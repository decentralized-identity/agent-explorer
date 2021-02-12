import React, { createContext, useState, useEffect, useContext } from 'react'
import { DYNAMIC_MODULES, MODULE_MAP } from '../components/modules'
import { PageModuleConfig } from '../types'

const PageModuleContext = createContext<any>({})

const PageModuleProvider = (props: any) => {
  const [modules, setModules] = useState<PageModuleConfig[]>([])

  const addModule = (pageName: string, moduleKey: string) => {
    setModules((s) => {
      const updated = s.concat([MODULE_MAP[moduleKey]])
      localStorage.setItem(`${pageName}:modules`, JSON.stringify(updated))
      return updated
    })
  }

  const removeModule = (pageName: string, index: number) => {
    setModules((s) => {
      const updated = s.filter((_, i) => i !== index)
      localStorage.setItem(`${pageName}:modules`, JSON.stringify(updated))
      return updated
    })
  }

  const loadPageModules = (pageName: string) => {
    const localModuleStore = localStorage.getItem(`${pageName}:modules`)
    localModuleStore && setModules(JSON.parse(localModuleStore))
  }

  return (
    <PageModuleContext.Provider
      value={{ modules, loadPageModules, addModule, removeModule }}
    >
      {props.children}
    </PageModuleContext.Provider>
  )
}

const usePageModules = () => useContext(PageModuleContext)

export { PageModuleProvider, usePageModules }
