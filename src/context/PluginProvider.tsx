import { MenuDataItem } from '@ant-design/pro-components';
import React, { createContext, useState, useEffect, useContext } from 'react'

type PluginConfig = {
  url: string;
  enabled: boolean;
}

type RouteComponent = {
  path: string;
  element: React.JSX.Element;
}

type AgentPlugin = {
  config: PluginConfig;
  name: string;
  description: string;
  routes: RouteComponent[];
  menuItems: MenuDataItem[];
}



type PluginContextType = {
  plugins: AgentPlugin[]
  pluginConfigs: PluginConfig[]
  addPluginConfig: (config: PluginConfig) => void
  removePluginConfig: (url: string) => void
  switchPlugin: (url: string, enabled: boolean) => void
}

const PluginContext = createContext<PluginContextType>({
  plugins: [],
  pluginConfigs: [],
  addPluginConfig: () => {},
  removePluginConfig: () => {},
  switchPlugin: () => {},
})

function getStoredPluginConfigs(): PluginConfig[] {
  const str = localStorage.getItem('pluginConfigs')
  if (str) {
    return JSON.parse(str)
  } else {
    return []
  }
}

function storePluginConfigs(configs: PluginConfig[]) {
  localStorage.setItem('pluginConfigs', JSON.stringify(configs))
}

const PluginProvider = (props: any) => {
  
  const [pluginConfigs, setPluginConfigs] = useState<PluginConfig[]>(
    getStoredPluginConfigs(),
  )
  const [plugins, setPlugins] = useState<AgentPlugin[]>([])

  useEffect(() => {
    const loadPlugins = async () => {
      const result: AgentPlugin[] = []

      for (const config of pluginConfigs) {
        const module = await import(/* webpackIgnore: true */ config.url)
        const plugin = module.default.init() as AgentPlugin
        plugin.config = config
        result.push(plugin)
      }
      setPlugins(result)
    }

    loadPlugins()
  }, [pluginConfigs, setPlugins])

  const addPluginConfig = (config: PluginConfig) => {
    const configs = [...pluginConfigs, config]
    storePluginConfigs(configs)
    setPluginConfigs(configs)
  }

  const removePluginConfig = (url: string) => {
    const configs = pluginConfigs.filter((u) => u.url !== url)
    storePluginConfigs(configs)
    setPluginConfigs(configs)
  }

  const switchPlugin = (url: string, enabled: boolean) => {
    const configs = pluginConfigs.map((c) => {
      if (c.url === url) {
        return { ...c, enabled }
      } else {
        return c
      }
    })
    storePluginConfigs(configs)
    setPluginConfigs(configs)
  }

  return (
    <PluginContext.Provider
      value={{
        plugins,
        pluginConfigs, 
        addPluginConfig,
        removePluginConfig,
        switchPlugin,
      }}
    >
        {props.children}
    </PluginContext.Provider>
  )
}

const usePlugins = () => useContext(PluginContext)

export { PluginProvider, usePlugins }
