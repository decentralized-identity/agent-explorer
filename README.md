# Agent Explorer

## Basic architecture

Agent Explorer is designed to be extended as easily as possible.

**The guiding principle is providing the most flexibility for developers working with Veramo without having to dive into the source of this project.**

### Pages

Pages use templates, currently single and double column. These templates are responsive. Pages can query for page data.

### Modules

Modules are Blocks (Card) that are responsible for fetching their own data. They use `useVeramo` and `useQuery`. Modules may live on multiple pages and may take their query as a prop so it can be cached.

### Blocks

Blocks are dumb Modules. They are always cards but just take data and show it.

### Widgets

Widgets are components except they can fetch their own data. There are no styling restrictions with widgets unlike Blocks that are always Cards.

### Simple Components

Simple Components are the lowest piece and are usually everyting else that lives on a page or within a block, widget or module.

## Hierarchy

The top level is the page followed by either a `Block` OR a `Module`. A `Block` could contain multiple `Widgets`. A `Module` can also contain multiple `Widgets` but maybe needs to fetch data to feed those `Widgets`.

> `Page > Block > Widget > Simple`

> `Page > Module > Widget > Simple`

> `Page > Module > Simple`
