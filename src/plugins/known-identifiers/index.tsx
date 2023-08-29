import React from 'react';
import { GlobalOutlined } from '@ant-design/icons'
import { IPlugin } from '../../types';

import KnownIdentifiers from './KnownIdentifiers';
import Identifier from './Identifier';

const Plugin: IPlugin = {
    //@ts-ignore
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://known-identifiers',
          },
          name: 'Known Identifiers',
          description: 'Explore known identifiers',
          requiredMethods: ['dataStoreORMGetIdentifiers'],
          routes: [
            {
              path: '/known-identifiers',
              element: <KnownIdentifiers />,
            },
            {
              path: '/known-identifiers/:id',
              element: <Identifier />,
            },
          ],
          menuItems: [
            {
              name: 'Known identifiers',
              path: '/known-identifiers',
              icon: <GlobalOutlined />,
            },
          ],
          
        }
    }
};

export default Plugin;