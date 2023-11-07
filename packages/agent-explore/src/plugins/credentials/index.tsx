import React from 'react';
import { SafetyOutlined } from '@ant-design/icons'
import { IPlugin } from '@veramo-community/agent-explorer-plugin';

import Credentials from './Credentials';
import { getCredentialContextMenuItems } from './menu';
import IdentifierIssuedCredentials from './IdentifierIssuedCredentials';
import IdentifierReceivedCredentials from './IdentifierReceivedCredentials';


const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://credentials',
          },
          name: 'Verifiable credentials',
          description: 'Explore known verifiable credentials',
          icon: <SafetyOutlined />,
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
          getCredentialContextMenuItems,
          getIdentifierTabsComponents: () => {
            return [
              {
                label: 'Issued credentials',
                component: IdentifierIssuedCredentials,
              },
              {
                label: 'Received credentials',
                component: IdentifierReceivedCredentials,
              },
            ]
          },
        }
    }
};

export default Plugin;