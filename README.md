# Agent Explorer

## Basic architecture

Agent Explorer is designed to be extended as easily as possible.

### Pages

Pages use templates, currently single and double column. These templates are responsive. Pages can query for page data.

### Modules

Modules are Blocks (Card) that are responsible for fetching their own data. They use `useVeramo` and `useQuery`. Modules may live on multiple pages and may take their query as a prop so it can be cached.

### Blocks

Blocks are dumb Modules. They are always cards but just take data and show it.

### Components

Components are the lowest piece and are usually everyting else that lives on a page or within a block or module.
