# Agent Explorer

This monorepo contains the `agent-explore` UI including some core plugins and interface definitions for UI plugins.

## Installation

```bash
npm -g i agent-explore
```

## Usage

```bash
agent-explore serve --port 8080
```

You can specify a default agent configuration

```bash
agent-explore serve --port 8080 --schemaUrl https://example.ngrok.io/open-api.json --apiKey test123 --name Agent
```

## Plugins

Plugins extend the interface defined by `@veramo-community/agent-explorer-plugin` to declare their properties like
name and description, methods used, menu items, content pages, etc.

The agent-explore UI includes a set of core plugins that are enabled by default and also way to load external plugins.

## Development

### Community plugins

The list of community plugins is hardcoded in `./packages/agent-explore/src/plugins/community.ts`. To make sure that the latest version of plugins are used, every entry in that list has a github repo name and the latest commit id. To update this list you have to clone all community plugins locally in a parent folder and run `pnpm update-community-plugins`.

```bash
mkdir veramolabs
cd veramolabs
git clone https://github.com/decentralized-identity/agent-explorer.git
git clone https://github.com/veramolabs/agent-explorer-plugin-brainshare.git
git clone https://github.com/veramolabs/agent-explorer-plugin-gitcoin-passport.git
git clone https://github.com/veramolabs/agent-explorer-plugin-kudos.git
git clone https://github.com/veramolabs/agent-explorer-plugin-graph-view.git
git clone https://github.com/veramolabs/agent-explorer-plugin-social-feed.git
git clone https://github.com/veramolabs/agent-explorer-plugin-developer-tools.git
cd agent-explorer
pnpm i
pnpm update-community-plugins
```

### Publishing

Every commit to the `main` branch triggers a release of [agent-explore](https://www.npmjs.com/package/agent-explore] and [@veramo-community/agent-explorer-plugin](https://www.npmjs.com/package/@veramo-community/agent-explorer-plugin) npm packages. 

There is also a Netlify configuration that automatically gets triggered on every commit to `main`, which deploys https://explore.veramo.io website.

