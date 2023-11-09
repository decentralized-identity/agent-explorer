import { MenuProps } from 'antd';
import { MenuDataItem } from '@ant-design/pro-components';
import { UniqueVerifiableCredential } from '@veramo/core-types'
import { IAgentPlugin } from '@veramo/core'
import { Components } from 'react-markdown'
import { PluggableList } from 'unified'
import { AbstractMessageHandler } from '@veramo/message-handler'

export type IAgentExplorerPluginConfig = {
  url: string;
  commitId?: string;
  enabled: boolean;
}

export type IRouteComponent = {
  path: string;
  element: React.JSX.Element;
}


export type IVerifiableComponentProps = {
  credential: UniqueVerifiableCredential
  context?: any
}

export type IIdentifierHoverComponentProps = {
  did: string
}
export type IIdentifierTabsComponentProps = {
  did: string
}
export type ICredentialActionComponentProps = {
  hash: string
}

type ExtendedMenuDataItem = MenuDataItem & {
  routes?: Array<{
    name: string,
    path: string,
  }>;
}

export type IAgentExplorerPlugin = {
  config?: IAgentExplorerPluginConfig;
  name: string;
  description: string;
  icon?: React.ReactNode;
  routes?: IRouteComponent[];
  menuItems?: ExtendedMenuDataItem[];
  requiredMethods: string[];
  hasCss?: boolean;
  identifierContextMenuItems?: MenuProps['items'];
  agentPlugins?: IAgentPlugin[];
  messageHandlers?: AbstractMessageHandler[];
  getCredentialContextMenuItems?: (credential: UniqueVerifiableCredential) => MenuProps['items'];
  getCredentialComponent?: (credential: UniqueVerifiableCredential) => React.FC<IVerifiableComponentProps> | undefined;
  getIdentifierHoverComponent?: () => React.FC<IIdentifierHoverComponentProps>;
  getIdentifierTabsComponents?: () => Array<{label: string, component: React.FC<IIdentifierTabsComponentProps>}>;
  getCredentialActionComponents?: () => Array<React.FC<ICredentialActionComponentProps>>;
  getMarkdownComponents?: () => Partial<Components> | undefined;
  getRemarkPlugins?: () => PluggableList;
}

export interface IPlugin {
  init: () => IAgentExplorerPlugin;
}
