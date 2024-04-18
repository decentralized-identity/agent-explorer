import { MenuProps } from 'antd';
import { MenuDataItem } from '@ant-design/pro-components';
import { IMessage, UniqueVerifiableCredential } from '@veramo/core-types'
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
  
  /** You don't have to provide this. It is used by internal implementation */
  config?: IAgentExplorerPluginConfig;
  
  /** The plugin name */
  name: string;

  /** A short description of the plugin */
  description: string;

  /** The plugin icon */
  icon?: React.ReactNode;

  /** An array of routes to be added to the explorer */
  routes?: IRouteComponent[];
  
  /** An array of menu items to be added to the explorer */
  menuItems?: ExtendedMenuDataItem[];
  
  /** An array of methods that the plugin requires to be implemented by the agent*/
  requiredMethods: string[];
  
  /** Does the plugin provide custom css */
  hasCss?: boolean;
  
  /** Veramo agent plugins accesable by all explorer plugins */
  agentPlugins?: IAgentPlugin[];

  /** Veramo agent message handlers */
  messageHandlers?: AbstractMessageHandler[];

  /** Menu items for the credential context menu */
  getCredentialContextMenuItems?: (credential: UniqueVerifiableCredential) => MenuProps['items'];

  /** Returns a react component for a given verifiable credential */
  getCredentialComponent?: (credential: UniqueVerifiableCredential) => React.FC<IVerifiableComponentProps> | undefined;

  /** Returns a react header component for a given verifiable credential */
  getCredentialHeaderComponent?: (credential: UniqueVerifiableCredential) => React.FC<IVerifiableComponentProps> | undefined;

  /** Returns a react component that will be displayed in the identifier hover component */
  getIdentifierHoverComponent?: () => React.FC<IIdentifierHoverComponentProps>;

  /** Returns an array of supported chat message types */
  supportedChatMessages?: string[];

  /** Returns a react component for a given DIDComm message */
  getMessageComponent?: (message: IMessage) => React.FC | undefined;

  /** Returns an array of react components and labels that will be displayed as tabs in the indentifier profile page */
  getIdentifierTabsComponents?: () => Array<{ label: string, component: React.FC<IIdentifierTabsComponentProps> }>;
  
  /** Returns an array of react components that will be displayed as action buttons in Credential component */
  getCredentialActionComponents?: () => Array<React.FC<ICredentialActionComponentProps>>;

  /** react-markdown Components for custom markdown rendering */
  getMarkdownComponents?: () => Partial<Components> | undefined;

  /** remark plugins for custom markdown manipulations */
  getRemarkPlugins?: () => PluggableList;
}

export interface IPlugin {
  init: () => IAgentExplorerPlugin;
}
