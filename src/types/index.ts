export interface PageModuleConfig {
  /**
   * This is the function name
   */
  moduleName: string
  /**
   * Label to show in UI
   */
  moduleLabel: string
  /**
   * Config to be passed to the module. Each module can specify their own configs and save them back to storage.
   */
  config?: any
  /**
   * A list of pages to allow this module to run on. Omit to allow all pages
   */
  pages?: string[]
}

export interface PageModulesDefaults {
  [index: string]: PageModuleConfig[]
}

export interface PageModuleProps {
  /**
   * Label that gets shown on the module
   */
  title: string
  /**
   * Show the loading state of the card
   */
  isLoading?: boolean
  /**
   * Function to remove the module
   */
  remove: () => void
  /**
   * Disable remove button (for hardcoding modules)
   */
  removeDisabled?: boolean
  /**
   * Custom config for each module. Should be serializable values
   */
  config?: any
  /**
   * Render configs in your module and access saveConfig
   */
  // renderConfigs:() => React.ReactNode
  /**
   * Save the config for this module
   */
  saveConfig?: (config: any, label?: string) => void
  /**
   * Remove padding and borders from module card
   */
  noPadding?: boolean
}
