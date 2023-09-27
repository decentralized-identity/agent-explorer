# Agent Explore

This package can be used to start a web server that allows you to explore an agent's API.
It includes the basic agent explorer web interface that can load the UI plugins and a CLI command to launch it.

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
 
