import React, { createContext, useState, useContext } from 'react'
import { PAGE_DEFAULT_MODULES, MODULE_MAP } from '../components/modules'
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

    if (!localModuleStore && PAGE_DEFAULT_MODULES[pageName]) {
      const defaultModuleStore = PAGE_DEFAULT_MODULES[pageName]

      localStorage.setItem(
        `${pageName}:modules`,
        JSON.stringify(defaultModuleStore),
      )
      setModules(defaultModuleStore)
    } else {
      localModuleStore && setModules(JSON.parse(localModuleStore))
    }
  }

  const saveConfig = (
    pageName: string,
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

      localStorage.setItem(`${pageName}:modules`, JSON.stringify(newState))
      return newState
    })
  }

  return (
    <PageModuleContext.Provider
      value={{ modules, loadPageModules, addModule, removeModule, saveConfig }}
    >
      {props.children}
    </PageModuleContext.Provider>
  )
}

const usePageModules = () => useContext(PageModuleContext)

export { PageModuleProvider, usePageModules }
