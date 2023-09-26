import { MenuDataItem } from '@ant-design/pro-components';
import { UniqueVerifiableCredential } from '@veramo/core-types'
import { IAgentPlugin } from '@veramo/core'

export type IAgentExplorerPluginConfig = {
  url: string;
  enabled: boolean;
}

export type IRouteComponent = {
  path: string;
  element: React.JSX.Element;
}

export type IAgentExplorerPlugin = {
  config: IAgentExplorerPluginConfig;
  name: string;
  description: string;
  routes: IRouteComponent[];
  menuItems: MenuDataItem[];
  requiredMethods: string[];
  hasCss?: boolean;
  credentialContextMenuItems?: MenuDataItem[];
  identifierContextMenuItems?: MenuDataItem[];
  getCredentialComponent?: (credential: UniqueVerifiableCredential) => React.JSX.Element;
  agentPlugins?: IAgentPlugin[];
}

export interface IPlugin {
  init: () => IAgentExplorerPlugin;
}
