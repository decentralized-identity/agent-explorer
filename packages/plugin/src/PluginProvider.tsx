import React, { createContext, useState, useEffect, useContext } from 'react'
import { IAgentExplorerPlugin, IAgentExplorerPluginConfig } from './types.js'
import { App } from 'antd'
import { VeramoWeb3Provider } from './web3/VeramoWeb3Provider.js'
import { WagmiProvider } from './web3/wagmi.js'
import { IAgentPlugin } from '@veramo/core-types'
import { AbstractMessageHandler } from '@veramo/message-handler'


type PluginContextType = {
  plugins: IAgentExplorerPlugin[]
  pluginConfigs: IAgentExplorerPluginConfig[]
  updatePluginConfigs: (configs: IAgentExplorerPluginConfig[]) => void
  addPluginConfig: (config: IAgentExplorerPluginConfig) => void
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

function getStoredPluginConfigs(corePlugins: any[]): IAgentExplorerPluginConfig[] {
  let result: IAgentExplorerPluginConfig[] = []

  const corePluginConfigs = corePlugins.map((p) => (p.config as IAgentExplorerPluginConfig))

  const str = localStorage.getItem('pluginConfigs')
  if (str) {
    const storedPluginConfigs = JSON.parse(str) as IAgentExplorerPluginConfig[]

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

function storePluginConfigs(configs: IAgentExplorerPluginConfig[]) {
  localStorage.setItem('pluginConfigs', JSON.stringify(configs))
}

export type PluginProviderProps = {
  children: React.ReactNode
  corePlugins?: IAgentExplorerPlugin[]
}

const PluginProvider = (props: PluginProviderProps) => {
  
  const { notification } = App.useApp()
  const [pluginConfigs, setPluginConfigs] = useState<IAgentExplorerPluginConfig[]>(
    getStoredPluginConfigs(props.corePlugins || []),
  )
  const [plugins, setPlugins] = useState<IAgentExplorerPlugin[]>([])

  useEffect(() => {
    const loadPlugins = async () => {
      const result: IAgentExplorerPlugin[] = []
      
      for (const config of pluginConfigs) {
        if (config.url.startsWith('core://')) {
          const plugin = props.corePlugins?.find((p) => p.config?.url === config.url)
          if (plugin) {
            plugin.config = config
            result.push(plugin)
          }
        } else {
          try {
            let url = config.url
            if (config.url.startsWith('github://')) {
              url = `https://cdn.jsdelivr.net/gh/${config.url.replace('github://', '')}@${config.commitId}/dist/plugin.js`
            }
            const module = await import(/* webpackIgnore: true */ url)
            const plugin = module.default.init() as IAgentExplorerPlugin
            plugin.config = config
            result.push(plugin)
            //FIXME
            if (plugin.hasCss && config.enabled) {
              const cssUrl = url.replace('plugin.js', 'plugin.css')
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
          } catch (e: any) {
            notification.error({
              message: `Error loading plugin ${config.url}`,
              description: e.message,
            })
          }
        }
      }
      setPlugins(result)
    }

    loadPlugins()
  }, [pluginConfigs, setPlugins])

  const addPluginConfig = (config: IAgentExplorerPluginConfig) => {
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

  const updatePluginConfigs = (configs: IAgentExplorerPluginConfig[]) => {
    storePluginConfigs(configs)
    setPluginConfigs(configs)
  }

  const agentPlugins: IAgentPlugin[] = React.useMemo(() => {
    const agentPlugins: IAgentPlugin[] = []
    plugins.forEach((p) => {
      if (p.agentPlugins) {
        agentPlugins.push(...p.agentPlugins)
      }
    })
    return agentPlugins
  }, [plugins])

  const messageHandlers: AbstractMessageHandler[] = React.useMemo(() => {
    const messageHandlers: AbstractMessageHandler[] = []
    plugins.forEach((p) => {
      if (p.messageHandlers) {
        messageHandlers.push(...p.messageHandlers)
      }
    })
    return messageHandlers
  }, [plugins])

  return (
    <WagmiProvider>
      <VeramoWeb3Provider 
        plugins={agentPlugins}
        messageHandlers={messageHandlers}
        >
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
      </VeramoWeb3Provider>
    </WagmiProvider>
  )
}

const usePlugins = () => useContext(PluginContext)

export { PluginProvider, usePlugins }
