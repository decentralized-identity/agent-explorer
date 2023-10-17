import { IAgentExplorerPlugin } from "@veramo-community/agent-explorer-plugin";

export const communityPlugins: IAgentExplorerPlugin[] = [
  {
    "config": {
      "url": "https://cdn.jsdelivr.net/gh/veramolabs/agent-explorer-plugin-brainshare@e75659b2a7bf2cd09528f7d189f9a7fa38e8873d/dist/plugin.js",
      "enabled": true
    },
    "name": "Brain share",
    "description": "Decentralized wiki",
    "requiredMethods": [],
    "routes": [],
    "menuItems": []
  },
  {
    "config": {
      "url": "https://cdn.jsdelivr.net/gh/veramolabs/agent-explorer-plugin-gitcoin-passport@3f6770aa1b5a85f157611e90043419869b12ab45/dist/plugin.js",
      "enabled": true
    },
    "name": "Gitcoin passport",
    "description": "Gitcoin passport stamps",
    "requiredMethods": [],
    "routes": [],
    "menuItems": []
  },
  {
    "config": {
      "url": "https://cdn.jsdelivr.net/gh/veramolabs/agent-explorer-plugin-kudos@c327b6ae48d5706ec5ac413c756a7e39142e98a1/dist/plugin.js",
      "enabled": true
    },
    "name": "Kudos",
    "description": "Explore and give kudos",
    "requiredMethods": [],
    "routes": [],
    "menuItems": []
  },
  {
    "config": {
      "url": "https://cdn.jsdelivr.net/gh/veramolabs/agent-explorer-plugin-graph-view@29730b692843e73453a35b96fdd5a3bb733f01b4/dist/plugin.js",
      "enabled": true
    },
    "name": "Graph View",
    "description": "Explore contacts and credentials in a graph view",
    "requiredMethods": [],
    "routes": [],
    "menuItems": []
  },
  {
    "config": {
      "url": "https://cdn.jsdelivr.net/gh/veramolabs/agent-explorer-plugin-social-feed@7612fc916087802f0ebf1f7589879fa14d3b717c/dist/plugin.js",
      "enabled": true
    },
    "name": "Social Feed",
    "description": "Decentralized reputation and social feed",
    "requiredMethods": [],
    "routes": [],
    "menuItems": []
  },
  {
    "config": {
      "url": "https://cdn.jsdelivr.net/gh/veramolabs/agent-explorer-plugin-developer-tools@439ed9160c383447b9844ed71b25ddf238d0d3ff/dist/plugin.js",
      "enabled": true
    },
    "name": "Developer Tools",
    "description": "Collection of tools for experimenting with verifiable data",
    "requiredMethods": [],
    "routes": [],
    "menuItems": []
  },
  {
    "config": {
      "url": "https://cdn.jsdelivr.net/gh/simonas-notcat/agent-explorer-plugin-codyfight@326b878ecbc2000d1d3cdd9827a51eed569408bf/dist/plugin.js",
      "enabled": true
    },
    "name": "Codyfight",
    "description": "AI Bot for Codyfight.com",
    "requiredMethods": [],
    "routes": [],
    "menuItems": []
  }
]