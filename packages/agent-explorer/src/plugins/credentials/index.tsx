import React from 'react';
import { SafetyOutlined } from '@ant-design/icons'
import { IPlugin } from '../../types';

import Credentials from './Credentials';


const Plugin: IPlugin = {
    //@ts-ignore
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
          
        }
    }
};

export default Plugin;