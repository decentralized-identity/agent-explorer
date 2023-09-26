import React from 'react';
import { ContactsOutlined } from '@ant-design/icons'
import { IPlugin } from '@veramo-community/agent-explorer-plugin';

import { Contacts } from './Contacts';
import Identifier from './Identifier';

const Plugin: IPlugin = {
    //@ts-ignore
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
              element: <Contacts />,
            },
            {
              path: '/contacts/:id',
              element: <Identifier />,
            },
          ],
          menuItems: [
            {
              name: 'Contacts',
              path: '/contacts',
              icon: <ContactsOutlined />,
            },
          ],
          
        }
    }
};

export default Plugin;