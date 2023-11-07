import { IPlugin } from '@veramo-community/agent-explorer-plugin';
import { IdentifierHoverComponent } from './IdentifierHoverComponent';
import { IdentifierTabComponent } from './IdentifierTabComponent';
import { UniqueVerifiableCredential } from '@veramo/core-types';
import { ReactionCredential } from './ReactionCredential';
import { CredentialActionComponent } from './CredentialActionComponent';
import { SmileOutlined } from '@ant-design/icons';

const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://reactions',
          },
          name: 'Reactions',
          description: 'Emoji reactions',
          icon: <SmileOutlined />,
          requiredMethods: [],
          getIdentifierHoverComponent: () => IdentifierHoverComponent,
          getCredentialComponent: (credential: UniqueVerifiableCredential) => {
            if (credential.verifiableCredential.type?.includes('Reaction')) {
              return ReactionCredential
            }
            return undefined
          },
          getIdentifierTabsComponents: () => [
            {
              label: 'Reactions',
              component: IdentifierTabComponent,
            },
          ],
          getCredentialActionComponents: () => [CredentialActionComponent],
        }
    }
};

export default Plugin;