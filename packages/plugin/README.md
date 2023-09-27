# @veramo-community/agent-explorer-plugin

This package defines the common interface for an agent explorer plugin.

## Usage

Plugins have an init function that returns a configuration object.
The configuration object defines locations in the `agent-explore` UI that will get modified by the plugin as well as
some of the methods it will use from the associated Veramo agent.

### Example

A plugin that adds a new menu item and a new page to the UI to manage some contacts.

```tsx
import { IPlugin } from '@veramo-community/agent-explorer-plugin';

const Plugin: IPlugin = {
  init: () => {
    return {
      config: {
        enabled: true,
        url: 'core://contacts',
      },
      name: 'Contacts',
      description: 'Explore contacts',
      requiredMethods: ['dataStoreORMGetIdentifiers'],
      routes: [
        {
          path: '/Contacts',
          element: <Contacts/>,
        },
        {
          path: '/contacts/:id',
          element: <Identifier/>,
        },
      ],
      menuItems: [
        {
          name: 'Contacts',
          path: '/contacts',
          icon: <ContactsOutlined/>,
        },
      ],
    }
  }
};

```

