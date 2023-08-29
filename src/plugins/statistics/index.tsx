import React from 'react';
import { EyeOutlined } from '@ant-design/icons'
import { IPlugin } from '../../types';

import Statistics from './Statistics';

const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://statistics',
          },
          name: 'Statistics',
          description: 'Data summary and statistics',
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
          
        }
    }
};

export default Plugin;