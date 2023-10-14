import { IPlugin } from '@veramo-community/agent-explorer-plugin';
import { IdentifierHoverComponent } from './IdentifierHoverComponent';
import { IdentifierTabComponent } from './IdentifierTabComponent';
import { UniqueVerifiableCredential } from '@veramo/core-types';
import { Profile } from './Profile';

const Plugin: IPlugin = {
    init: () => {
        return {
          config: {
            enabled: true,
            url: 'core://profile',
          },
          name: 'Profile',
          description: 'Provides support for profile credentials',
          requiredMethods: [],
          getIdentifierHoverComponent: () => IdentifierHoverComponent,
          getCredentialComponent: (credential: UniqueVerifiableCredential) => {
            if (credential.verifiableCredential.type?.includes('Profile')) {
              return Profile
            }
            return undefined
          },
          getIdentifierTabsComponents: () => [
            {
              label: 'Profile',
              component: IdentifierTabComponent,
            },
          ],
        }
    }
};

export default Plugin;