import React from 'react';
import { MessageOutlined } from '@ant-design/icons'
import { IPlugin } from '@veramo-community/agent-explorer-plugin';

import Chats from './Chats';

const Plugin: IPlugin = {
    //@ts-ignore
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://chats',
          },
          name: 'Chats',
          description: 'DIDComm Chats',
          requiredMethods: ['packDIDCommMessage', 'sendDIDCommMessage'],
          routes: [
            {
              path: '/chats',
              element: <Chats />,
            },
            {
              path: '/chats/:threadId',
              element: <Chats />,
            },
          ],
          menuItems: [
            {
              name: 'Chats',
              path: '/chats',
              icon: <MessageOutlined />,
            },
          ],
          
        }
    }
};

export default Plugin;