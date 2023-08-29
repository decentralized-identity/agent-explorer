import React from 'react';
import { UserOutlined } from '@ant-design/icons'
import { IPlugin } from '../../types';

import ManagedIdentifiers from './ManagedIdentifiers';
import Identifier from './Identifier';

const Plugin: IPlugin = {
    //@ts-ignore
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://managed-identifiers',
          },
          name: 'Managed Identifiers',
          description: 'Manage your identifiers',
          requiredMethods: ['didManagerFind'],
          routes: [
            {
              path: '/managed-identifiers',
              element: <ManagedIdentifiers />,
            },
            {
              path: '/managed-identifiers/:id',
              element: <Identifier />,
            },
          ],
          menuItems: [
            {
              name: 'Managed identifiers',
              path: '/managed-identifiers',
              icon: <UserOutlined />,
            },
          ],
          
        }
    }
};

export default Plugin;