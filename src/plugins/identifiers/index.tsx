import React from 'react';
import { UserOutlined } from '@ant-design/icons'
import { IPlugin } from '../../types';

import { ManagedIdentifiers } from './ManagedIdentifiers';
import Identifier from './Identifier';

const Plugin: IPlugin = {
    //@ts-ignore
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://identifiers',
          },
          name: 'Identifiers',
          description: 'Manage identifiers',
          requiredMethods: ['didManagerFind'],
          routes: [
            {
              path: '/identifiers',
              element: <ManagedIdentifiers />,
            },
            {
              path: '/identifiers/:id',
              element: <Identifier />,
            },
          ],
          menuItems: [
            {
              name: 'Identifiers',
              path: '/identifiers',
              icon: <UserOutlined />,
            },
          ],
          
        }
    }
};

export default Plugin;