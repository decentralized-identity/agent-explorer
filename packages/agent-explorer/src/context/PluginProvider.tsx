import React, { createContext, useState, useEffect, useContext } from 'react'
import { AgentPlugin, PluginConfig } from '@veramo-community/agent-explorer-plugin'
import { getcorePlugins } from '../plugins'

const corePlugins = getcorePlugins()

type PluginContextType = {
  plugins: AgentPlugin[]
  pluginConfigs: PluginConfig[]
  updatePluginConfigs: (configs: PluginConfig[]) => void
  addPluginConfig: (config: PluginConfig) => void
  removePluginConfig: (url: string) => void
  switchPlugin: (url: string, enabled: boolean) => void
}

const PluginContext = createContext<PluginContextType>({
  plugins: [],
  pluginConfigs: [],
  updatePluginConfigs: () => null,
  addPluginConfig: () => null,
  removePluginConfig: () => null,
  switchPlugin: () => null,
})

function getStoredPluginConfigs(): PluginConfig[] {
  let result: PluginConfig[] = []

  const corePluginConfigs = corePlugins.map((p) => (p.config as PluginConfig))

  const str = localStorage.getItem('pluginConfigs')
  if (str) {
    const storedPluginConfigs = JSON.parse(str) as PluginConfig[]

    result = [...storedPluginConfigs]

    // add system configs that are not stored
    corePluginConfigs.forEach((c) => {
      const storedConfig = storedPluginConfigs.find((p) => p.url === c.url)
      if (!storedConfig) {
        result.push(c)
      }
    })
  } else {
    result = corePluginConfigs
  }
  return result
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
        if (config.url.startsWith('core://')) {
          const plugin = corePlugins.find((p) => p.config.url === config.url)
          if (plugin) {
            plugin.config = config
            result.push(plugin)
          }
        } else {
          const module = await import(/* webpackIgnore: true */ config.url)
          const plugin = module.default.init() as AgentPlugin
          plugin.config = config
          result.push(plugin)
          //FIXME
          if (plugin.hasCss && config.enabled) {
            const cssUrl = config.url.replace('plugin.js', 'plugin.css')
            try {
              const cssResponse = await fetch(cssUrl)
              if (cssResponse.ok) {
                const css = await cssResponse.text()
                const style = document.createElement('style')
                style.type = 'text/css'
                style.appendChild(document.createTextNode(css))
                document.head.appendChild(style)
              }
            } catch (e) {
              //do nothing
            }
          }
        }
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

  const updatePluginConfigs = (configs: PluginConfig[]) => {
    storePluginConfigs(configs)
    setPluginConfigs(configs)
  }

  return (
    <PluginContext.Provider
      value={{
        plugins,
        pluginConfigs, 
        updatePluginConfigs,
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
