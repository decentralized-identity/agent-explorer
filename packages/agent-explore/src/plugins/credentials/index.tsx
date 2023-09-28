import React from 'react';
import { SafetyOutlined } from '@ant-design/icons'
import { IPlugin } from '@veramo-community/agent-explorer-plugin';

import Credentials from './Credentials';
import { getCredentialContextMenuItems } from './menu';


const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://credentials',
          },
          name: 'Verifiable credentials',
          description: 'Explore known verifiable credentials',
          requiredMethods: ['dataStoreORMGetVerifiableCredentials'],
          routes: [
            {
              path: '/credentials',
              element: <Credentials />,
            },
            {
              path: '/credentials/:hash',
              element: <Credentials />,
            },
          ],
          menuItems: [
            {
              name: 'Credentials',
              path: '/credentials',
              icon: <SafetyOutlined />,
            },
          ],
          getCredentialContextMenuItems
          
        }
    }
};

export default Plugin;