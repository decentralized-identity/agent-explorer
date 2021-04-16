import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react'
import { PAGE_DEFAULT_MODULES, MODULE_MAP } from '../components/modules'
import { PageModuleConfig } from '../types'

const PageModuleContext = createContext<any>({})

const PageModuleProvider = (props: any) => {
  const [modules, setModules] = useState<PageModuleConfig[]>([])
  const [pageName, setPageName] = useState('')

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

  const loadPageModules = () => {
    const localModuleStore = localStorage.getItem(`${pageName}:modules`)
    if (!localModuleStore && PAGE_DEFAULT_MODULES[pageName]) {
      const defaultModuleStore = PAGE_DEFAULT_MODULES[pageName]

      localStorage.setItem(
        `${pageName}:modules`,
        JSON.stringify(defaultModuleStore),
      )
      setModules(defaultModuleStore)
    } else {
      setModules(localModuleStore ? JSON.parse(localModuleStore) : [])
    }
  }

  useEffect(() => {
    if (pageName) {
      loadPageModules()
    }
  }, [pageName])

  const saveConfig = (
    _pageName: string,
    index: number,
    config: any,
    moduleLabel: string,
  ) => {
    const moduleToUpdate = modules.find((item, i) => index === i)

    const updatedModuleConfig: PageModuleConfig = {
      ...moduleToUpdate,
      moduleName: moduleToUpdate?.moduleName as string,
      moduleLabel: moduleLabel || (moduleToUpdate?.moduleLabel as string),
      config,
    }

    setModules((s) => {
      const newState = s.slice()
      newState[index] = {
        ...updatedModuleConfig,
      }

      console.log('UPDATED', newState)

      localStorage.setItem(`${_pageName}:modules`, JSON.stringify(newState))
      return newState
    })
  }

  return (
    <PageModuleContext.Provider
      value={{
        modules,
        loadPageModules,
        addModule,
        removeModule,
        saveConfig,
        setPageName,
      }}
    >
      {props.children}
    </PageModuleContext.Provider>
  )
}

const usePageModules = () => useContext(PageModuleContext)

export { PageModuleProvider, usePageModules }
