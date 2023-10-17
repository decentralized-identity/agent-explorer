import { IAgentExplorerPlugin, IPlugin } from '@veramo-community/agent-explorer-plugin'
import Identifiers  from './identifiers'
import Contacts  from './contacts'
import Statistics  from './statistics'
import AuditLog  from './audit-log'
import CredentialVerifier  from './credential-verifier'
import Credentials  from './credentials'
import Requests  from './requests'
import Chats  from './chats'
import Profile  from './profile'
import { communityPlugins } from './community'

const corePlugins: IPlugin[] = [
  Profile,
  Statistics,
  Identifiers,
  Credentials,
  CredentialVerifier,
  Contacts,
  Chats,
  AuditLog,
  Requests,
]

export function getcorePlugins(): IAgentExplorerPlugin[] {
  return [
    // FIXME: Temporary workaround
    communityPlugins[0], 
    communityPlugins[1], 
    communityPlugins[2], 
    communityPlugins[3], 
    ...corePlugins.map(plugin => plugin.init())
  ]
}