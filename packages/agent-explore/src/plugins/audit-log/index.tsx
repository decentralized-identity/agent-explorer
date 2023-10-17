import React from 'react';
import { BarsOutlined } from '@ant-design/icons'
import { IPlugin } from '@veramo-community/agent-explorer-plugin';

import Messages from './Messages';

const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: false,
            url: 'core://log',
          },
          name: 'Audit Log',
          description: 'System messages',
          requiredMethods: ['dataStoreORMGetMessages'],
          routes: [
            {
              path: '/log',
              element: <Messages />,
            },
          ],
          menuItems: [
            {
              name: 'Audit log',
              path: '/log',
              icon: <BarsOutlined />,
            },
          ],
          
        }
    }
};

export default Plugin;