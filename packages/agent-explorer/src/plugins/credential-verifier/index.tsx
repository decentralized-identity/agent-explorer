import React from 'react';
import { FileProtectOutlined } from '@ant-design/icons'
import { IPlugin } from '@veramo-community/agent-explorer-plugin';

import CredentialVerifier from './CredentialVerifier';

const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://cfredential-verifier',
          },
          name: 'Credential verifier',
          description: 'Verify any supported credential type',
          requiredMethods: ['verifyCredential'],
          routes: [
            {
              path: '/verifier',
              element: <CredentialVerifier />,
            },
          ],
          menuItems: [
            {
              name: 'Credential verifier',
              path: '/verifier',
              icon: <FileProtectOutlined />,
            },
          ],
          
        }
    }
};

export default Plugin;