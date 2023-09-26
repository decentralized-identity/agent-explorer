import { MenuDataItem } from '@ant-design/pro-components';

export type PluginConfig = {
  url: string;
  enabled: boolean;
}

export type RouteComponent = {
  path: string;
  element: React.JSX.Element;
}

export type AgentPlugin = {
  config: PluginConfig;
  name: string;
  description: string;
  routes: RouteComponent[];
  menuItems: MenuDataItem[];
  requiredMethods: string[];
  hasCss?: boolean;
}

export interface IPlugin {
  init: () => AgentPlugin;
}
