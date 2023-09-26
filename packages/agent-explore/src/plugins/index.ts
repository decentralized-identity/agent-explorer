import { IAgentExplorerPlugin, IPlugin } from '@veramo-community/agent-explorer-plugin'
import Identifiers  from './identifiers'
import Contacts  from './contacts'
import Statistics  from './statistics'
import AuditLog  from './audit-log'
import CredentialVerifier  from './credential-verifier'
import Credentials  from './credentials'
import Requests  from './requests'
import Chats  from './chats'

const corePlugins: IPlugin[] = [
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
  return corePlugins.map(plugin => plugin.init())
}