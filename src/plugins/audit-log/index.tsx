import React from 'react';
import { BarsOutlined } from '@ant-design/icons'
import { IPlugin } from '../../types';

import Messages from './Messages';

const Plugin: IPlugin = {
    //@ts-ignore
    init: () => {
        return {
          config: {
            enabled: true,
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