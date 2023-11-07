import React from 'react';
import { EyeOutlined } from '@ant-design/icons'
import { IPlugin } from '@veramo-community/agent-explorer-plugin';

import Statistics from './Statistics';
import { IdentifierHoverComponent } from './IdentifierHoverComponent';

const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://statistics',
          },
          name: 'Statistics',
          description: 'Data summary and statistics',
          icon: <EyeOutlined />,
          requiredMethods: ['dataStoreORMGetVerifiableCredentials'],
          routes: [
            {
              path: '/statistics',
              element: <Statistics />,
            },
          ],
          menuItems: [
            {
              name: 'Statistics',
              path: '/statistics',
              icon: <EyeOutlined />,
            },
          ],
          getIdentifierHoverComponent: () => IdentifierHoverComponent,
        }
    }
};

export default Plugin;