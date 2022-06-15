import { IDIDManager, TAgent } from '@veramo/core'
import { ICredentialIssuer } from '@veramo/credential-w3c'
import { ISelectiveDisclosure } from '@veramo/selective-disclosure'
import { JSONSchema7 } from 'json-schema'

export type ConfiguredAgent = TAgent<
  ICredentialIssuer & IDIDManager & ISelectiveDisclosure
>

export interface PageWidgetConfig {
  /**
   * This is the function name
   */
  widgetName: string
  /**
   * Label to show in UI
   */
  widgetLabel: string
  /**
   * Config to be passed to the module. Each module can specify their own configs and save them back to storage.
   */
  config?: any
  /**
   * A list of pages to allow this module to run on. Omit to allow all pages
   */
  pages?: string[]

  /**
   * Hide the module from the module picker
   */
  unlisted?: boolean
}

export interface PageWidgetDefaults {
  [index: string]: PageWidgetConfig[]
}

export interface PageWidgetProps {
  /**
   * A unique identifier for this module
   */
  id?: string | number
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
   * Save the config for this module
   */
  saveConfig?: (config: any, label?: string) => void
  /**
   * Remove padding and borders from module card
   */
  renderSettings?: () => React.ReactNode
  /**
   * Remove padding and borders from module card
   */
  noPadding?: boolean
}

export interface VCJSONSchema {
  id: string
  name: string
  schema: JSONSchema7
}
