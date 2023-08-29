import React from 'react';
import { InteractionOutlined } from '@ant-design/icons'
import { IPlugin } from '../../types';

import Requests from './Requests';
import CreateResponse from './CreateResponse';

const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://requests',
          },
          name: 'Requests',
          description: 'Selective disclosure requests',
          requiredMethods: ['dataStoreORMGetMessages'],
          routes: [
            {
              path: '/requests',
              element: <Requests />,
            },
            {
              path: '/requests/sdr/:messageId',
              element: <CreateResponse />,
            },
          ],
          menuItems: [
            {
              name: 'Requests',
              path: '/requests',
              icon: <InteractionOutlined />,
            },
          ],
          
        }
    }
};

export default Plugin;