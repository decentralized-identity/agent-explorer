import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react'
import { PAGE_DEFAULT_WIDGETS, WIDGET_MAP } from '../components/widgets'
import { PageWidgetConfig } from '../types'

const PageModuleContext = createContext<any>({})

const PageModuleProvider = (props: any) => {
  const [modules, setModules] = useState<PageWidgetConfig[]>([])
  const [pageName, setPageName] = useState('')

  const addModule = (pageName: string, widgetKey: string) => {
    setModules((s) => {
      const updated = s.concat([WIDGET_MAP[widgetKey]])
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

  const loadPageModules = useCallback(() => {
    const localModuleStore = localStorage.getItem(`${pageName}:modules`)
    if (!localModuleStore && PAGE_DEFAULT_WIDGETS[pageName]) {
      const defaultModuleStore = PAGE_DEFAULT_WIDGETS[pageName]

      localStorage.setItem(
        `${pageName}:modules`,
        JSON.stringify(defaultModuleStore),
      )
      setModules(defaultModuleStore)
    } else {
      setModules(localModuleStore ? JSON.parse(localModuleStore) : [])
    }
  }, [pageName, setModules])

  useEffect(() => {
    if (pageName) {
      loadPageModules()
    }
  }, [pageName, loadPageModules])

  const saveConfig = (
    _pageName: string,
    index: number,
    config: any,
    moduleLabel: string,
  ) => {
    const moduleToUpdate = modules.find((item, i) => index === i)

    const updatedModuleConfig: PageWidgetConfig = {
      ...moduleToUpdate,
      widgetName: moduleToUpdate?.widgetName as string,
      widgetLabel: moduleLabel || (moduleToUpdate?.widgetLabel as string),
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
