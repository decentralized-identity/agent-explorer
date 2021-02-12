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

export interface DynamicModuleProps {
  title: string
  isLoading?: boolean
  remove: () => void
  config?: any
  noPadding?: boolean
}
