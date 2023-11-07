import React from 'react';
import { UserOutlined } from '@ant-design/icons'
import { IPlugin } from '@veramo-community/agent-explorer-plugin';

import { ManagedIdentifiers } from './ManagedIdentifiers';
import Identifier from './Identifier';
import { IdentifierTabDidDoc } from './IdentifierTabDidDoc';
import { IdentifierTabQRCode } from './IdentifierTabQRCode';
import { IdentifierTabResolution } from './IdentifierTabResolution';

const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://identifiers',
          },
          name: 'Identifiers',
          description: 'Manage identifiers',
          icon: <UserOutlined />,
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
          getIdentifierTabsComponents: () => {
            return [
              {
                label: 'DID Document',
                component: IdentifierTabDidDoc,
              },
              {
                label: 'Resolution result',
                component: IdentifierTabResolution,
              },
              {
                label: 'QR Code',
                component: IdentifierTabQRCode,
              },
            ]
          },
          
        }
    }
};

export default Plugin;