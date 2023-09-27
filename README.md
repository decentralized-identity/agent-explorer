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
