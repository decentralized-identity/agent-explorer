import { MenuDataItem } from '@ant-design/pro-components';
import { useVeramo } from '@veramo-community/veramo-react';
import React, { createContext, useState, useEffect, useContext } from 'react'

type RouteComponent = {
  path: string;
  element: React.JSX.Element;
}

type AgentPlugin = {
  name: string;
  description: string;
  routes: RouteComponent[];
  menuItems: MenuDataItem[];
}

type PluginContextType = {
  plugins: AgentPlugin[]
  pluginUrls: string[]
  addPluginUrl: (url: string) => void
  removePluginUrl: (url: string) => void
}

const PluginContext = createContext<PluginContextType>({
  plugins: [],
  pluginUrls: [],
  addPluginUrl: () => {},
  removePluginUrl: () => {},
})

function getStoredPluginUrls(): string[] {
  const str = localStorage.getItem('plugins')
  if (str) {
    return JSON.parse(str)
  } else {
    return []
  }
}

function storePluginUrls(urls: string[]) {
  localStorage.setItem('plugins', JSON.stringify(urls))
}

const PluginProvider = (props: any) => {
  const { agent } = useVeramo()
  
  const [pluginUrls, setPluginUrls] = useState<string[]>(
    getStoredPluginUrls(),
  )
  const [plugins, setPlugins] = useState<AgentPlugin[]>([])

  useEffect(() => {
    const loadPlugins = async () => {
      const result: AgentPlugin[] = []

      for (const url of pluginUrls) {
        const module = await import(/* webpackIgnore: true */ url)
        const plugin = module.default.init(agent) as AgentPlugin
        result.push(plugin)
      }
      setPlugins(result)
    }

    loadPlugins()
  }, [pluginUrls, setPlugins, agent])

  const addPluginUrl = (url: string) => {
    const urls = [...pluginUrls, url]
    storePluginUrls(urls)
    setPluginUrls(urls)
  }

  const removePluginUrl = (url: string) => {
    const urls = pluginUrls.filter((u) => u !== url)
    storePluginUrls(urls)
    setPluginUrls(urls)
  }

  return (
    <PluginContext.Provider
      value={{
        plugins,
        pluginUrls, 
        addPluginUrl,
        removePluginUrl,
      }}
    >
        {props.children}
    </PluginContext.Provider>
  )
}

const usePlugins = () => useContext(PluginContext)

export { PluginProvider, usePlugins }
