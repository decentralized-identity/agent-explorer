import { execSync } from 'child_process';
import fs from 'fs';

const plugins = [
  {
    repo: 'veramolabs/agent-explorer-plugin-brainshare',
    name: 'Brain share',
    description: 'Decentralized wiki',
  },
  {
    repo: 'veramolabs/agent-explorer-plugin-gitcoin-passport',
    name: 'Gitcoin passport',
    description: 'Gitcoin passport stamps',
  },
  {
    repo: 'veramolabs/agent-explorer-plugin-kudos',
    name: 'Kudos',
    description: 'Explore and give kudos',
  },
  {
    repo: 'veramolabs/agent-explorer-plugin-graph-view',
    name: 'Graph View',
    description: 'Explore contacts and credentials in a graph view',
  },
  {
    repo: 'veramolabs/agent-explorer-plugin-social-feed',
    name: 'Social Feed',
    description: 'Decentralized reputation and social feed',
  },
  {
    repo: 'veramolabs/agent-explorer-plugin-developer-tools',
    name: 'Developer Tools',
    description: 'Collection of tools for experimenting with verifiable data',
  },

]


const pluginList = plugins.map(plugin => {
  console.log(`Updating ${plugin.name}`)
  const commitId = String(execSync(
    `cd ../../${plugin.repo} && git pull origin main -q && git rev-parse FETCH_HEAD | head -n 1`
  )).slice(0, -1)
  const size = String(execSync(
    `cd ../../${plugin.repo} && du -sh dist/plugin.js`
  )).slice(0, -1)
  console.log(`Commit id: ${commitId}`)
  console.log(`Size: ${size}`)
  return {
    config: {
      url: `github://${plugin.repo}`,
      commitId,
      enabled: true,
    },
    name: plugin.name,
    description: plugin.description,
    requiredMethods: [],
    routes: [],
    menuItems: [],
  }
})

const fileContents = `import { IAgentExplorerPlugin } from "@veramo-community/agent-explorer-plugin";

export const communityPlugins: IAgentExplorerPlugin[] = ${JSON.stringify(pluginList, null, 2)}`

fs.writeFileSync('./packages/agent-explore/src/plugins/community.ts', fileContents)

console.log('Success')
