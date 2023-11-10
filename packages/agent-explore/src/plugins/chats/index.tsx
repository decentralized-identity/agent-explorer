import React from 'react';
import { MessageOutlined } from '@ant-design/icons'
import { IPlugin } from '@veramo-community/agent-explorer-plugin';

import Chats from './Chats';
import { SaveMessageHandler } from './saveMessageHandler';
import { getCredentialContextMenuItems } from './menu';
import { ShareForm } from './ShareForm';

const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://chats',
          },
          name: 'Chats',
          description: 'DIDComm Chats',
          icon: <MessageOutlined />,
          messageHandlers: [ new SaveMessageHandler()],
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
            {
              path: '/chats/share',
              element: <ShareForm />,
            },
          ],
          getCredentialContextMenuItems,
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